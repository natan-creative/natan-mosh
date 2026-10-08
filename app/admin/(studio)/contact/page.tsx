"use client";

import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, TextInput, Toggle } from "@/components/admin/ui";

export default function ContactEditor() {
  const { content: c, update } = useStudio();
  usePreviewPath("/#contact");
  const set = (k: "title" | "email" | "phone" | "linkedin" | "instagram" | "cta") => (v: string) => update((d) => void (d.contact[k] = v), `contact.${k}`);
  return (
    <>
      <PageHeader title="יצירת קשר" intro="פשוט וישיר." />
      <Card>
        <TextInput label="כותרת" dir="ltr" value={c.contact.title} onChange={set("title")} />
        <TextInput label="משפט הזמנה" hint="לא חובה. למשל: יש בריף? בוא נחשוב עליו." value={c.contact.cta} onChange={set("cta")} />
        <TextInput label="מייל" type="email" dir="ltr" value={c.contact.email} onChange={set("email")} />
        <TextInput label="טלפון" dir="ltr" value={c.contact.phone} onChange={set("phone")} />
        <TextInput label="LinkedIn" dir="ltr" value={c.contact.linkedin} onChange={set("linkedin")} />
        <TextInput label="Instagram" dir="ltr" value={c.contact.instagram} onChange={set("instagram")} />
      </Card>
      <Card title="טופס יצירת קשר" hint="הטופס הקטן בתחתית העמוד. ההודעות נשמרות ב-Supabase (Table Editor → contact_messages).">
        <Toggle label="להציג את הטופס" checked={c.contact.form.enabled} onChange={(v) => update((d) => void (d.contact.form.enabled = v))} />
        {c.contact.form.enabled && (
          <>
            <TextInput label="כותרת" value={c.contact.form.title} onChange={(v) => update((d) => void (d.contact.form.title = v), "form.title")} />
            <TextInput label="טקסט" hint="משפט קצר מתחת לכותרת. ריק = בלי טקסט." value={c.contact.form.text} onChange={(v) => update((d) => void (d.contact.form.text = v), "form.text")} />
            <TextInput label="טקסט הכפתור" value={c.contact.form.button} onChange={(v) => update((d) => void (d.contact.form.button = v), "form.button")} />
            <TextInput label="הודעה אחרי שליחה" value={c.contact.form.success} onChange={(v) => update((d) => void (d.contact.form.success = v), "form.success")} />
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
