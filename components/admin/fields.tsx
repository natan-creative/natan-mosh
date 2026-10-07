"use client";

import { useId } from "react";
import { TYPE_LIMITS } from "@/lib/content/limits";
import type { Sizes, TypeRole } from "@/lib/content/types";
import { useStudio } from "./StudioContext";
import { Button, NumberInput, TextInput, useConfirm } from "./ui";

/** גודל טקסט לכל מסך: Desktop / Tablet / Mobile */
export function SizeTriplet({ role, label }: { role: TypeRole; label?: string }) {
  const { content, update } = useStudio();
  const lim = TYPE_LIMITS[role].size;
  const size = content.theme.typography[role].size;
  const set = (k: keyof Sizes) => (v: number) =>
    update((d) => {
      d.theme.typography[role].size[k] = v;
      d.theme.preset = "custom";
    }, `type.${role}.size.${k}`);
  return (
    <fieldset className="ad-triplet">
      <legend className="ad-label">{label ?? TYPE_LIMITS[role].label}: גודל</legend>
      <NumberInput label="מחשב" value={size.desktop} onChange={set("desktop")} min={lim.min} max={lim.max} unit="px" />
      <NumberInput label="טאבלט" value={size.tablet} onChange={set("tablet")} min={lim.min} max={lim.max} unit="px" />
      <NumberInput label="טלפון" value={size.mobile} onChange={set("mobile")} min={lim.min} max={lim.max} unit="px" />
    </fieldset>
  );
}

/** קישור: אפשר להקליד כתובת, או לבחור עמוד/אזור באתר מהרשימה */
export function LinkInput({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  const { content } = useStudio();
  const id = useId();
  const options = [
    ["/", "דף הבית"],
    ["/#work", "עבודות נבחרות"],
    ["/#digital", "דיגיטל ורעיונות"],
    ["/#naming", "שמות"],
    ["/#about", "אודות"],
    ["/#contact", "יצירת קשר"],
    ["/work", "כל העבודות"],
    ["/accessibility", "הצהרת נגישות"],
    ...content.work.projects.map((p) => [`/work/${p.slug}`, `עבודה: ${p.title}`]),
  ];
  return (
    <>
      <TextInput label={label} hint={hint ?? "בחר מהרשימה או הדבק כתובת"} value={value} onChange={onChange} dir="ltr" list={id} />
      <datalist id={id}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </datalist>
    </>
  );
}

/** הסתר / שכפל / מחק לפריט ברשימה */
export function ItemActions({ name, hidden, onToggle, onDuplicate, onDelete, kind = "פריט" }: { name: string; hidden?: boolean; onToggle?: () => void; onDuplicate?: () => void; onDelete: () => void; kind?: string }) {
  const confirm = useConfirm();
  return (
    <div className="ad-item-actions">
      {onToggle && (
        <Button variant="ghost" onClick={onToggle} aria-pressed={!hidden} aria-label={`${hidden ? "הצגה" : "הסתרה"}: ${name}`}>
          {hidden ? "◌ מוסתר" : "● מוצג"}
        </Button>
      )}
      {onDuplicate && (
        <Button variant="ghost" onClick={onDuplicate} aria-label={`שכפול: ${name}`}>
          שכפול
        </Button>
      )}
      <Button
        variant="ghost"
        className="is-danger"
        aria-label={`מחיקה: ${name}`}
        onClick={async () => {
          if (await confirm({ title: `מחיקת ${kind}`, body: <p>האם אתה בטוח שברצונך למחוק את &quot;{name}&quot;?</p>, confirm: "מחיקה", danger: true })) onDelete();
        }}
      >
        מחיקה
      </Button>
    </div>
  );
}

export const newId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
