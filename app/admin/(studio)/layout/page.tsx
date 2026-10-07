"use client";

import Link from "next/link";
import type { SectionId } from "@/lib/content/types";
import { move, SortableList } from "@/components/admin/SortableList";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, Toggle } from "@/components/admin/ui";

const NAMES: Record<SectionId, { label: string; href: string }> = {
  work: { label: "Selected Work", href: "/admin/work" },
  digital: { label: "Digital / Ideas", href: "/admin/digital" },
  naming: { label: "Naming", href: "/admin/naming" },
  about: { label: "About", href: "/admin/about" },
  contact: { label: "Contact", href: "/admin/contact" },
};

export default function LayoutEditor() {
  const { content: c, update } = useStudio();
  usePreviewPath("/");
  return (
    <>
      <PageHeader title="סדר ופריסה" intro="אילו אזורים מופיעים בדף הבית, ובאיזה סדר. הסתרה לא מוחקת את התוכן." />
      <Card title="אזורים בדף הבית" hint="Hero תמיד ראשון. About ו-Contact מוצגים זה לצד זה, במקום של הראשון מביניהם.">
        <SortableList
          items={c.sections}
          getId={(s) => s.id}
          label={(s) => NAMES[s.id].label}
          onMove={(a, b) => update((d) => void (d.sections = move(d.sections, a, b)))}
          render={(s, i) => (
            <div className="ad-row" data-hidden={!s.visible || undefined}>
              <div className="ad-row-main">
                <strong>{NAMES[s.id].label}</strong>
                <Link href={NAMES[s.id].href} className="ad-hint">
                  עריכת תוכן ←
                </Link>
              </div>
              <Toggle label={s.visible ? "מוצג" : "מוסתר"} checked={s.visible} onChange={(v) => update((d) => void (d.sections[i].visible = v))} />
            </div>
          )}
        />
      </Card>
      <Card title="עוד">
        <p className="ad-hint">
          עמודות בגריד הדיגיטל: ב<Link href="/admin/digital">Digital / Ideas</Link> ← עיצוב. Header נעוץ: ב<Link href="/admin/header">Header</Link>.
        </p>
      </Card>
    </>
  );
}
