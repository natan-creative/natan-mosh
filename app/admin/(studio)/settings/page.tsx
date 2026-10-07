"use client";

import Link from "next/link";
import { MediaField } from "@/components/admin/MediaField";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, TextInput } from "@/components/admin/ui";

export default function SettingsEditor() {
  const { content: c, update, backend } = useStudio();
  usePreviewPath("/");
  const ga = c.settings.gaId;
  return (
    <>
      <PageHeader title="הגדרות" />
      <Card title="פרטים כלליים">
        <TextInput label="שם האתר" value={c.settings.siteTitle} onChange={(v) => update((d) => void (d.settings.siteTitle = v), "seo.title")} />
        <TextInput label="מייל" type="email" dir="ltr" value={c.contact.email} onChange={(v) => update((d) => void (d.contact.email = v), "contact.email")} />
        <TextInput label="טלפון" dir="ltr" value={c.contact.phone} onChange={(v) => update((d) => void (d.contact.phone = v), "contact.phone")} />
        <p className="ad-hint">
          רשתות ווואטסאפ: ב<Link href="/admin/contact">יצירת קשר</Link>.
        </p>
      </Card>
      <Card title="Favicon" hint="האייקון הקטן בלשונית הדפדפן. תמונה ריבועית, PNG.">
        <MediaField label="Favicon" kind="image" ratio="1/1" value={c.settings.favicon} onChange={(m) => update((d) => void (d.settings.favicon = m))} />
      </Card>
      <Card title="Google Analytics" hint="מזהה המדידה מתחיל ב-G-. ריק = בלי מדידה.">
        <TextInput label="Measurement ID" dir="ltr" placeholder="G-XXXXXXXXXX" value={ga} onChange={(v) => update((d) => void (d.settings.gaId = v.trim().toUpperCase()), "ga")} />
        {ga && !/^G-[A-Z0-9]+$/.test(ga) && <p className="ad-warning">המזהה לא נראה תקין (צריך להיות G- ואחריו אותיות ומספרים).</p>}
      </Card>
      <Card title="מערכת">
        <p className="ad-hint">מקור הנתונים: {backend === "supabase" ? "Supabase" : "קבצים מקומיים (מצב פיתוח)"}</p>
      </Card>
    </>
  );
}
