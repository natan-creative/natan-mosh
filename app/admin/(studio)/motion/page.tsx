"use client";

import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Card, PageHeader, Segmented, Toggle } from "@/components/admin/ui";

export default function MotionEditor() {
  const { content: c, update } = useStudio();
  usePreviewPath("/");
  const m = c.motion;
  return (
    <>
      <PageHeader title="תנועה" intro="כמה האתר זז. מבקרים שביקשו פחות תנועה יקבלו אתר שקט בכל מקרה." />
      <Card>
        <Toggle label="אנימציות" hint="כיבוי עוצר את כל התנועה באתר" checked={m.enabled} onChange={(v) => update((d) => void (d.motion.enabled = v))} />
        <Segmented
          label="עוצמה"
          value={m.intensity}
          onChange={(v) => update((d) => void (d.motion.intensity = v))}
          options={[
            { value: "subtle", label: "עדין" },
            { value: "default", label: "רגיל" },
            { value: "expressive", label: "בולט" },
          ]}
        />
        <Toggle label="מעברים בין עמודים" hint="התמונה שנלחצה גדלה לראש עמוד העבודה" checked={m.pageTransitions} onChange={(v) => update((d) => void (d.motion.pageTransitions = v))} />
        <Toggle label="אפקטים במעבר עכבר" checked={m.hover} onChange={(v) => update((d) => void (d.motion.hover = v))} />
        <Toggle label="מסך פתיחה" hint="השם על רקע שחור לשנייה, בכניסה הראשונה" checked={m.loader} onChange={(v) => update((d) => void (d.motion.loader = v))} />
      </Card>
    </>
  );
}
