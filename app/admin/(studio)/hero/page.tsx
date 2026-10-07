"use client";

import Link from "next/link";
import { useState } from "react";
import { MediaField } from "@/components/admin/MediaField";
import { LinkInput, SizeTriplet } from "@/components/admin/fields";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, Tabs, TextArea, TextInput, Toggle } from "@/components/admin/ui";

export default function HeroEditor() {
  const { content: c, update } = useStudio();
  const [tab, setTab] = useState<"content" | "design">("content");
  usePreviewPath("/");

  return (
    <>
      <PageHeader title="פתיחה" intro="הדבר הראשון שרואים באתר." />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: "content", label: "תוכן" }, { id: "design", label: "עיצוב" }]} />

      {tab === "content" ? (
        <>
          <Card title="טקסט">
            <TextInput label="שם" hint="מופיע בתפריט העליון ובכל האתר" value={c.brand.name} onChange={(v) => update((d) => void (d.brand.name = v), "brand.name")} />
            <TextArea label="כותרת ראשית" hint="כל שורה תופיע בשורה נפרדת" rows={3} dir="ltr" value={c.hero.headline} onChange={(v) => update((d) => void (d.hero.headline = v), "hero.headline")} />
            <TextArea label="פתק בכתב יד" hint="כל שורה בשורה נפרדת. ריק = בלי פתק." rows={4} value={c.hero.note} onChange={(v) => update((d) => void (d.hero.note = v), "hero.note")} />
            <TextInput label="תפקיד" value={c.brand.role} onChange={(v) => update((d) => void (d.brand.role = v), "brand.role")} />
            <Toggle label="להציג את התפקיד מתחת לכותרת" checked={c.hero.showRole} onChange={(v) => update((d) => void (d.hero.showRole = v))} />
          </Card>
          <Card title="כפתור" hint="לא חובה. בלי טקסט, הכפתור לא יופיע.">
            <TextInput label="טקסט הכפתור" value={c.hero.cta.label} onChange={(v) => update((d) => void (d.hero.cta.label = v), "hero.cta.label")} />
            <LinkInput label="לאן הכפתור מוביל" value={c.hero.cta.href} onChange={(v) => update((d) => void (d.hero.cta.href = v), "hero.cta.href")} />
          </Card>
          <Card title="תמונה וסרטון">
            <MediaField label="תמונה" kind="image" ratio="3/5" value={c.hero.image} onChange={(m) => update((d) => void (d.hero.image = m))} />
            <MediaField label="סרטון" hint="אם יש סרטון, הוא מוצג במקום התמונה (והתמונה משמשת כתמונת פתיחה)." kind="video" ratio="3/5" value={c.hero.video} onChange={(m) => update((d) => void (d.hero.video = m))} />
          </Card>
        </>
      ) : (
        <Card title="גדלים" hint="השינוי משפיע על כל הכותרות מאותו סוג באתר.">
          <SizeTriplet role="display" />
          <SizeTriplet role="hand" />
          <p className="ad-hint">
            פונט, משקל ומרווחים: ב<Link href="/admin/typography">טיפוגרפיה</Link>.
          </p>
        </Card>
      )}
    </>
  );
}
