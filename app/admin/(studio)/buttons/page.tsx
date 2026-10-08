"use client";

import { BUTTON_LIMITS, defaultButtons } from "@/lib/content/limits";
import type { ButtonStyle } from "@/lib/content/types";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Button, Card, ColorInput, PageHeader, Segmented, Slider, Toggle } from "@/components/admin/ui";

const SHADOWS = { none: "none", soft: "0 2px 10px rgb(0 0 0 / 0.12)", strong: "0 10px 28px rgb(0 0 0 / 0.22)" };

export default function ButtonsEditor() {
  const { content: c, update } = useStudio();
  usePreviewPath("/#contact");
  const b = c.theme.buttons;
  const colors = c.theme.colors;
  const set = <K extends keyof ButtonStyle>(k: K, v: ButtonStyle[K]) =>
    update((d) => {
      d.theme.buttons[k] = v;
      d.theme.preset = "custom";
    }, `btn.${String(k)}`);

  const base: React.CSSProperties = {
    padding: `${b.paddingY}px ${b.paddingX}px`,
    borderRadius: b.radius,
    fontSize: b.fontSize,
    fontWeight: b.weight,
    textTransform: b.uppercase ? "uppercase" : "none",
    letterSpacing: `${b.letterSpacing}em`,
    border: `${b.borderWidth}px solid ${colors.button}`,
    boxShadow: SHADOWS[b.shadow],
    fontFamily: "var(--font-body)",
  };

  return (
    <>
      <PageHeader title="כפתורים" intro="כל הכפתורים באתר: שליחה בטופס, הכפתור בפתיחה, הקישורים בעמודי העבודות." />
      <Card title="כך הכפתורים נראים">
        <div className="ad-btn-preview" style={{ background: colors.background }}>
          <span style={{ ...base, background: colors.button, color: colors.buttonText }}>כפתור ראשי</span>
          <span style={{ ...base, background: "transparent", color: colors.text, borderColor: colors.text }}>כפתור משני</span>
        </div>
        <p className="ad-hint">ה-hover מוצג בתצוגה המקדימה הגדולה: מעבר עכבר על כפתור השליחה בטופס.</p>
      </Card>
      <Card title="גודל וצורה">
        <Slider label="פינות מעוגלות" min={BUTTON_LIMITS.radius.min} max={BUTTON_LIMITS.radius.max} step={1} value={b.radius} onChange={(v) => set("radius", v)} format={(v) => `${v}px`} />
        <div className="ad-cols">
          <Slider label="ריווח לצדדים" min={BUTTON_LIMITS.paddingX.min} max={BUTTON_LIMITS.paddingX.max} step={1} value={b.paddingX} onChange={(v) => set("paddingX", v)} format={(v) => `${v}px`} />
          <Slider label="ריווח למעלה ולמטה" min={BUTTON_LIMITS.paddingY.min} max={BUTTON_LIMITS.paddingY.max} step={1} value={b.paddingY} onChange={(v) => set("paddingY", v)} format={(v) => `${v}px`} />
        </div>
        <Slider label="עובי מסגרת" min={BUTTON_LIMITS.borderWidth.min} max={BUTTON_LIMITS.borderWidth.max} step={1} value={b.borderWidth} onChange={(v) => set("borderWidth", v)} format={(v) => `${v}px`} />
        <Segmented
          label="צל"
          value={b.shadow}
          onChange={(v) => set("shadow", v)}
          options={[
            { value: "none", label: "בלי" },
            { value: "soft", label: "עדין" },
            { value: "strong", label: "בולט" },
          ]}
        />
      </Card>
      <Card title="טקסט">
        <Slider label="גודל טקסט" min={BUTTON_LIMITS.fontSize.min} max={BUTTON_LIMITS.fontSize.max} step={1} value={b.fontSize} onChange={(v) => set("fontSize", v)} format={(v) => `${v}px`} />
        <Segmented label="משקל" value={b.weight} onChange={(v) => set("weight", v)} options={BUTTON_LIMITS.weights.map((w) => ({ value: w, label: String(w) }))} />
        <Slider label="מרווח בין אותיות" min={BUTTON_LIMITS.letterSpacing.min} max={BUTTON_LIMITS.letterSpacing.max} step={BUTTON_LIMITS.letterSpacing.step} value={b.letterSpacing} onChange={(v) => set("letterSpacing", v)} format={(v) => `${v.toFixed(3)}em`} />
        <Toggle label="אותיות גדולות (באנגלית)" checked={b.uppercase} onChange={(v) => set("uppercase", v)} />
      </Card>
      <Card title="מעבר עכבר (hover)">
        <Segmented
          label="מה קורה כשעוברים עם העכבר"
          value={b.hover}
          onChange={(v) => set("hover", v)}
          options={[
            { value: "darken", label: "משנה צבע" },
            { value: "invert", label: "מתהפך" },
            { value: "lift", label: "מתרומם" },
            { value: "underline", label: "קו תחתון" },
          ]}
        />
      </Card>
      <Card title="צבעים" hint="אותם צבעים כמו ב'סגנון וצבעים'.">
        <ColorInput label="רקע הכפתור" value={colors.button} against={colors.background} againstLabel="הרקע" min={3} onChange={(v) => update((d) => { d.theme.colors.button = v; d.theme.preset = "custom"; }, "color.button")} />
        <ColorInput label="טקסט בכפתור" value={colors.buttonText} against={colors.button} againstLabel="רקע הכפתור" onChange={(v) => update((d) => { d.theme.colors.buttonText = v; d.theme.preset = "custom"; }, "color.buttonText")} />
        <ColorInput label="רקע במעבר עכבר" value={colors.hover} onChange={(v) => update((d) => { d.theme.colors.hover = v; d.theme.preset = "custom"; }, "color.hover")} />
      </Card>
      <Button onClick={() => update((d) => void (d.theme.buttons = { ...defaultButtons }))}>חזרה לברירת המחדל</Button>
    </>
  );
}
