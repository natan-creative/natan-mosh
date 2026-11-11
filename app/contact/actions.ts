"use server";

import { mailRecipient, missingMailEnv, sendMail } from "@/lib/mail";
import { CONTACT_MESSAGE_MAX, isEmail, MOBILE_HINT, toE164 } from "@/lib/phone";
import { getPublishedContent } from "@/lib/store";

/**
 * code: למה נכשל, בלי פרטים רגישים. "invalid" = שדה לא תקין (מוצג למבקר),
 * "mail_env" = חסרים משתני סביבה ל-Resend, "mail_rejected" = Resend דחה או שגיאת רשת (הסיבה המלאה בלוג).
 */
export type ContactState = { ok?: true; error?: string; code?: "invalid" | "mail_env" | "mail_rejected" } | undefined;

/**
 * טופס יצירת הקשר: שולח מייל לנתן דרך Resend, ושומר גיבוי בטבלת contact_messages (אם Supabase מחובר).
 * אישור למבקר רק אם המייל נשלח בפועל. שמירה בלבד לא נחשבת הצלחה, כי אף אחד לא יראה אותה.
 * בלוג נרשמת סיבת הכישלון בלבד: בלי מפתחות, ובלי השם, הטלפון או תוכן הפנייה.
 */
export async function sendContact(_: ContactState, form: FormData): Promise<ContactState> {
  // שדה מלכודת: בוטים ממלאים אותו, בני אדם לא רואים אותו
  if (String(form.get("website") ?? "")) return { ok: true };
  const name = String(form.get("name") ?? "").trim().slice(0, 200);
  const message = String(form.get("message") ?? "").trim();
  if (message.length > CONTACT_MESSAGE_MAX) return { error: `ההודעה ארוכה מדי (עד ${CONTACT_MESSAGE_MAX} תווים).`, code: "invalid" };
  if (!name) return { error: "צריך למלא שם.", code: "invalid" };

  // השדה השני נקבע בניהול (טלפון או מייל). בודקים לפי ההגדרה שפורסמה, לא לפי מה שהדפדפן שלח
  const c = await getPublishedContent();
  const byEmail = c.contact.form.contactField === "email";
  let phone: string | null = null;
  let email: string | null = null;
  if (byEmail) {
    const v = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 320);
    if (!isEmail(v)) return { error: "המייל לא תקין. צריך להיות בפורמט name@domain.com.", code: "invalid" };
    email = v;
  } else {
    phone = toE164(String(form.get("phone") ?? "").slice(0, 30));
    if (!phone) return { error: `מספר הטלפון לא תקין. ${MOBILE_HINT}.`, code: "invalid" };
  }
  if (!message) return { error: "צריך לכתוב הודעה.", code: "invalid" };

  const mail = await sendMail({
    to: mailRecipient(c.contact.email),
    subject: `פנייה מהאתר: ${name.replace(/[\r\n]+/g, " ")}`,
    text: `שם: ${name}\n${email ? `מייל: ${email}` : `טלפון: 0${phone!.slice(4)}`}\n\n${message}`,
    replyTo: email ?? undefined,
  });
  if (!mail.ok) console.error("[contact] mail not sent:", mail.reason);

  let saved = false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/contact_messages`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify(email ? { name, email, message } : { name, phone, message }),
      });
      saved = res.ok;
      if (!res.ok) console.error("[contact] backup save failed:", res.status);
    } catch (e) {
      console.error("[contact] backup save error:", e instanceof Error ? e.message : "unknown");
    }
  }

  if (!mail.ok) {
    if (saved) console.warn("[contact] message saved in Supabase only; email was not delivered");
    return { error: "השליחה נכשלה.", code: missingMailEnv().length ? "mail_env" : "mail_rejected" };
  }
  return { ok: true };
}
