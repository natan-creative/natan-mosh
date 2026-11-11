import "server-only";

// שליחת מייל דרך Resend (API רגיל, בלי תלות חבילה).
// משתני סביבה ב-Vercel: RESEND_API_KEY, EMAIL_FROM (השולח), CONTACT_EMAIL_TO (הנמען, לא חובה).
// בלי דומיין מאומת ב-Resend: EMAIL_FROM=onboarding@resend.dev, והנמען חייב להיות המייל של חשבון Resend.
// MAIL_FROM נשאר כגיבוי לשם הישן.

const mailFrom = () => process.env.EMAIL_FROM || process.env.MAIL_FROM || "";

/** מה חסר כדי לשלוח מייל (שמות המשתנים בלבד, בלי ערכים) */
export function missingMailEnv(): string[] {
  const missing: string[] = [];
  if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
  if (!mailFrom()) missing.push("EMAIL_FROM");
  return missing;
}

/** הנמען: CONTACT_EMAIL_TO מהשרת גובר על המייל שהוגדר בניהול */
export const mailRecipient = (fromAdmin: string) => (process.env.CONTACT_EMAIL_TO || fromAdmin || "").trim();

// הודעות שגיאה של Resend יכולות להכיל כתובות מייל. מסירים אותן לפני שכותבים ללוג.
const redact = (s: string) => s.replace(/[^\s<>"']+@[^\s<>"']+/g, "<email>").slice(0, 300);

export type MailResult = { ok: true; id?: string } | { ok: false; reason: string };

export async function sendMail(input: { to: string; subject: string; text: string; replyTo?: string }): Promise<MailResult> {
  const missing = missingMailEnv();
  if (missing.length) return { ok: false, reason: `missing env: ${missing.join(", ")}` };
  if (!input.to) return { ok: false, reason: "no recipient (CONTACT_EMAIL_TO or admin contact email)" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: mailFrom(), to: [input.to], subject: input.subject, text: input.text, reply_to: input.replyTo }),
    });
    // Resend מחזיר JSON גם בכישלון: { name, message, statusCode }. בודקים אותו, לא רק את הסטטוס.
    const body = (await res.json().catch(() => null)) as { id?: string; name?: string; message?: string } | null;
    if (!res.ok || !body?.id) {
      const detail = [body?.name, body?.message].filter(Boolean).join(": ") || "no details";
      return { ok: false, reason: `resend ${res.status}: ${redact(detail)}` };
    }
    return { ok: true, id: body.id };
  } catch (e) {
    return { ok: false, reason: `network: ${redact(e instanceof Error ? e.message : String(e))}` };
  }
}
