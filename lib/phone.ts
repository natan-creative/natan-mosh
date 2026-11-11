/** קידומות נייד ישראליות מותרות */
export const MOBILE_PREFIXES = ["050", "052", "053", "054", "055", "058"] as const;

/** לבדיקה בדפדפן (pattern של input): בדיוק 10 ספרות, מתחיל באחת הקידומות */
export const MOBILE_PATTERN = "05[023458][0-9]{7}";

export const MOBILE_HINT = `נייד ישראלי: 10 ספרות, מתחיל ב-${MOBILE_PREFIXES.join(", ")}`;

/** האם זה נייד ישראלי תקין (מתעלמים ממקפים ורווחים) */
export const isIsraeliMobile = (raw: string) => new RegExp(`^${MOBILE_PATTERN}$`).test(raw.replace(/[\s-]/g, ""));

/**
 * נייד ישראלי (10 ספרות, 050/052/053/054/055/058) בפורמט E.164 (+9725...), כמו ש-Supabase דורש.
 * כל דבר אחר (קווי, מספר זר, אורך שגוי) מחזיר null.
 */
export function toE164(raw: string): string | null {
  const digits = raw.replace(/[\s-]/g, "");
  return isIsraeliMobile(digits) ? `+972${digits.slice(1)}` : null;
}

/** אורך מקסימלי להודעה בטופס יצירת הקשר */
export const CONTACT_MESSAGE_MAX = 150;

/** מייל תקין: משהו@דומיין.סיומת */
export const isEmail = (raw: string) => /^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(raw.trim());
