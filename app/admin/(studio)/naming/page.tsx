"use client";

import { useState } from "react";
import { emptyName } from "@/lib/content/defaults";
import type { NameItem, NameStyle } from "@/lib/content/types";
import { MediaField } from "@/components/admin/MediaField";
import { move, SortableList } from "@/components/admin/SortableList";
import { ItemActions, newId } from "@/components/admin/fields";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Button, Card, EmptyState, NumberInput, PageHeader, Segmented, TextInput } from "@/components/admin/ui";

const STYLES: { value: NameStyle; label: string }[] = [
  { value: "black", label: "שחור עבה" },
  { value: "heavy", label: "כבד (עברית)" },
  { value: "serif", label: "סריף" },
  { value: "spaced", label: "סריף מרווח" },
  { value: "wide", label: "רחב" },
];

export default function NamingEditor() {
  const { content: c, update } = useStudio();
  const [open, setOpen] = useState<string | null>(null);
  usePreviewPath("/#naming");
  const items = c.naming.items;

  const add = () => {
    const id = newId("nm");
    update((d) => void d.naming.items.push(emptyName(id)));
    setOpen(id);
  };
  const field = (it: NameItem, k: "name" | "description" | "note" | "client" | "year") => (v: string) =>
    update((d) => {
      const x = d.naming.items.find((x) => x.id === it.id);
      if (x) x[k] = v;
    }, `nm.${it.id}.${k}`);

  return (
    <>
      <PageHeader title="שמות" intro="שמות שיצרת. הסגנון קובע איך השם נראה באתר." actions={<Button variant="primary" onClick={add}>+ הוסף שם</Button>} />
      <Card title="האזור">
        <TextInput label="כותרת" dir="ltr" value={c.naming.title} onChange={(v) => update((d) => void (d.naming.title = v), "naming.title")} />
        <NumberInput label="כמה שמות להציג לפני 'לכל השמות'" value={c.naming.visibleCount} min={1} max={24} onChange={(v) => update((d) => void (d.naming.visibleCount = v))} />
      </Card>
      {items.length === 0 ? (
        <EmptyState text="עדיין אין שמות כאן." action={<Button variant="primary" onClick={add}>+ הוסף שם</Button>} />
      ) : (
        <SortableList
          items={items}
          getId={(it) => it.id}
          label={(it) => it.name}
          onMove={(a, b) => update((d) => void (d.naming.items = move(d.naming.items, a, b)))}
          render={(it, i) => (
            <div className="ad-expand" data-hidden={it.hidden || undefined}>
              <div className="ad-row">
                <button type="button" className="ad-row-main" aria-expanded={open === it.id} onClick={() => setOpen(open === it.id ? null : it.id)}>
                  <span className={`ad-name-preview name-mark is-${it.style}`} dir="auto">
                    {it.name}
                  </span>
                  <span className="ad-hint">
                    {it.description}
                    {it.hidden ? " · מוסתר" : ""}
                  </span>
                  <span className="ad-row-edit">{open === it.id ? "סגירה ↑" : "עריכה ↓"}</span>
                </button>
                <ItemActions
                  kind="שם"
                  name={it.name}
                  hidden={it.hidden}
                  onToggle={() => update((d) => void (d.naming.items[i].hidden = !it.hidden))}
                  onDelete={() => update((d) => void (d.naming.items = d.naming.items.filter((x) => x.id !== it.id)))}
                />
              </div>
              {open === it.id && (
                <div className="ad-expand-body">
                  <TextInput label="השם" value={it.name} onChange={field(it, "name")} />
                  <Segmented label="סגנון" value={it.style} onChange={(v) => update((d) => void (d.naming.items[i].style = v))} options={STYLES} />
                  <TextInput label="מה זה" hint="מותג, מוצר, סדרה…" value={it.description} onChange={field(it, "description")} />
                  <TextInput label="הסבר קצר" hint="רק אם זה מוסיף. מופיע במעבר עכבר." value={it.note} onChange={field(it, "note")} />
                  <div className="ad-cols">
                    <TextInput label="לקוח" value={it.client} onChange={field(it, "client")} />
                    <TextInput label="שנה" value={it.year} onChange={field(it, "year")} />
                  </div>
                  <MediaField label="תמונה (לא חובה)" kind="image" value={it.image} onChange={(m) => update((d) => void (d.naming.items[i].image = m))} />
                </div>
              )}
            </div>
          )}
        />
      )}
    </>
  );
}
