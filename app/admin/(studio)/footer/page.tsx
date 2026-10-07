"use client";

import { NavEditor } from "@/components/admin/NavEditor";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, TextInput } from "@/components/admin/ui";

export default function FooterEditor() {
  const { content: c, update } = useStudio();
  usePreviewPath("/#contact");
  return (
    <>
      <PageHeader title="Footer" intro="השורה האחרונה בכל עמוד." />
      <Card>
        <TextInput label="זכויות יוצרים" dir="ltr" value={c.footer.copyright} onChange={(v) => update((d) => void (d.footer.copyright = v), "footer.copy")} />
        <TextInput label="קריצה" hint="הטקסט הקטן באמצע. ריק = בלי קריצה." value={c.footer.wink.idle} onChange={(v) => update((d) => void (d.footer.wink.idle = v), "footer.wink.idle")} />
        <TextInput label="הקריצה במעבר עכבר" value={c.footer.wink.reveal} onChange={(v) => update((d) => void (d.footer.wink.reveal = v), "footer.wink.reveal")} />
        <TextInput label="עמוד 404" hint="מה כתוב כשעמוד לא נמצא" value={c.footer.notFound} onChange={(v) => update((d) => void (d.footer.notFound = v), "footer.404")} />
      </Card>
      <Card title="קישורים" hint="מומלץ להשאיר קישור להצהרת הנגישות (נדרש לפי התקן).">
        <NavEditor items={c.footer.nav} keyPrefix="fnav" onChange={(items, key) => update((d) => void (d.footer.nav = items), key)} />
      </Card>
    </>
  );
}
