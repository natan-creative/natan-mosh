/**
 * המרת מספר טלפון שהוקלד לפורמט E.164 (+972...), כמו שסופבייס דורש.
 * מספר ישראלי שמתחיל ב-0 מקבל +972. מחזיר null אם המספר לא נראה תקין.
 */
export function toE164(raw: string): string | null {
  const cleaned = raw.trim().replace(/[\s\-().]/g, "");
  let digits: string;
  if (cleaned.startsWith("+")) digits = "+" + cleaned.slice(1).replace(/\D/g, "");
  else if (cleaned.startsWith("00")) digits = "+" + cleaned.slice(2).replace(/\D/g, "");
  else if (cleaned.startsWith("0")) digits = "+972" + cleaned.slice(1).replace(/\D/g, "");
  else digits = "+" + cleaned.replace(/\D/g, "");
  return /^\+\d{8,15}$/.test(digits) ? digits : null;
}
