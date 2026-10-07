"use client";

import { useEffect, useState } from "react";
import { getRevision, listRevisions } from "@/app/admin/actions";
import type { Revision } from "@/lib/content/types";
import { useStudio } from "@/components/admin/StudioContext";
import { Button, EmptyState, PageHeader, useConfirm } from "@/components/admin/ui";

const KIND: Record<Revision["kind"], string> = { publish: "פורסם", draft: "טיוטה נשמרה", restore: "שוחזר" };

function when(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const y = new Date(today);
  y.setDate(today.getDate() - 1);
  const time = d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === today.toDateString()) return `היום — ${time}`;
  if (d.toDateString() === y.toDateString()) return `אתמול — ${time}`;
  return `${d.toLocaleDateString("he-IL")} — ${time}`;
}

export default function HistoryPage() {
  const { replace, notify } = useStudio();
  const confirm = useConfirm();
  const [list, setList] = useState<Revision[] | null>(null);

  useEffect(() => {
    listRevisions().then((r) => setList(r.ok ? r.data : []));
  }, []);

  const restore = async (r: Revision) => {
    if (!(await confirm({ title: "לחזור לגרסה הזו?", body: <p>הטיוטה תוחלף בגרסה מ{when(r.createdAt)}. האתר החי לא ישתנה עד שתפרסם. אפשר לבטל עם &quot;ביטול&quot;.</p>, confirm: "שחזור" }))) return;
    const res = await getRevision(r.id);
    if (!res.ok) return notify(res.error);
    replace(res.data);
    notify("הגרסה שוחזרה לטיוטה ✓");
  };

  return (
    <>
      <PageHeader title="היסטוריית גרסאות" intro="כל פרסום ושמירת טיוטה יוצרים נקודה שאפשר לחזור אליה." />
      {list === null ? (
        <p className="ad-hint">טוען…</p>
      ) : list.length === 0 ? (
        <EmptyState text="עדיין אין גרסאות. הן נוצרות כשמפרסמים או לוחצים 'שמירת טיוטה'." />
      ) : (
        <ol className="ad-history">
          {list.map((r) => (
            <li key={r.id}>
              <div>
                <strong>{when(r.createdAt)}</strong>
                <span className="ad-tag" data-kind={r.kind}>
                  {KIND[r.kind]}
                </span>
                <p className="ad-hint">{r.label}</p>
              </div>
              <div className="ad-history-actions">
                <Button onClick={() => window.open(`/preview?rev=${r.id}`, "_blank", "noopener")}>תצוגה</Button>
                <Button onClick={() => restore(r)}>שחזור</Button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
