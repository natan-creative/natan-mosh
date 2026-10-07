"use client";

import { MediaField } from "@/components/admin/MediaField";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, TextArea, TextInput } from "@/components/admin/ui";

export default function AboutEditor() {
  const { content: c, update } = useStudio();
  usePreviewPath("/#about");
  return (
    <>
      <PageHeader title="About" intro="כמה שורות. לא קורות חיים." />
      <Card>
        <TextInput label="כותרת" dir="ltr" value={c.about.title} onChange={(v) => update((d) => void (d.about.title = v), "about.title")} />
        <TextArea label="טקסט" hint="כל שורה בפסקה נפרדת" rows={5} value={c.about.body} onChange={(v) => update((d) => void (d.about.body = v), "about.body")} />
        <TextArea label="ציטוט" hint="לא חובה" rows={2} value={c.about.quote} onChange={(v) => update((d) => void (d.about.quote = v), "about.quote")} />
        <MediaField label="תמונה" hint="לא חובה" kind="image" ratio="4/5" value={c.about.image} onChange={(m) => update((d) => void (d.about.image = m))} />
      </Card>
      <Card title="רשתות" hint="אותם קישורים מופיעים גם ב-Contact">
        <TextInput label="LinkedIn" dir="ltr" value={c.contact.linkedin} onChange={(v) => update((d) => void (d.contact.linkedin = v), "contact.linkedin")} />
        <TextInput label="Instagram" dir="ltr" value={c.contact.instagram} onChange={(v) => update((d) => void (d.contact.instagram = v), "contact.instagram")} />
      </Card>
    </>
  );
}
