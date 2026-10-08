// הופך את ה-Design Tokens (צבעים, טיפוגרפיה, תנועה) ל-CSS variables.
// כל ה-CSS של האתר קורא רק את המשתנים האלה, כך ששינוי אחד משפיע על כל האתר.
import { FONTS } from "@/lib/content/limits";
import { mix } from "@/lib/content/contrast";
import type { Motion, SiteContent, TypeRole, TypeStyle } from "@/lib/content/types";

const BP = { desktop: 1024, tablet: 600 };

function typeVars(role: TypeRole, t: TypeStyle) {
  const p = `--t-${role}`;
  const { desktop: d, tablet: tb, mobile: m } = t.size;
  return {
    root: [
      `${p}-family: var(${FONTS[t.family].cssVar}), system-ui, sans-serif`,
      `${p}-weight: ${t.weight}`,
      `${p}-lh: ${t.lineHeight}`,
      `${p}-ls: ${t.letterSpacing}em`,
      `${p}-transform: ${t.transform}`,
      `${p}-align: ${t.align}`,
      // דסקטופ: מתכווץ בעדינות עד גודל הטאבלט
      `${p}-size: clamp(${Math.min(tb, d)}px, ${((d / 1440) * 100).toFixed(2)}vw, ${d}px)`,
    ],
    tablet: `${p}-size: clamp(${Math.min(m, tb)}px, ${((tb / 900) * 100).toFixed(2)}vw, ${tb}px)`,
    mobile: `${p}-size: min(${m}px, ${((m / 390) * 100).toFixed(2)}vw)`,
  };
}

const MOTION_SCALE = { subtle: 0.55, default: 1, expressive: 1.5 } as const;

function motionCss(m: Motion): string {
  const s = MOTION_SCALE[m.intensity];
  let css = `:root{--m-dist:${s};--m-dur:${(0.8 + s * 0.2).toFixed(2)};--m-hover:${(1 + 0.035 * s).toFixed(3)}}`;
  if (!m.loader) css += `.loader{display:none!important}.intro{--d:.08s}`;
  if (!m.hover) {
    css += `.work-card:hover .work-media img,.d-tile:hover .d-face img,.name-cell:hover .name-mark{transform:none!important}`;
  }
  if (!m.pageTransitions || !m.enabled) {
    css += `::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}`;
  }
  if (!m.enabled) {
    css += `*,*::before,*::after{animation-duration:.001ms!important;animation-delay:0s!important;transition-duration:.001ms!important;transition-delay:0s!important}[data-reveal]{opacity:1!important;transform:none!important}.loader{display:none!important}.hero-arrow path{stroke-dashoffset:0}`;
  }
  return css;
}

const SHADOWS = { none: "none", soft: "0 2px 10px rgb(0 0 0 / 0.12)", strong: "0 10px 28px rgb(0 0 0 / 0.22)" } as const;

function buttonCss(b: SiteContent["theme"]["buttons"]): { vars: string[]; css: string } {
  const vars = [
    `--btn-radius: ${b.radius}px`,
    `--btn-px: ${b.paddingX}px`,
    `--btn-py: ${b.paddingY}px`,
    `--btn-fs: ${b.fontSize}px`,
    `--btn-weight: ${b.weight}`,
    `--btn-transform: ${b.uppercase ? "uppercase" : "none"}`,
    `--btn-ls: ${b.letterSpacing}em`,
    `--btn-bw: ${b.borderWidth}px`,
    `--btn-shadow: ${SHADOWS[b.shadow]}`,
  ];
  const hover = {
    darken: `.btn-primary:hover{background:var(--btn-hover)}.btn-secondary:hover{background:var(--btn);color:var(--btn-text)}`,
    invert: `.btn-primary:hover{background:transparent;color:var(--btn)}.btn-secondary:hover{background:var(--btn);color:var(--btn-text)}`,
    lift: `.btn:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgb(0 0 0 / 0.18)}.btn-primary:hover{background:var(--btn-hover)}`,
    underline: `.btn:hover{text-decoration:underline;text-underline-offset:4px}`,
  }[b.hover];
  return { vars, css: hover };
}

export function buildThemeCss(c: Pick<SiteContent, "theme" | "motion" | "header">): string {
  const { colors, typography, grain } = c.theme;
  const buttons = buttonCss(c.theme.buttons);
  const root = [
    `--paper: ${colors.background}`,
    `--paper-2: ${mix(colors.background, colors.text, 0.06)}`,
    `--ink: ${colors.text}`,
    `--ink-2: ${mix(colors.text, colors.background, 0.18)}`,
    `--muted: ${colors.muted}`,
    `--line: ${colors.border}`,
    `--signal: ${colors.accent}`,
    `--btn: ${colors.button}`,
    `--btn-text: ${colors.buttonText}`,
    `--btn-hover: ${colors.hover}`,
    `--header-bg: ${c.header.background || colors.background}`,
    `--header-text: ${c.header.text || colors.text}`,
  ];
  if (!grain) root.push("--grain: none");
  root.push(...buttons.vars);
  const tablet: string[] = [];
  const mobile: string[] = [];
  for (const role of Object.keys(typography) as TypeRole[]) {
    const v = typeVars(role, typography[role]);
    root.push(...v.root);
    tablet.push(v.tablet);
    mobile.push(v.mobile);
  }
  let css = `:root{${root.join(";")}}`;
  css += `@media (max-width:${BP.desktop - 1}px){:root{${tablet.join(";")}}}`;
  css += `@media (max-width:${BP.tablet - 1}px){:root{${mobile.join(";")}}}`;
  if (!c.header.sticky) css += `.site-header{position:relative}`;
  return css + buttons.css + motionCss(c.motion);
}
