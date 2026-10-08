"use client";

import Link from "next/link";
import type { SectionId, SectionKey, SiteContent } from "@/lib/content/types";
import { TemplatePicker } from "@/components/admin/SectionMap";
import { move, SortableList } from "@/components/admin/SortableList";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, Toggle } from "@/components/admin/ui";

const NAMES: Record<SectionId, { label: string; href: string }> = {
  work: { label: "עבודות נבחרות", href: "/admin/work" },
  digital: { label: "דיגיטל ורעיונות", href: "/admin/digital" },
  naming: { label: "שמות", href: "/admin/naming" },
  about: { label: "אודות", href: "/admin/about" },
  contact: { label: "יצירת קשר", href: "/admin/contact" },
};

function info(c: SiteContent, id: SectionKey) {
  if (!id.startsWith("c:")) return NAMES[id as SectionId];
  const s = c.custom.find((x) => `c:${x.id}` === id);
  return { label: `סקשן: ${s?.name ?? ""}`, href: `/admin/sections/${s?.id}` };
}

export default function LayoutEditor() {
  const { content: c, update } = useStudio();
  usePreviewPath("/");
  return (
    <>
      <PageHeader title="סדר ופריסה" intro="אילו אזורים מופיעים בדף הבית, ובאיזה סדר. הסתרה לא מוחקת את התוכן." />
      <Card title="אזורים בדף הבית" hint="הפתיחה תמיד ראשונה. אודות ויצירת קשר מוצגים זה לצד זה, במקום של הראשון מביניהם.">
        <SortableList
          items={c.sections}
          getId={(s) => s.id}
          label={(s) => info(c, s.id).label}
          onMove={(a, b) => update((d) => void (d.sections = move(d.sections, a, b)))}
          render={(s, i) => (
            <div className="ad-row" data-hidden={!s.visible || undefined}>
              <div className="ad-row-main">
                <strong>{info(c, s.id).label}</strong>
                <Link href={info(c, s.id).href} className="ad-hint">
                  עריכת תוכן ←
                </Link>
              </div>
              <Toggle label={s.visible ? "מוצג" : "מוסתר"} checked={s.visible} onChange={(v) => update((d) => void (d.sections[i].visible = v))} />
            </div>
          )}
        />
      </Card>
      <Card title="הוספת סקשן" hint="סקשן חדש נכנס לפני אודות. אחר כך אפשר לגרור אותו לכל מקום ברשימה.">
        <TemplatePicker />
      </Card>
      <Card title="עוד">
        <p className="ad-hint">
          עמודות בגריד הדיגיטל: ב<Link href="/admin/digital">דיגיטל ורעיונות</Link> ← עיצוב. תפריט שנשאר למעלה: ב<Link href="/admin/header">תפריט עליון</Link>.
        </p>
      </Card>
    </>
  );
}
