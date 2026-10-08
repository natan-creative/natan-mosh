"use client";

import Link from "next/link";
import { sectionKey } from "@/lib/content/blocks";
import { ItemActions } from "@/components/admin/fields";
import { SectionMap, TemplatePicker } from "@/components/admin/SectionMap";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { useSections } from "@/components/admin/useSections";
import { Card, EmptyState, PageHeader } from "@/components/admin/ui";

export default function SectionsPage() {
  const { content: c, update } = useStudio();
  const { duplicate, remove } = useSections();
  usePreviewPath("/");
  return (
    <>
      <PageHeader title="סקשנים" intro="סקשנים שבונים לבד: מחלקים לחלקים, ובכל חלק שמים כותרת, טקסט, תמונה או כפתור. הסדר שלהם בדף נקבע ב'סדר ופריסה'." />
      <Card title="הוספת סקשן" hint="בוחרים נקודת התחלה. אחר כך אפשר לשנות הכל: מספר החלקים, הרוחב שלהם ומה יש בתוכם.">
        <TemplatePicker />
      </Card>
      <Card title="הסקשנים שלך">
        {c.custom.length === 0 ? (
          <EmptyState text="עדיין לא נוספו סקשנים." />
        ) : (
          <ul className="ad-list">
            {c.custom.map((s) => {
              const i = c.sections.findIndex((x) => x.id === sectionKey(s.id));
              const hidden = i >= 0 && !c.sections[i].visible;
              return (
                <li key={s.id} className="ad-row" data-hidden={hidden || undefined}>
                  <Link href={`/admin/sections/${s.id}`} className="ad-row-main">
                    <span className="ad-row-thumb is-map">
                      <SectionMap s={s} small />
                    </span>
                    <span>
                      <strong>{s.name}</strong>
                      <span className="ad-hint">
                        {s.cells.length} חלקים · {s.columns} עמודות{hidden ? " · מוסתר" : ""}
                      </span>
                    </span>
                    <span className="ad-row-edit">עריכה ←</span>
                  </Link>
                  <ItemActions
                    kind="סקשן"
                    name={s.name}
                    hidden={hidden}
                    onToggle={() => update((d) => void (d.sections[i].visible = hidden))}
                    onDuplicate={() => duplicate(s)}
                    onDelete={() => remove(s.id)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
