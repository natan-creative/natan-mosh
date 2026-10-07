"use client";

import { MediaField } from "@/components/admin/MediaField";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, TextArea, TextInput } from "@/components/admin/ui";

export default function SeoEditor() {
  const { content: c, update } = useStudio();
  usePreviewPath("/");
  const s = c.settings;
  return (
    <>
      <PageHeader title="גוגל ושיתוף" intro="איך האתר נראה בגוגל ובשיתוף ברשתות." />
      <Card>
        <TextInput label="כותרת העמוד" hint={`${s.siteTitle.length} תווים · מומלץ עד 60`} value={s.siteTitle} onChange={(v) => update((d) => void (d.settings.siteTitle = v), "seo.title")} />
        <TextArea label="תיאור" hint={`${s.metaDescription.length} תווים · מומלץ עד 155`} rows={3} value={s.metaDescription} onChange={(v) => update((d) => void (d.settings.metaDescription = v), "seo.desc")} />
        <TextInput label="כתובת האתר (Canonical)" hint="הדומיין הסופי, למשל https://natankosovsky.com" dir="ltr" value={s.canonical} onChange={(v) => update((d) => void (d.settings.canonical = v.trim()), "seo.canonical")} />
        <MediaField label="תמונת שיתוף (OG)" hint="מופיעה כששולחים את הקישור בוואטסאפ, בלינקדאין וכו'. מומלץ 1200×630." kind="image" ratio="1200/630" value={s.ogImage} onChange={(m) => update((d) => void (d.settings.ogImage = m))} />
      </Card>
      <Card title="כך זה ייראה בגוגל">
        <div className="ad-serp">
          <span className="ad-serp-url" dir="ltr">
            {s.canonical || "natankosovsky.com"}
          </span>
          <strong>{s.siteTitle}</strong>
          <p>{s.metaDescription}</p>
        </div>
      </Card>
    </>
  );
}
