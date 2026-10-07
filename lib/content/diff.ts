import type { SiteContent } from "./types";

export const AREA_LABELS: Record<keyof SiteContent, string> = {
  version: "גרסה",
  settings: "הגדרות",
  brand: "שם ותפקיד",
  header: "Header",
  hero: "Hero",
  sections: "סדר האזורים",
  work: "Selected Work",
  digital: "Digital / Ideas",
  naming: "Naming",
  about: "About",
  contact: "Contact",
  footer: "Footer",
  theme: "עיצוב",
  motion: "תנועה",
};

/** אילו אזורים שונים בין שתי גרסאות */
export function changedAreas(a: SiteContent, b: SiteContent): (keyof SiteContent)[] {
  return (Object.keys(AREA_LABELS) as (keyof SiteContent)[]).filter(
    (k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]),
  );
}

export function describeChanges(a: SiteContent, b: SiteContent): string {
  const areas = changedAreas(a, b);
  if (!areas.length) return "ללא שינויים";
  return "עודכן: " + areas.map((k) => AREA_LABELS[k]).join(", ");
}
