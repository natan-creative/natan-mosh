"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BLOCK_LABELS, emptyBlock, emptyCell, sectionAnchor, sectionKey } from "@/lib/content/blocks";
import { CUSTOM, RATIOS } from "@/lib/content/limits";
import type { Align, Block, BlockKind, Cell, CustomSection } from "@/lib/content/types";
import { MediaField } from "@/components/admin/MediaField";
import { SectionMap } from "@/components/admin/SectionMap";
import { move, SortableList } from "@/components/admin/SortableList";
import { ItemActions, LinkInput, newId } from "@/components/admin/fields";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { useSections } from "@/components/admin/useSections";
import { Button, Card, NumberInput, PageHeader, Segmented, Select, TextArea, TextInput, Toggle } from "@/components/admin/ui";

const ALIGN: { value: Align; label: string }[] = [
  { value: "start", label: "ימין" },
  { value: "center", label: "מרכז" },
  { value: "end", label: "שמאל" },
];

const summary = (b: Block) => (b.kind === "image" ? (b.media?.alt || (b.media ? "תמונה" : "עוד לא נבחרה")) : b.text.split("\n")[0] || "—");

export default function SectionEditor() {
  const { id } = useParams<{ id: string }>();
  const { content: c, update } = useStudio();
  const router = useRouter();
  const { duplicate, remove } = useSections();
  const [sel, setSel] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const s = c.custom.find((x) => x.id === id);
  usePreviewPath(`/#${sectionAnchor(id)}`);

  if (!s) {
    return (
      <>
        <PageHeader title="הסקשן לא נמצא" intro="ייתכן שהוא נמחק." />
        <Link href="/admin/sections" className="ad-btn ad-btn-secondary">
          חזרה לסקשנים
        </Link>
      </>
    );
  }

  const key = sectionKey(s.id);
  const visible = c.sections.find((x) => x.id === key)?.visible ?? true;
  const cellIndex = Math.max(0, s.cells.findIndex((x) => x.id === sel));
  const cell: Cell | undefined = s.cells[cellIndex];

  const up = (fn: (x: CustomSection) => void, k?: string) =>
    update((d) => {
      const x = d.custom.find((x) => x.id === id);
      if (x) fn(x);
    }, k && `sec.${id}.${k}`);
  const upCell = (cellId: string, fn: (x: Cell) => void, k?: string) =>
    up((x) => {
      const cl = x.cells.find((y) => y.id === cellId);
      if (cl) fn(cl);
    }, k && `${cellId}.${k}`);
  const upBlock = (cellId: string, blockId: string, fn: (b: Block) => void, k?: string) =>
    upCell(cellId, (cl) => {
      const b = cl.blocks.find((y) => y.id === blockId);
      if (b) fn(b);
    }, k && `${blockId}.${k}`);

  const addCell = () => {
    const nc = emptyCell(newId("cell"));
    up((x) => void x.cells.push(nc));
    setSel(nc.id);
  };
  const addBlock = (kind: BlockKind) => {
    if (!cell) return;
    const b = emptyBlock(newId("b"), kind);
    upCell(cell.id, (cl) => void cl.blocks.push(b));
    setOpen(b.id);
  };

  return (
    <>
      <PageHeader
        title={s.name}
        intro="בוחרים חלק במפה, ומוסיפים לתוכו רכיבים. בטאבלט הסקשן מצטמצם לעד 2 עמודות, ובטלפון הכל בטור (חלקים ריקים לא מוצגים)."
        actions={
          <ItemActions
            kind="סקשן"
            name={s.name}
            onDuplicate={() => router.push(`/admin/sections/${duplicate(s)}`)}
            onDelete={() => {
              router.push("/admin/sections");
              remove(s.id);
            }}
          />
        }
      />

      <Card title="הסקשן">
        <div className="ad-cols">
          <TextInput label="שם (רק ב-Admin)" value={s.name} onChange={(v) => up((x) => void (x.name = v), "name")} />
          <TextInput label="כותרת באתר" hint="לא חובה" value={s.title} onChange={(v) => up((x) => void (x.title = v), "title")} />
        </div>
        <Toggle label={visible ? "מוצג בדף הבית" : "מוסתר"} checked={visible} onChange={(v) => update((d) => void (d.sections.find((x) => x.id === key)!.visible = v))} />
        <Segmented
          label="ריווח בין החלקים"
          value={s.gap}
          onChange={(gap) => up((x) => void (x.gap = gap))}
          options={[
            { value: "s", label: "צפוף" },
            { value: "m", label: "רגיל" },
            { value: "l", label: "מרווח" },
          ]}
        />
        <Segmented
          label="רקע"
          value={s.tone}
          onChange={(tone) => up((x) => void (x.tone = tone))}
          options={[
            { value: "default", label: "כמו האתר" },
            { value: "inverted", label: "הפוך (כהה)" },
          ]}
        />
      </Card>

      <Card title="חלוקה" hint="לוחצים על חלק כדי לערוך אותו. הסדר במפה הוא הסדר באתר, מימין לשמאל.">
        <Segmented
          label="עמודות"
          value={s.columns}
          onChange={(n) =>
            up((x) => {
              x.columns = n;
              for (const cl of x.cells) cl.span = Math.min(cl.span, n);
            })
          }
          options={[1, 2, 3, 4].map((n) => ({ value: n, label: String(n) }))}
        />
        <SectionMap s={s} selected={cell?.id} onSelect={setSel} onAdd={s.cells.length < CUSTOM.cells ? addCell : undefined} />
        {cell && (
          <div className="ad-cell-bar">
            <strong>חלק {cellIndex + 1}</strong>
            <div className="ad-group" role="group" aria-label="מיקום החלק">
              <Button disabled={cellIndex === 0} onClick={() => up((x) => void (x.cells = move(x.cells, cellIndex, cellIndex - 1)))}>
                → ימינה
              </Button>
              <Button disabled={cellIndex === s.cells.length - 1} onClick={() => up((x) => void (x.cells = move(x.cells, cellIndex, cellIndex + 1)))}>
                שמאלה ←
              </Button>
            </div>
            {s.columns > 1 && (
              <NumberInput label="רוחב (עמודות)" value={Math.min(cell.span, s.columns)} min={1} max={s.columns} onChange={(v) => upCell(cell.id, (cl) => void (cl.span = v))} />
            )}
            <ItemActions
              kind="חלק"
              name={`חלק ${cellIndex + 1}`}
              onDuplicate={
                s.cells.length < CUSTOM.cells
                  ? () => {
                      const copy = { ...structuredClone(cell), id: newId("cell"), blocks: cell.blocks.map((b) => ({ ...structuredClone(b), id: newId("b") })) };
                      up((x) => void x.cells.splice(cellIndex + 1, 0, copy));
                      setSel(copy.id);
                    }
                  : undefined
              }
              onDelete={() => {
                up((x) => void (x.cells = x.cells.filter((y) => y.id !== cell.id)));
                setSel(null);
              }}
            />
          </div>
        )}
      </Card>

      {cell ? (
        <Card title={`מה יש בחלק ${cellIndex + 1}`} hint={cell.blocks.length ? "גוררים כדי לשנות סדר. אפשר גם להעביר רכיב לחלק אחר." : "החלק ריק: באתר הוא נשאר כמרווח. אפשר להוסיף לו רכיבים."}>
          <div className="ad-cols">
            <Segmented
              label="סידור הרכיבים"
              value={cell.dir}
              onChange={(dir) => upCell(cell.id, (cl) => void (cl.dir = dir))}
              options={[
                { value: "stack", label: "אחד מתחת לשני" },
                { value: "row", label: "זה לצד זה" },
              ]}
            />
            <Segmented
              label="גובה בתוך השורה"
              value={cell.valign}
              onChange={(valign) => upCell(cell.id, (cl) => void (cl.valign = valign))}
              options={[
                { value: "start", label: "למעלה" },
                { value: "center", label: "באמצע" },
                { value: "end", label: "למטה" },
              ]}
            />
          </div>

          {cell.blocks.length > 0 && (
            <SortableList
              items={cell.blocks}
              getId={(b) => b.id}
              label={(b) => BLOCK_LABELS[b.kind]}
              onMove={(a, b) => upCell(cell.id, (cl) => void (cl.blocks = move(cl.blocks, a, b)))}
              render={(b) => (
                <div className="ad-expand">
                  <div className="ad-row">
                    <button type="button" className="ad-row-main" aria-expanded={open === b.id} onClick={() => setOpen(open === b.id ? null : b.id)}>
                      <span className={`ad-block-kind is-${b.kind}`}>{BLOCK_LABELS[b.kind]}</span>
                      <span>
                        <span className="ad-hint">{summary(b)}</span>
                      </span>
                      <span className="ad-row-edit">{open === b.id ? "סגירה ↑" : "עריכה ↓"}</span>
                    </button>
                    <ItemActions
                      kind="רכיב"
                      name={BLOCK_LABELS[b.kind]}
                      onDuplicate={cell.blocks.length < CUSTOM.blocks ? () => upCell(cell.id, (cl) => void cl.blocks.splice(cl.blocks.findIndex((y) => y.id === b.id) + 1, 0, { ...structuredClone(b), id: newId("b") })) : undefined}
                      onDelete={() => upCell(cell.id, (cl) => void (cl.blocks = cl.blocks.filter((y) => y.id !== b.id)))}
                    />
                  </div>
                  {open === b.id && (
                    <div className="ad-expand-body">
                      <BlockFields b={b} set={(fn, k) => upBlock(cell.id, b.id, fn, k)} />
                      {s.cells.length > 1 && (
                        <Select
                          label="העברה לחלק אחר"
                          value=""
                          onChange={(to) => {
                            if (!to) return;
                            up((x) => {
                              const from = x.cells.find((y) => y.id === cell.id)!;
                              const target = x.cells.find((y) => y.id === to)!;
                              const [moved] = from.blocks.splice(
                                from.blocks.findIndex((y) => y.id === b.id),
                                1,
                              );
                              target.blocks.push(moved);
                            });
                            setSel(to);
                          }}
                          options={[{ value: "", label: "בחירה…" }, ...s.cells.map((y, i) => ({ value: y.id, label: `חלק ${i + 1}` })).filter((o) => o.value !== cell.id)]}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            />
          )}

          {cell.blocks.length < CUSTOM.blocks && (
            <div className="ad-add-blocks" role="group" aria-label="הוספת רכיב">
              {(Object.keys(BLOCK_LABELS) as BlockKind[]).map((k) => (
                <Button key={k} onClick={() => addBlock(k)}>
                  + {BLOCK_LABELS[k]}
                </Button>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <Card>
          <Button variant="primary" onClick={addCell}>
            + הוספת חלק ראשון
          </Button>
        </Card>
      )}
    </>
  );
}

function BlockFields({ b, set }: { b: Block; set: (fn: (b: Block) => void, k?: string) => void }) {
  const alignField = <Segmented label="יישור" value={b.align} onChange={(align) => set((x) => void (x.align = align))} options={ALIGN} />;
  switch (b.kind) {
    case "heading":
      return (
        <>
          <TextInput label="כותרת" value={b.text} onChange={(v) => set((x) => void (x.text = v), "text")} />
          {alignField}
        </>
      );
    case "text":
      return (
        <>
          <TextArea label="טקסט" hint="כל שורה בפסקה נפרדת" rows={5} value={b.text} onChange={(v) => set((x) => void (x.text = v), "text")} />
          {alignField}
        </>
      );
    case "image":
      return (
        <>
          <MediaField label="תמונה או סרטון" allowEmbed ratio={b.ratio} value={b.media} onChange={(m) => set((x) => void (x.media = m))} />
          <Select label="יחס המסגרת" value={b.ratio} onChange={(ratio) => set((x) => void (x.ratio = ratio))} options={RATIOS} />
        </>
      );
    case "button":
      return (
        <>
          <TextInput label="טקסט הכפתור" value={b.text} onChange={(v) => set((x) => void (x.text = v), "text")} />
          <LinkInput label="לאן הוא מוביל" value={b.href} onChange={(v) => set((x) => void (x.href = v), "href")} />
          {alignField}
        </>
      );
  }
}
