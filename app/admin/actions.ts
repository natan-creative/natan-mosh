"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { assertAdmin, getAdmin, LOCAL_COOKIE, localToken, safeEqual } from "@/lib/auth";
import { BACKEND } from "@/lib/env";
import { normalizeContent } from "@/lib/content/normalize";
import { describeChanges } from "@/lib/content/diff";
import type { MediaAsset, SiteContent } from "@/lib/content/types";
import { supabaseServer } from "@/lib/supabase/server";
import { CONTENT_TAG, getPublishedContent, store } from "@/lib/store";
import { toE164 } from "@/lib/phone";

type Result<T = null> = { ok: true; data: T } | { ok: false; error: string };

async function run<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    await assertAdmin();
    return { ok: true, data: await fn() };
  } catch (e) {
    console.error("[admin]", e);
    return { ok: false, error: e instanceof Error && e.message === "Unauthorized" ? "צריך להתחבר מחדש." : "משהו לא עבד. נסה שוב." };
  }
}

// ---------- Auth ----------

export async function login(_: unknown, form: FormData): Promise<{ error: string } | undefined> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");

  if (BACKEND === "supabase") {
    const sb = await supabaseServer();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) {
      console.warn("[admin] login failed:", error.code ?? error.message);
      if (error.code === "email_not_confirmed")
        return { error: "המשתמש עוד לא אושר. ב-Supabase: Authentication → Users → לבחור את המשתמש → Confirm email." };
      if (error.code === "invalid_credentials") return { error: "המייל או הסיסמה לא נכונים." };
      if (error.code === "over_request_rate_limit" || error.status === 429) return { error: "יותר מדי ניסיונות. כדאי לחכות דקה ולנסות שוב." };
      return { error: `הכניסה נכשלה (${error.code ?? "שגיאה"}).` };
    }
    if (!(await getAdmin())) {
      console.warn("[admin] login ok but user is not in admins table");
      await sb.auth.signOut();
      return { error: "למשתמש הזה אין הרשאת עריכה." };
    }
  } else {
    const token = localToken();
    const expected = process.env.ADMIN_DEV_PASSWORD ?? "";
    if (!token || !expected || !safeEqual(password, expected)) return { error: "הסיסמה לא נכונה." };
    (await cookies()).set(LOCAL_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 });
  }
  redirect("/admin");
}

export type ForgotResult = { step?: "code"; phone?: string; error?: string };

/**
 * איפוס סיסמה ב-SMS, בשני שלבים באותו טופס:
 * 1. intent=send: שולחים קוד חד-פעמי למספר. התשובה זהה בין אם המספר רשום ובין אם לא (לא חושפים מי רשום).
 * 2. intent=reset: בודקים את הקוד, קובעים סיסמה חדשה, מתנתקים ומחזירים לכניסה.
 */
export async function forgotPassword(_: unknown, form: FormData): Promise<ForgotResult | undefined> {
  if (BACKEND !== "supabase") return { error: "איפוס סיסמה זמין רק כשהסטודיו מחובר ל-Supabase." };
  const intent = String(form.get("intent") ?? "send");
  const sb = await supabaseServer();

  if (intent === "reset") {
    const phone = toE164(String(form.get("phone") ?? ""));
    const code = String(form.get("code") ?? "").replace(/\s/g, "");
    const password = String(form.get("password") ?? "");
    const again = String(form.get("again") ?? "");
    if (!phone) return { error: "מספר הטלפון לא תקין. כדאי להתחיל מחדש." };
    if (password.length < 10) return { step: "code", phone, error: "הסיסמה צריכה להיות לפחות 10 תווים." };
    if (password !== again) return { step: "code", phone, error: "שתי הסיסמאות לא זהות." };
    const { error: otpError } = await sb.auth.verifyOtp({ phone, token: code, type: "sms" });
    if (otpError) return { step: "code", phone, error: "הקוד לא נכון או שפג תוקפו. אפשר לשלוח קוד חדש." };
    const { error } = await sb.auth.updateUser({ password });
    if (error) return { step: "code", phone, error: "לא הצלחנו לשמור את הסיסמה. נסה שוב." };
    // מתנתקים, ומתחברים מחדש עם הסיסמה החדשה
    await sb.auth.signOut();
    redirect("/admin/login?reset=1");
  }

  const phone = toE164(String(form.get("phone") ?? ""));
  if (!phone) return { error: "מספר הטלפון לא תקין. לדוגמה 054-1234567." };
  // shouldCreateUser: false, כדי שמספר זר לא ייצור משתמש חדש
  const { error } = await sb.auth.signInWithOtp({ phone, options: { shouldCreateUser: false } });
  if (error?.status === 429) return { error: "יותר מדי בקשות. כדאי לחכות כמה דקות." };
  if (error) console.warn("[admin] otp send failed:", error.code ?? error.message);
  return { step: "code", phone };
}

