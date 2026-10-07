export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** supabase כשיש חיבור, local (קבצים בתיקיית .data) לפיתוח בלבד */
export const BACKEND: "supabase" | "local" = SUPABASE_URL && SUPABASE_ANON_KEY ? "supabase" : "local";

/** מצב local לא זמין בפרודקשן, אלא אם ביקשו במפורש (לבדיקות) */
export const LOCAL_ADMIN_ALLOWED =
  BACKEND === "local" && (process.env.NODE_ENV !== "production" || process.env.ALLOW_LOCAL_ADMIN === "1");

export const MEDIA_BUCKET = "media";
