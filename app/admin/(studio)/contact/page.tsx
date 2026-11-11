"use client";

import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, TextInput, Toggle } from "@/components/admin/ui";
import { isEmail, isIsraeliMobile, MOBILE_HINT } from "@/lib/phone";

export default function ContactEditor() {
  const { content: c, update } = useStudio();
  usePreviewPath("/#contact");
  const set = (k: "title" | "email" | "phone" | "linkedin" | "instagram" | "cta") => (v: string) => update((d) => void (d.contact[k] = v), `contact.${k}`);
  const form = (k: "title" | "text" | "button" | "success" | "nameLabel" | "phoneLabel" | "messageLabel" | "errorText", label: string, hint?: string) => (
    <TextInput label={label} hint={hint} value={c.contact.form[k]} onChange={(v) => update((d) => void (d.contact.form[k] = v), `form.${k}`)} />
  );
  return (
    <>
      <PageHeader title="יצירת קשר" intro="פשוט וישיר." />
      <Card title="פרטי הקשר באתר" hint="הטלפון הוא הדרך הראשית ליצור קשר. הכפתור הירוק (וואטסאפ) נשאר נפרד, למטה.">
        <TextInput label="כותרת" dir="ltr" value={c.contact.title} onChange={set("title")} />
        <TextInput label="משפט הזמנה" hint="לא חובה. למשל: יש בריף? בוא נחשוב עליו." value={c.contact.cta} onChange={set("cta")} />
        <TextInput label="טלפון" hint={`${MOBILE_HINT}. אפשר עם מקפים לתצוגה, למשל 054-476-6060`} dir="ltr" type="tel" value={c.contact.phone} onChange={set("phone")} />
        {c.contact.phone && !isIsraeliMobile(c.contact.phone) && <p className="ad-warning">המספר לא נראה תקין. {MOBILE_HINT}.</p>}
        <TextInput label="LinkedIn" dir="ltr" value={c.contact.linkedin} onChange={set("linkedin")} />
        <TextInput label="Instagram" dir="ltr" value={c.contact.instagram} onChange={set("instagram")} />
      </Card>
      <Card title="טופס יצירת קשר" hint="הטופס הקטן בתחתית העמוד. ההודעות נשמרות ב-Supabase (Table Editor → contact_messages).">
        <Toggle label="להציג את הטופס" checked={c.contact.form.enabled} onChange={(v) => update((d) => void (d.contact.form.enabled = v))} />
        {c.contact.form.enabled && (
          <>
            {form("title", "כותרת")}
            {form("text", "טקסט", "משפט קצר מתחת לכותרת. ריק = בלי טקסט.")}
            {form("nameLabel", "שדה שם")}
            {form("phoneLabel", "שדה טלפון")}
            {form("messageLabel", "שדה הודעה")}
            {form("button", "טקסט הכפתור")}
            {form("success", "הודעה אחרי שליחה")}
            {form("errorText", "הודעת שגיאה", "מוצגת אם השליחה נכשלה.")}
            <TextInput
              label="מייל לקבלת הפניות"
              hint="לא מוצג באתר. לכאן נשלחת כל הודעה מהטופס, אלא אם הוגדר CONTACT_EMAIL_TO בשרת (הוא גובר)."
              type="email"
              dir="ltr"
              value={c.contact.email}
              onChange={set("email")}
            />
            {c.contact.email && !isEmail(c.contact.email) && <p className="ad-warning">המייל לא תקין. צריך להיות בפורמט name@domain.com.</p>}
          </>
        )}
      </Card>
      <Card title="וואטסאפ" hint="הכפתור הירוק שצף בפינה">
        <Toggle label="להציג כפתור וואטסאפ" checked={c.contact.whatsapp.enabled} onChange={(v) => update((d) => void (d.contact.whatsapp.enabled = v))} />
        <TextInput label="מספר" hint="עם קידומת מדינה, למשל 972544766060" dir="ltr" value={c.contact.whatsapp.number} onChange={(v) => update((d) => void (d.contact.whatsapp.number = v), "wa.number")} />
        <TextInput label="הודעה מוכנה" value={c.contact.whatsapp.message} onChange={(v) => update((d) => void (d.contact.whatsapp.message = v), "wa.message")} />
      </Card>
    </>
  );
}