/** שינוי סיסמה מתוך הסטודיו. דורש את הסיסמה הנוכחית, כדי שמי שנשאר פתוח על מחשב אחר לא יוכל לשנות אותה */
export async function changePassword(_: unknown, form: FormData): Promise<{ ok?: true; error?: string } | undefined> {
  if (BACKEND !== "supabase") return { error: "שינוי סיסמה זמין כשהסטודיו מחובר ל-Supabase." };
  const admin = await getAdmin();
  if (!admin) return { error: "צריך להתחבר מחדש." };
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const again = String(form.get("again") ?? "");
  if (next.length < 10) return { error: "הסיסמה החדשה צריכה להיות לפחות 10 תווים." };
  if (next !== again) return { error: "שתי הסיסמאות החדשות לא זהות." };
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) return { error: "צריך להתחבר מחדש." };
  // בודקים את הסיסמה הנוכחית לפי הזיהוי של המשתמש: טלפון (הרגיל עכשיו) או מייל (משתמשים ישנים)
  const identity = data.user.phone
    ? { phone: data.user.phone.startsWith("+") ? data.user.phone : `+${data.user.phone}` }
    : data.user.email
      ? { email: data.user.email }
      : null;
  if (!identity) return { error: "צריך להתחבר מחדש." };
  const check = await sb.auth.signInWithPassword({ ...identity, password: current });
  if (check.error) return { error: "הסיסמה הנוכחית לא נכונה." };
  const { error } = await sb.auth.updateUser({ password: next });
  if (error) return { error: "לא הצלחנו לשמור את הסיסמה. נסה שוב." };
  return { ok: true };
}

export async function logout() {
  if (BACKEND === "supabase") await (await supabaseServer()).auth.signOut();
  else (await cookies()).delete(LOCAL_COOKIE);
  redirect("/admin/login");
}

// ---------- Content ----------

export async function saveDraft(content: SiteContent) {
  return run(async () => {
    await store.writeDraft(normalizeContent(content));
    return new Date().toISOString();
  });
}

/** "שמור טיוטה" ידני: שומר וגם יוצר נקודת שחזור בהיסטוריה */
export async function saveDraftCheckpoint(content: SiteContent) {
  return run(async () => {
    const c = normalizeContent(content);
    await store.writeDraft(c);
    await store.addRevision("draft", describeChanges(await getPublishedContent(), c), c);
    return new Date().toISOString();
  });
}

export async function publish(content: SiteContent) {
  return run(async () => {
    const c = normalizeContent(content);
    const label = describeChanges(await getPublishedContent(), c);
    await store.writeDraft(c);
    await store.writePublished(c);
    await store.addRevision("publish", label, c);
    updateTag(CONTENT_TAG);
    return c;
  });
}

export async function listRevisions() {
  return run(() => store.listRevisions());
}

export async function getRevision(id: string) {
  return run(async () => {
    const data = await store.readRevision(id);
    if (!data) throw new Error("Revision not found");
    return normalizeContent(data);
  });
}

// ---------- Media ----------

export async function listMedia() {
  return run(() => store.listMedia());
}

export async function registerMedia(m: Omit<MediaAsset, "id" | "createdAt">) {
  return run(() => store.addMedia(m));
}

export async function updateMedia(id: string, patch: Partial<Pick<MediaAsset, "alt" | "caption" | "name" | "src" | "mime" | "size" | "width" | "height">>) {
  return run(() => store.updateMedia(id, patch));
}

export async function deleteMedia(id: string) {
  return run(() => store.deleteMedia(id));
}
