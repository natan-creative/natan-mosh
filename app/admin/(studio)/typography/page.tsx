"use client";

import { FONTS, LETTER_SPACING, LINE_HEIGHT, TYPE_LIMITS } from "@/lib/content/limits";
import type { TypeRole, TypeStyle } from "@/lib/content/types";
import { SizeTriplet } from "@/components/admin/fields";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, Segmented, Select, Slider } from "@/components/admin/ui";

const ROLES: TypeRole[] = ["display", "heading", "title", "body", "caption", "hand"];

function RoleCard({ role }: { role: TypeRole }) {
  const { content, update } = useStudio();
  const t = content.theme.typography[role];
  const lim = TYPE_LIMITS[role];
  const set = <K extends keyof TypeStyle>(k: K, v: TypeStyle[K]) =>
    update((d) => {
      const x = d.theme.typography[role];
      x[k] = v;
      if (k === "family" && !FONTS[v as TypeStyle["family"]].weights.includes(x.weight)) x.weight = FONTS[v as TypeStyle["family"]].weights[0];
      d.theme.preset = "custom";
    }, `type.${role}.${String(k)}`);

  return (
    <Card title={lim.label} hint={lim.hint}>
      <p className="ad-type-sample" style={{ fontFamily: `var(${FONTS[t.family].cssVar})`, fontWeight: t.weight, letterSpacing: `${t.letterSpacing}em`, lineHeight: t.lineHeight, textTransform: t.transform }} dir="auto">
        {role === "display" || role === "heading" ? "Good ideas" : "רעיון טוב מתחיל בשאלה"}
      </p>
      <Select label="פונט" value={t.family} onChange={(v) => set("family", v)} options={lim.fonts.map((f) => ({ value: f, label: FONTS[f].label }))} />
      {FONTS[t.family].weights.length > 1 && (
        <Segmented label="משקל" value={t.weight} onChange={(v) => set("weight", v)} options={FONTS[t.family].weights.map((w) => ({ value: w, label: String(w) }))} />
      )}
      <SizeTriplet role={role} label="גודל" />
      <div className="ad-cols">
        <Slider label="גובה שורה" min={LINE_HEIGHT.min} max={LINE_HEIGHT.max} step={LINE_HEIGHT.step} value={t.lineHeight} onChange={(v) => set("lineHeight", v)} />
        <Slider label="מרווח בין אותיות" min={LETTER_SPACING.min} max={LETTER_SPACING.max} step={LETTER_SPACING.step} value={t.letterSpacing} onChange={(v) => set("letterSpacing", v)} format={(v) => `${v.toFixed(3)}em`} />
      </div>
      {role !== "body" && role !== "caption" && role !== "hand" && (
        <Segmented label="אותיות" value={t.transform} onChange={(v) => set("transform", v)} options={[{ value: "none", label: "כמו שנכתב" }, { value: "uppercase", label: "UPPERCASE" }]} />
      )}
      {role === "display" && (
        <Segmented label="יישור" value={t.align} onChange={(v) => set("align", v)} options={[{ value: "start", label: "לצד" }, { value: "center", label: "למרכז" }, { value: "end", label: "לצד השני" }]} />
      )}
      {!FONTS[t.family].hebrew && <p className="ad-hint">שים לב: הפונט הזה לא כולל עברית. טקסט בעברית יוצג בפונט אחר.</p>}
    </Card>
  );
}

export default function TypographyEditor() {
  usePreviewPath("/");
  return (
    <>
      <PageHeader title="טיפוגרפיה" intro="כל סוג טקסט מוגדר פעם אחת ומשפיע על כל האתר. הגבולות שומרים שהעיצוב לא יישבר." />
      {ROLES.map((r) => (
        <RoleCard key={r} role={r} />
      ))}
    </>
  );
}
