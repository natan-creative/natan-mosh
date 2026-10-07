import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_DISABLED, BACKEND, LOCAL_ADMIN_ALLOWED } from "@/lib/env";
import { supabaseServer } from "@/lib/supabase/server";

export type Admin = { id: string; email: string };

export const LOCAL_COOKIE = "nk-admin";

/** טוקן של מצב local: HMAC של הסיסמה, כדי שהסיסמה עצמה לא תישמר ב-cookie */
export function localToken(): string | null {
  const pw = process.env.ADMIN_DEV_PASSWORD;
  if (!LOCAL_ADMIN_ALLOWED || !pw) return null;
  return createHmac("sha256", pw).update("nk-admin-v1").digest("hex");
}

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function getAdmin(): Promise<Admin | null> {
  if (AUTH_DISABLED) return { id: "local", email: "מצב בדיקה" };
  if (BACKEND === "supabase") {
    const sb = await supabaseServer();
    const { data } = await sb.auth.getUser();
    if (!data.user) return null;
    // רק מי שרשום בטבלת admins (RLS מאפשר לכל משתמש לראות רק את השורה שלו)
    const { data: row } = await sb.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
    return row ? { id: data.user.id, email: data.user.email ?? "" } : null;
  }
  const token = localToken();
  const cookie = (await cookies()).get(LOCAL_COOKIE)?.value;
  return token && cookie && safeEqual(cookie, token) ? { id: "local", email: "local" } : null;
}

/** לדפים: מפנה ל-login אם אין הרשאה */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/** ל-Server Actions: זורק שגיאה אם אין הרשאה */
export async function assertAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}
