// מיקום והסתרה של אלמנטים. ההזזה עובדת בדסקטופ בלבד (ב-CSS), כי במובייל העימוד אחר לגמרי.
import type { CSSProperties } from "react";
import type { ElementId, SiteContent } from "@/lib/content/types";

export type Elements = SiteContent["elements"];

export const shown = (els: Elements, id: ElementId) => !els[id]?.hidden;

/** props לאלמנט שאפשר להזיז: data-el לזיהוי ב-Preview, ו-CSS variables להזזה */
export function el(els: Elements, id: ElementId, style?: CSSProperties) {
  const s = els[id];
  const vars: Record<string, string> = {};
  if (s?.x) vars["--ex"] = `${s.x}px`;
  if (s?.y) vars["--ey"] = `${s.y}px`;
  return { "data-el": id, style: { ...style, ...vars } as CSSProperties };
}
