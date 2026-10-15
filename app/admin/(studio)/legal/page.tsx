"use client";

import Link from "next/link";
import { useState } from "react";
import { LEGAL_DRAFT_NOTE, PRIVACY_TEXT, TERMS_TEXT } from "@/lib/content/legal-text";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Button, Card, PageHeader, TextArea, TextInput, useConfirm } from "@/components/admin/ui";

type Id = "privacy" | "terms";
const META: Record<Id, { title: string; path: string; base: string }> = {
  privacy: { title: "מדיניות פרטיות", path: "/privacy", base: PRIVACY_TEXT },
  terms: { title: "תקנון ותנאי שימוש", path: "/terms", base: TERMS_TEXT },
};

export default function LegalPage() {
  const { content: c, update } = useStudio();
  const confirm = useConfirm();
  const [open, setOpen] = useState<Id>("privacy");
  usePreviewPath(META[open].path);

  const set = (id: Id, body: string) => update((d) => void ((d.legal[id].body = body), (d.legal[id].updatedAt = new Date().toISOString())), `legal.${id}`);

  const reset = async (id: Id) => {
    if (!(await confirm({ title: "לחזור לנוסח הבסיסי?", body: <p>השינויים שעשית במסמך יימחקו.</p>, confirm: "שחזור", danger: true }))) return;
    set(id, META[id].base);
  };

  return (
    <>
      <PageHeader title="מסמכים משפטיים" intro="מדיניות הפרטיות והתקנון. מופיעים בתחתית כל עמוד, ואפשר לערוך אותם כאן." />
      <p className="ad-notice">{LEGAL_DRAFT_NOTE}</p>
      <div className="ad-tabs" role="tablist">
        {(Object.keys(META) as Id[]).map((id) => (
          <button key={id} type="button" role="tab" aria-selected={open === id} className="ad-tab" onClick={() => setOpen(id)}>
            {META[id].title}
          </button>
        ))}
      </div>
      {(Object.keys(META) as Id[]).map((id) =>
        id !== open ? null : (
          <Card
            key={id}
            title={META[id].title}
            hint={`עודכן לאחרונה: ${new Date(c.legal[id].updatedAt).toLocaleDateString("he-IL")}`}
            actions={
              <div className="ad-row">
                <Link href={META[id].path} target="_blank" rel="noreferrer" className="ad-link">
                  לצפייה באתר ↗
                </Link>
                <Button variant="ghost" onClick={() => reset(id)}>
                  שחזור נוסח בסיסי
                </Button>
              </div>
            }
          >
            <TextArea label="הטקסט" hint='"## " בתחילת שורה = כותרת. "- " = פריט ברשימה. שורה ריקה = פסקה חדשה.' rows={28} value={c.legal[id].body} onChange={(v) => set(id, v)} />
          </Card>
        ),
      )}
    </>
  );
}
