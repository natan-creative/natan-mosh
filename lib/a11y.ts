// הגדרות הנגישות נשמרות בדפדפן ומוחלות כ-class על <html> (גם לפני הציור הראשון, ב-boot script).

export const A11Y_KEY = "nk-a11y";

export type A11yState = {
  zoom: 0 | 1 | 2 | 3;
  contrast: boolean;
  mono: boolean;
  links: boolean;
  font: boolean;
  still: boolean;
  cursor: boolean;
};

export const a11yDefaults: A11yState = {
  zoom: 0,
  contrast: false,
  mono: false,
  links: false,
  font: false,
  still: false,
  cursor: false,
};

export function a11yClasses(s: A11yState): string[] {
  const c: string[] = [];
  if (s.zoom) c.push(`a11y-zoom-${s.zoom}`);
  if (s.contrast) c.push("a11y-contrast");
  if (s.mono) c.push("a11y-mono");
  if (s.links) c.push("a11y-links");
  if (s.font) c.push("a11y-font");
  if (s.still) c.push("a11y-still");
  if (s.cursor) c.push("a11y-cursor");
  return c;
}

/** תנועה מופחתת: מהגדרות המערכת או מתפריט הנגישות */
export function reducedMotion(): boolean {
  return (
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.classList.contains("a11y-still")
  );
}
