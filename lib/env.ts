export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * מצב בדיקה בלי סיסמה (ADMIN_AUTH_DISABLED=1): רק על מחשב מקומי.
 * ב-Vercel הוא לעולם לא פעיל, גם אם המשתנה הוגדר שם בטעות.
 */
export const AUTH_DISABLED = process.env.ADMIN_AUTH_DISABLED === "1" && process.env.VERCEL !== "1";

/** supabase כשיש חיבור, local (קבצים בתיקיית .data) לפיתוח ולמצב בדיקה */
export const BACKEND: "supabase" | "local" = !AUTH_DISABLED && SUPABASE_URL && SUPABASE_ANON_KEY ? "supabase" : "local";

/** מצב local לא זמין בפרודקשן, אלא אם ביקשו במפורש (לבדיקות) */
export const LOCAL_ADMIN_ALLOWED =
  BACKEND === "local" && (AUTH_DISABLED || process.env.NODE_ENV !== "production" || process.env.ALLOW_LOCAL_ADMIN === "1");

export const MEDIA_BUCKET = "media";
