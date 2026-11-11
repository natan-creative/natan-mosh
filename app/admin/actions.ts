"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { assertAdmin, getAdmin, LOCAL_COOKIE, localToken, safeEqual } from "@/lib/auth";
import { BACKEND } from "@/lib/env";
import { normalizeContent } from "@/lib/content/normalize";
import { describeChanges } from "@/lib/content/diff";
import type { MediaAsset, SiteContent } from "@/lib/content/types";
import { supabaseServer } from "@/lib/supabase/server";
import { CONTENT_TAG, getPublishedContent, store } from "@/lib/store";
import { isEmail, MOBILE_HINT, toE164 } from "@/lib/phone";

const IDENTIFIER_ERROR = `צריך ${MOBILE_HINT}, או מייל תקין עם @.`;

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

/**
 * מזהה כניסה: אם יש @ זה מייל, אחרת טלפון. אפשר להשתמש בשניהם בלי מתג בהגדרות.
 * מחזיר את השדה ש-Supabase צריך, או null אם הערך לא תקין.
 */
function identifierOf(raw: string): { email: string } | { phone: string } | null {
  const v = raw.trim();
  if (v.includes("@")) {
    const email = v.toLowerCase();
    return isEmail(email) ? { email } : null;
  }
  const phone = toE164(v);
  return phone ? { phone } : null;
}

export async function login(_: unknown, form: FormData): Promise<{ error: string } | undefined> {
  const password = String(form.get("password") ?? "");

  if (BACKEND === "supabase") {
    const ident = identifierOf(String(form.get("identifier") ?? ""));
    if (!ident) return { error: IDENTIFIER_ERROR };
    const sb = await supabaseServer();
    const { error } = await sb.auth.signInWithPassword({ ...ident, password });
    if (error) {
      console.warn("[admin] login failed:", error.code ?? error.message);
      if (error.code === "email_not_confirmed" || error.code === "phone_not_confirmed")
        return { error: "המשתמש עוד לא אושר. ב-Supabase: Authentication → Users → לבחור את המשתמש ולאשר אותו." };
      if (error.code === "invalid_credentials") return { error: "הטלפון/המייל או הסיסמה לא נכונים." };
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

export type ForgotResult = { step?: "code" | "sent"; phone?: string; error?: string };

/**
 * כתובת האתר לקישור באיפוס סיסמה במייל. לא לוקחים אותה מה-Host של הבקשה (אפשר לזייף אותה ולקבל קישור לאתר זר).
 * סדר: NEXT_PUBLIC_SITE_URL, ואז הדומיין הראשי של Vercel (משתנה שמוגדר אוטומטית בפרודקשן).
 */
async function siteOrigin(): Promise<string | null> {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (env) return env;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/+$/, "");
  if (vercel) return `https://${vercel}`;
  if (process.env.NODE_ENV === "production") return null;
  const h = await headers();
  return `http://${h.get("host") ?? "localhost:3000"}`;
}

/**
 * איפוס סיסמה. אפשר להזין טלפון או מייל:
 * - טלפון: שולחים קוד ב-SMS (intent=send), ואז בודקים את הקוד וקובעים סיסמה חדשה (intent=reset).
 * - מייל: שולחים קישור איפוס למייל, והקישור פותח טופס סיסמה חדשה.
 * התשובה זהה בין אם המשתמש רשום ובין אם לא (לא חושפים מי רשום).
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

  const ident = identifierOf(String(form.get("identifier") ?? ""));
  if (!ident) return { error: IDENTIFIER_ERROR };
  if ("email" in ident) {
    const origin = await siteOrigin();
    if (!origin) return { error: "חסרה ההגדרה NEXT_PUBLIC_SITE_URL בשרת." };
    const { error } = await sb.auth.resetPasswordForEmail(ident.email, { redirectTo: `${origin}/admin/reset/confirm` });
    if (error?.status === 429) return { error: "יותר מדי בקשות. כדאי לחכות כמה דקות." };
    if (error) console.warn("[admin] reset failed:", error.code ?? error.message);
    return { step: "sent" };
  }
  // SMS. shouldCreateUser: false, כדי שמספר זר לא ייצור משתמש חדש
  const { error } = await sb.auth.signInWithOtp({ phone: ident.phone, options: { shouldCreateUser: false } });
  if (error?.status === 429) return { error: "יותר מדי בקשות. כדאי לחכות כמה דקות." };
  if (error) console.warn("[admin] otp send failed:", error.code ?? error.message);
  return { step: "code", phone: ident.phone };
}

/** קביעת סיסמה חדשה אחרי שהמשתמש פתח את קישור האיפוס במייל (ה-session נוצר ב-/admin/reset/confirm) */
export async function setNewPassword(_: unknown, form: FormData): Promise<{ error: string } | undefined> {
  const password = String(form.get("password") ?? "");
  const again = String(form.get("again") ?? "");
  if (password.length < 10) return { error: "הסיסמה צריכה להיות לפחות 10 תווים." };
  if (password !== again) return { error: "שתי הסיסמאות לא זהות." };
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  if (!data.user) return { error: "הקישור פג תוקף או שכבר נוצל. כדאי לבקש קישור חדש." };
  const { error } = await sb.auth.updateUser({ password });
  if (error) return { error: "לא הצלחנו לשמור את הסיסמה. נסה שוב." };
  // מתנתקים, ומתחברים מחדש עם הסיסמה החדשה
  await sb.auth.signOut();
  redirect("/admin/login?reset=1");
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
