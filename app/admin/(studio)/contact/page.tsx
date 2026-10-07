"use client";

import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, TextInput, Toggle } from "@/components/admin/ui";

export default function ContactEditor() {
  const { content: c, update } = useStudio();
  usePreviewPath("/#contact");
  const set = (k: "title" | "email" | "phone" | "linkedin" | "instagram" | "cta") => (v: string) => update((d) => void (d.contact[k] = v), `contact.${k}`);
  return (
    <>
      <PageHeader title="Contact" intro="פשוט וישיר." />
      <Card>
        <TextInput label="כותרת" dir="ltr" value={c.contact.title} onChange={set("title")} />
        <TextInput label="משפט הזמנה" hint="לא חובה. למשל: יש בריף? בוא נחשוב עליו." value={c.contact.cta} onChange={set("cta")} />
        <TextInput label="מייל" type="email" dir="ltr" value={c.contact.email} onChange={set("email")} />
        <TextInput label="טלפון" dir="ltr" value={c.contact.phone} onChange={set("phone")} />
        <TextInput label="LinkedIn" dir="ltr" value={c.contact.linkedin} onChange={set("linkedin")} />
        <TextInput label="Instagram" dir="ltr" value={c.contact.instagram} onChange={set("instagram")} />
      </Card>
      <Card title="וואטסאפ" hint="הכפתור הירוק שצף בפינה">
        <Toggle label="להציג כפתור וואטסאפ" checked={c.contact.whatsapp.enabled} onChange={(v) => update((d) => void (d.contact.whatsapp.enabled = v))} />
        <TextInput label="מספר" hint="עם קידומת מדינה, למשל 972544766060" dir="ltr" value={c.contact.whatsapp.number} onChange={(v) => update((d) => void (d.contact.whatsapp.number = v), "wa.number")} />
        <TextInput label="הודעה מוכנה" value={c.contact.whatsapp.message} onChange={(v) => update((d) => void (d.contact.whatsapp.message = v), "wa.message")} />
      </Card>
    </>
  );
}
