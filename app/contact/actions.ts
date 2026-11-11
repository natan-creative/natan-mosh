"use server";

import { mailConfigured, sendMail } from "@/lib/mail";
import { toE164 } from "@/lib/phone";
import { getPublishedContent } from "@/lib/store";

export type ContactState = { ok?: true; error?: string } | undefined;

/** טופס יצירת הקשר: שולח מייל פנימי לנתן, ושומר גיבוי בטבלת contact_messages (אם Supabase מחובר) */
export async function sendContact(_: ContactState, form: FormData): Promise<ContactState> {
  // שדה מלכודת: בוטים ממלאים אותו, בני אדם לא רואים אותו
  if (String(form.get("website") ?? "")) return { ok: true };
  const name = String(form.get("name") ?? "").trim().slice(0, 200);
  const phone = toE164(String(form.get("phone") ?? "").slice(0, 30));
  const message = String(form.get("message") ?? "").trim().slice(0, 5000);
  if (!name || !message || !phone) return { error: "צריך למלא שם, טלפון תקין והודעה." };

  const c = await getPublishedContent();
  let delivered = false;
  if (mailConfigured() && c.contact.email) {
    delivered = await sendMail({
      to: c.contact.email,
      subject: `פנייה מהאתר: ${name.replace(/[\r\n]+/g, " ")}`,
      text: `שם: ${name}\nטלפון: ${phone}\n\n${message}`,
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
        body: JSON.stringify({ name, phone, message }),
      });
      saved = res.ok;
    } catch {}
  }

  if (!delivered && !saved) return { error: "משהו לא עבד. אפשר לנסות שוב, או להתקשר ישירות." };
  return { ok: true };
}
