import "server-only";

// שליחת מייל דרך Resend (API רגיל, בלי תלות חבילה). מוגדר ב-Vercel: RESEND_API_KEY ו-MAIL_FROM
export const mailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);

export async function sendMail(input: { to: string; subject: string; text: string; replyTo?: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!key || !from) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [input.to], subject: input.subject, text: input.text, reply_to: input.replyTo }),
    });
    if (!res.ok) console.warn("[mail] send failed:", res.status);
    return res.ok;
  } catch (e) {
    console.warn("[mail] send error", e);
    return false;
  }
}
