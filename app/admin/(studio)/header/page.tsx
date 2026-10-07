"use client";

import { NavEditor } from "@/components/admin/NavEditor";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, ColorInput, PageHeader, TextInput, Toggle } from "@/components/admin/ui";

export default function HeaderEditor() {
  const { content: c, update } = useStudio();
  usePreviewPath("/");
  const bg = c.header.background || c.theme.colors.background;
  return (
    <>
      <PageHeader title="Header" intro="השם והתפריט בראש כל עמוד." />
      <Card title="שם">
        <TextInput label="שם מלא" value={c.brand.name} onChange={(v) => update((d) => void (d.brand.name = v), "brand.name")} />
        <TextInput label="קיצור" hint="מופיע כשגוללים: NK / Natan Kosovsky" dir="ltr" value={c.brand.short} onChange={(v) => update((d) => void (d.brand.short = v), "brand.short")} />
      </Card>
      <Card title="תפריט" hint="גרור לשינוי סדר">
        <NavEditor items={c.header.nav} keyPrefix="nav" onChange={(items, key) => update((d) => void (d.header.nav = items), key)} />
      </Card>
      <Card title="עיצוב">
        <Toggle label="Header נשאר למעלה בגלילה" checked={c.header.sticky} onChange={(v) => update((d) => void (d.header.sticky = v))} />
        <ColorInput label="רקע" hint="ריק = כמו רקע האתר" allowEmpty value={c.header.background} onChange={(v) => update((d) => void (d.header.background = v), "header.bg")} />
        <ColorInput label="צבע טקסט" hint="ריק = כמו הטקסט באתר" allowEmpty value={c.header.text} against={bg} againstLabel="רקע ה-Header" onChange={(v) => update((d) => void (d.header.text = v), "header.text")} />
      </Card>
    </>
  );
}
