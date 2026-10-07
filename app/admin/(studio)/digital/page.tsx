"use client";

import { useState } from "react";
import { emptyDigital } from "@/lib/content/defaults";
import { DIGITAL_COLUMNS } from "@/lib/content/limits";
import type { DigitalItem } from "@/lib/content/types";
import { MediaField } from "@/components/admin/MediaField";
import { Thumb } from "@/components/admin/MediaLibrary";
import { move, SortableList } from "@/components/admin/SortableList";
import { ItemActions, LinkInput, newId } from "@/components/admin/fields";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Button, Card, EmptyState, NumberInput, PageHeader, Tabs, TextArea, TextInput } from "@/components/admin/ui";

export default function DigitalEditor() {
  const { content: c, update } = useStudio();
  const [tab, setTab] = useState<"content" | "design">("content");
  const [open, setOpen] = useState<string | null>(null);
  usePreviewPath("/#digital");
  const items = c.digital.items;

  const add = () => {
    const id = newId("d");
    update((d) => void d.digital.items.unshift(emptyDigital(id)));
    setOpen(id);
  };

  const field = (it: DigitalItem, k: "title" | "client" | "category" | "year" | "problem" | "idea" | "execution" | "link") => (v: string) =>
    update((d) => {
      const x = d.digital.items.find((x) => x.id === it.id);
      if (x) x[k] = v;
    }, `d.${it.id}.${k}`);

  return (
    <>
      <PageHeader title="דיגיטל ורעיונות" intro="רוחב העבודה השוטפת. לכל עבודה: בעיה → רעיון → ביצוע." actions={<Button variant="primary" onClick={add}>+ הוסף עבודה</Button>} />
      <Tabs value={tab} onChange={setTab} tabs={[{ id: "content", label: "תוכן" }, { id: "design", label: "עיצוב" }]} />

      {tab === "design" ? (
        <Card title="הגריד">
          <div className="ad-cols">
            <NumberInput label="עמודות במחשב" value={c.digital.columns.desktop} min={DIGITAL_COLUMNS.desktop.min} max={DIGITAL_COLUMNS.desktop.max} onChange={(v) => update((d) => void (d.digital.columns.desktop = v))} />
            <NumberInput label="עמודות בטאבלט" value={c.digital.columns.tablet} min={DIGITAL_COLUMNS.tablet.min} max={DIGITAL_COLUMNS.tablet.max} onChange={(v) => update((d) => void (d.digital.columns.tablet = v))} />
            <NumberInput label="עמודות בטלפון" value={c.digital.columns.mobile} min={DIGITAL_COLUMNS.mobile.min} max={DIGITAL_COLUMNS.mobile.max} onChange={(v) => update((d) => void (d.digital.columns.mobile = v))} />
          </div>
          <NumberInput label="כמה עבודות להציג בדף הבית" hint="השאר מופיעות ב'כל העבודות'" value={c.digital.homeLimit} min={1} max={60} onChange={(v) => update((d) => void (d.digital.homeLimit = v))} />
        </Card>
      ) : (
        <>
          <Card title="כותרות האזור">
            <TextInput label="כותרת" dir="ltr" value={c.digital.title} onChange={(v) => update((d) => void (d.digital.title = v), "digital.title")} />
            <TextInput label="טקסט הקישור" value={c.digital.linkLabel} onChange={(v) => update((d) => void (d.digital.linkLabel = v), "digital.link")} />
          </Card>
          {items.length === 0 ? (
            <EmptyState text="עדיין אין עבודות כאן." action={<Button variant="primary" onClick={add}>+ הוסף עבודה</Button>} />
          ) : (
            <SortableList
              items={items}
              getId={(it) => it.id}
              label={(it) => it.title}
              onMove={(a, b) => update((d) => void (d.digital.items = move(d.digital.items, a, b)))}
              render={(it, i) => (
                <div className="ad-expand" data-hidden={it.hidden || undefined}>
                  <div className="ad-row">
                    <button type="button" className="ad-row-main" aria-expanded={open === it.id} onClick={() => setOpen(open === it.id ? null : it.id)}>
                      <span className="ad-row-thumb">{it.media && <Thumb asset={{ kind: it.media.kind, src: it.media.src, name: "" }} />}</span>
                      <span>
                        <strong>{it.title || "ללא שם"}</strong>
                        <span className="ad-hint">
                          {[it.client, it.year].filter(Boolean).join(" · ") || "—"}
                          {i >= c.digital.homeLimit ? " · רק ב'כל העבודות'" : ""}
                          {it.hidden ? " · מוסתר" : ""}
                        </span>
                      </span>
                      <span className="ad-row-edit">{open === it.id ? "סגירה ↑" : "עריכה ↓"}</span>
                    </button>
                    <ItemActions
                      kind="עבודה"
                      name={it.title}
                      hidden={it.hidden}
                      onToggle={() => update((d) => void (d.digital.items[i].hidden = !it.hidden))}
                      onDuplicate={() => update((d) => void d.digital.items.splice(i + 1, 0, { ...structuredClone(it), id: newId("d"), title: `${it.title} (עותק)` }))}
                      onDelete={() => update((d) => void (d.digital.items = d.digital.items.filter((x) => x.id !== it.id)))}
                    />
                  </div>
                  {open === it.id && (
                    <div className="ad-expand-body">
                      <div className="ad-cols">
                        <TextInput label="שם העבודה" value={it.title} onChange={field(it, "title")} />
                        <TextInput label="לקוח" value={it.client} onChange={field(it, "client")} />
                      </div>
                      <div className="ad-cols">
                        <TextInput label="קטגוריה" value={it.category} onChange={field(it, "category")} />
                        <TextInput label="שנה" value={it.year} onChange={field(it, "year")} />
                      </div>
                      <TextArea label="בעיה" hint="מה היה צריך לפתור?" rows={2} value={it.problem} onChange={field(it, "problem")} />
                      <TextArea label="רעיון" hint="הרעיון במשפט" rows={2} value={it.idea} onChange={field(it, "idea")} />
                      <TextArea label="ביצוע" hint="מה יצא בפועל" rows={2} value={it.execution} onChange={field(it, "execution")} />
                      <LinkInput label="קישור" hint="לא חובה" value={it.link} onChange={field(it, "link")} />
                      <MediaField label="תמונה או סרטון" ratio="1/1" value={it.media} onChange={(m) => update((d) => void (d.digital.items[i].media = m))} />
                    </div>
                  )}
                </div>
              )}
            />
          )}
        </>
      )}
    </>
  );
}
