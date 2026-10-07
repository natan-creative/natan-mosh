"use client";

import { COLOR_LABELS, PRESETS } from "@/lib/content/limits";
import type { ColorTokens, PresetId } from "@/lib/content/types";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, ColorInput, PageHeader, Toggle, useConfirm } from "@/components/admin/ui";

const CONTRAST: Partial<Record<keyof ColorTokens, { against: keyof ColorTokens; min: number }>> = {
  text: { against: "background", min: 4.5 },
  muted: { against: "background", min: 4.5 },
  border: { against: "background", min: 1.3 },
  buttonText: { against: "button", min: 4.5 },
  button: { against: "background", min: 3 },
};

export default function StyleEditor() {
  const { content: c, update } = useStudio();
  const confirm = useConfirm();
  usePreviewPath("/");
  const colors = c.theme.colors;

  const applyPreset = async (id: PresetId) => {
    if (c.theme.preset === "custom" && !(await confirm({ title: `לעבור ל-${PRESETS[id].label}?`, body: <p>הצבעים והפונטים שבחרת יוחלפו. אפשר לחזור עם &quot;ביטול&quot;.</p>, confirm: "החלפה" }))) return;
    update((d) => void (d.theme = { preset: id, ...structuredClone(PRESETS[id].theme) }));
  };

  return (
    <>
      <PageHeader title="סגנון וצבעים" intro="Preset משנה את התחושה של כל האתר בלחיצה. אחר כך אפשר לכוונן." />
      <Card title="סגנון">
        <div className="ad-presets" role="radiogroup" aria-label="סגנון">
          {(Object.keys(PRESETS) as PresetId[]).map((id) => {
            const p = PRESETS[id];
            return (
              <button key={id} type="button" role="radio" aria-checked={c.theme.preset === id} className="ad-preset" onClick={() => applyPreset(id)}>
                <span className="ad-preset-swatch" style={{ background: p.theme.colors.background, color: p.theme.colors.text, borderColor: p.theme.colors.border }}>
                  <b style={{ fontFamily: `var(--font-${p.theme.typography.display.family === "bebas" ? "cond" : "body"})` }}>Aa</b>
                  <i style={{ background: p.theme.colors.accent }} />
                </span>
                <strong>{p.label}</strong>
                <span className="ad-hint">{p.hint}</span>
              </button>
            );
          })}
        </div>
        {c.theme.preset === "custom" && <p className="ad-hint">כרגע: סגנון מותאם אישית.</p>}
      </Card>
      <Card title="צבעים" hint="כל צבע משפיע על כל האתר.">
        {(Object.keys(COLOR_LABELS) as (keyof ColorTokens)[]).map((k) => {
          const rule = CONTRAST[k];
          return (
            <ColorInput
              key={k}
              label={COLOR_LABELS[k].label}
              hint={COLOR_LABELS[k].hint}
              value={colors[k]}
              against={rule ? colors[rule.against] : undefined}
              againstLabel={rule ? COLOR_LABELS[rule.against].label : undefined}
              min={rule?.min}
              onChange={(v) =>
                update((d) => {
                  d.theme.colors[k] = v;
                  d.theme.preset = "custom";
                }, `color.${k}`)
              }
            />
          );
        })}
        <Toggle label="מרקם נייר" hint="גרעיניות עדינה ברקע" checked={c.theme.grain} onChange={(v) => update((d) => void (d.theme.grain = v))} />
      </Card>
    </>
  );
}
