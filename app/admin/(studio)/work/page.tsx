"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { emptyProject } from "@/lib/content/defaults";
import { Thumb } from "@/components/admin/MediaLibrary";
import { move, SortableList } from "@/components/admin/SortableList";
import { ItemActions, newId } from "@/components/admin/fields";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Button, Card, EmptyState, NumberInput, PageHeader, Select, TextInput } from "@/components/admin/ui";
import { RATIOS, WORK_COLUMNS } from "@/lib/content/limits";

export default function WorkList() {
  const { content: c, update } = useStudio();
  const router = useRouter();
  usePreviewPath("/#work");
  const projects = c.work.projects;

  const add = () => {
    const id = newId("p");
    update((d) => void d.work.projects.push(emptyProject(id, id)));
    router.push(`/admin/work/${id}`);
  };

  return (
    <>
      <PageHeader
        title="עבודות נבחרות"
        intro="העבודות המרכזיות. גרור כדי לשנות סדר."
        actions={
          <Button variant="primary" onClick={add}>
            + הוסף עבודה
          </Button>
        }
      />
      <Card title="כותרות האזור">
        <TextInput label="כותרת" dir="ltr" value={c.work.title} onChange={(v) => update((d) => void (d.work.title = v), "work.title")} />
        <TextInput label="טקסט הקישור" value={c.work.linkLabel} onChange={(v) => update((d) => void (d.work.linkLabel = v), "work.link")} />
      </Card>
      <Card title="הגריד">
        <div className="ad-cols">
          <NumberInput label="עבודות בשורה (במחשב)" value={c.work.columns} min={WORK_COLUMNS.min} max={WORK_COLUMNS.max} onChange={(v) => update((d) => void (d.work.columns = v))} />
          <Select label="צורת הכרטיס" value={c.work.cardRatio} onChange={(v) => update((d) => void (d.work.cardRatio = v))} options={RATIOS} />
        </div>
      </Card>

      {projects.length === 0 ? (
        <EmptyState
          text="עדיין אין עבודות כאן."
          action={
            <Button variant="primary" onClick={add}>
              + הוסף עבודה
            </Button>
          }
        />
      ) : (
        <SortableList
          items={projects}
          getId={(p) => p.id}
          label={(p) => p.title}
          onMove={(a, b) => update((d) => void (d.work.projects = move(d.work.projects, a, b)))}
          render={(p, i) => (
            <div className="ad-row" data-hidden={p.hidden || undefined}>
              <Link href={`/admin/work/${p.id}`} className="ad-row-main">
                <span className="ad-row-thumb">{p.cover ? <Thumb asset={{ kind: p.cover.kind, src: p.cover.src, name: "" }} /> : null}</span>
                <span>
                  <strong>{p.title || "ללא שם"}</strong>
                  <span className="ad-hint">
                    {p.type === "case" ? "עבודה מלאה" : "רעיון קצר"} · {p.kind}
                    {p.hidden ? " · מוסתר" : ""}
                  </span>
                </span>
                <span className="ad-row-edit">עריכה ←</span>
              </Link>
              <ItemActions
                kind="עבודה"
                name={p.title}
                hidden={p.hidden}
                onToggle={() => update((d) => void (d.work.projects[i].hidden = !p.hidden))}
                onDuplicate={() =>
                  update((d) => {
                    const id = newId("p");
                    d.work.projects.splice(i + 1, 0, { ...structuredClone(p), id, slug: `${p.slug}-copy`, title: `${p.title} (עותק)` });
                  })
                }
                onDelete={() => update((d) => void (d.work.projects = d.work.projects.filter((x) => x.id !== p.id)))}
              />
            </div>
          )}
        />
      )}
    </>
  );
}
