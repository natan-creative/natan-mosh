"use client";

import { useEffect, useRef } from "react";
import { ELEMENTS, OFFSET } from "@/lib/content/limits";
import type { ElementId } from "@/lib/content/types";
import { useStudio } from "@/components/admin/StudioContext";
import { Button, Card, NumberInput, PageHeader, Toggle } from "@/components/admin/ui";

export default function ElementsEditor() {
  const { content: c, update, selectedEl, setSelectedEl, setPreviewPath, setDevice, device } = useStudio();
  const rows = useRef<Record<string, HTMLDivElement | null>>({});

  // אלמנט שנבחר ב-Preview: גוללים אליו ברשימה
  useEffect(() => {
    if (selectedEl) rows.current[selectedEl]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedEl]);

  const patch = (id: ElementId, p: { hidden?: boolean; x?: number; y?: number }, key?: string) =>
    update((d) => void (d.elements[id] = { ...d.elements[id], ...p }), key);

  const groups = [...new Set(ELEMENTS.map((e) => e.group))];
  const changed = Object.keys(c.elements).length;

  return (
    <>
      <PageHeader
        title="מיקום והסתרה"
        intro="גוררים אלמנטים בתצוגה המקדימה כדי למקם אותם, או מכוונים כאן במספרים. אפשר גם להסתיר. שום תוכן לא נמחק."
        actions={changed > 0 && <Button onClick={() => update((d) => void (d.elements = {}))}>איפוס הכל</Button>}
      />
      <Card>
        <p className="ad-hint">
          <strong>איך מזיזים:</strong> לוחצים על אלמנט בתצוגה המקדימה וגוררים. המיקום חל על <strong>מחשב</strong> בלבד; בטאבלט ובטלפון האלמנטים נשארים במקום הטבעי שלהם, כדי שהעימוד לא יישבר.
        </p>
        {device !== "desktop" && (
          <Button variant="primary" onClick={() => setDevice("desktop")}>
            מעבר לתצוגת מחשב כדי לגרור
          </Button>
        )}
      </Card>

      {groups.map((g) => (
        <Card key={g} title={g}>
          {ELEMENTS.filter((e) => e.group === g).map((e) => {
            const st = c.elements[e.id] ?? {};
            const moved = Boolean(st.x || st.y);
            return (
              <div
                key={e.id}
                ref={(n) => void (rows.current[e.id] = n)}
                className="ad-el-row"
                data-selected={selectedEl === e.id || undefined}
                data-hidden={st.hidden || undefined}
              >
                <button
                  type="button"
                  className="ad-el-name"
                  onClick={() => {
                    setSelectedEl(e.id);
                    setPreviewPath(e.path);
                  }}
                >
                  <strong>{e.label}</strong>
                  <span className="ad-hint">{st.hidden ? "מוסתר" : moved ? `הוזז: ${st.x ?? 0}, ${st.y ?? 0}` : "במקום הטבעי"}</span>
                </button>
                <Toggle label="מוצג" hint={e.hideHint} checked={!st.hidden} onChange={(v) => patch(e.id, { hidden: !v })} />
                {selectedEl === e.id && !st.hidden && (
                  <div className="ad-el-pos">
                    <NumberInput label="ימינה / שמאלה" hint="שלילי = ימינה" value={st.x ?? 0} min={-OFFSET.x} max={OFFSET.x} step={4} unit="px" onChange={(v) => patch(e.id, { x: v }, `el.${e.id}.x`)} />
                    <NumberInput label="למעלה / למטה" hint="שלילי = למעלה" value={st.y ?? 0} min={-OFFSET.y} max={OFFSET.y} step={4} unit="px" onChange={(v) => patch(e.id, { y: v }, `el.${e.id}.y`)} />
                    {moved && <Button onClick={() => patch(e.id, { x: 0, y: 0 })}>החזרה למקום</Button>}
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      ))}
    </>
  );
}
