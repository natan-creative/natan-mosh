"use server";

import { mailConfigured, sendMail } from "@/lib/mail";
import { getPublishedContent } from "@/lib/store";

export type ContactState = { ok?: true; error?: string } | undefined;

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** טופס יצירת הקשר: שולח מייל לנתן, ושומר גיבוי בטבלת contact_messages (אם Supabase מחובר) */
export async function sendContact(_: ContactState, form: FormData): Promise<ContactState> {
  // שדה מלכודת: בוטים ממלאים אותו, בני אדם לא רואים אותו
  if (String(form.get("website") ?? "")) return { ok: true };
  const name = String(form.get("name") ?? "").trim().slice(0, 200);
  const email = String(form.get("email") ?? "").trim().slice(0, 320);
  const message = String(form.get("message") ?? "").trim().slice(0, 5000);
  if (!name || !message || !EMAIL.test(email)) return { error: "צריך למלא שם, מייל תקין והודעה." };

  const c = await getPublishedContent();
  let delivered = false;
  if (mailConfigured()) {
    delivered = await sendMail({
      to: c.contact.email,
      subject: `פנייה מהאתר: ${name}`,
      text: `שם: ${name}\nמייל: ${email}\n\n${message}`,
      replyTo: email,
    });
  }

  let saved = false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/contact_messages`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ name, email, message }),
      });
      saved = res.ok;
    } catch {}
  }

  if (!delivered && !saved) return { error: "משהו לא עבד. אפשר לנסות שוב, או לשלוח מייל ישירות." };
  return { ok: true };
}
