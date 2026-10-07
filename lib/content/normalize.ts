// מקבל מסמך תוכן מכל מקור (DB, עורך, גרסה ישנה) ומחזיר מסמך תקין:
// משלים שדות חסרים מברירת המחדל, ומצמיד כל ערך ויזואלי לטווח המותר.
import { defaultContent, emptyDigital, emptyName, emptyProject } from "./defaults";
import { DIGITAL_COLUMNS, FONTS, LETTER_SPACING, LINE_HEIGHT, TYPE_LIMITS, ZOOM } from "./limits";
import { HEX } from "./contrast";
import type { MediaRef, SectionId, SiteContent, TypeRole, TypeStyle } from "./types";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

/** מיזוג עמוק: ערכים מ-src גוברים, מבנה וטיפוסים מ-base. מערכים נלקחים כמו שהם. */
function merge<T>(base: T, src: unknown): T {
  if (src === undefined) return base;
  if (Array.isArray(base)) return (Array.isArray(src) ? src : base) as T;
  if (isObj(base)) {
    if (!isObj(src)) return base;
    const out: Obj = { ...base };
    for (const k of Object.keys(src)) out[k] = k in base ? merge((base as Obj)[k], src[k]) : src[k];
    return out as T;
  }
  if (base === null) return src as T;
  return (typeof src === typeof base ? src : base) as T;
}

const clamp = (n: unknown, min: number, max: number, fallback: number) => {
  const v = typeof n === "number" && Number.isFinite(n) ? n : fallback;
  return Math.min(max, Math.max(min, v));
};

const color = (v: string, fallback: string) => (HEX.test(v) ? v.toLowerCase() : fallback);

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

function media(m: MediaRef | null | undefined): MediaRef | null {
  if (!m || !isObj(m) || typeof m.src !== "string" || !m.src) return null;
  return {
    ...m,
    alt: typeof m.alt === "string" ? m.alt : "",
    zoom: clamp(m.zoom, ZOOM.min, ZOOM.max, 1),
    focal: m.focal ? { x: clamp(m.focal.x, 0, 100, 50), y: clamp(m.focal.y, 0, 100, 50) } : undefined,
  };
}

function typeStyle(role: TypeRole, t: TypeStyle, base: TypeStyle): TypeStyle {
  const lim = TYPE_LIMITS[role];
  const family = lim.fonts.includes(t.family) ? t.family : base.family;
  const weights = FONTS[family].weights;
  const weight = weights.includes(t.weight) ? t.weight : weights.reduce((a, w) => (Math.abs(w - t.weight) < Math.abs(a - t.weight) ? w : a));
  const s = (v: number, f: number) => Math.round(clamp(v, lim.size.min, lim.size.max, f));
  return {
    family,
    weight,
    size: { desktop: s(t.size.desktop, base.size.desktop), tablet: s(t.size.tablet, base.size.tablet), mobile: s(t.size.mobile, base.size.mobile) },
    lineHeight: clamp(t.lineHeight, LINE_HEIGHT.min, LINE_HEIGHT.max, base.lineHeight),
    letterSpacing: clamp(t.letterSpacing, LETTER_SPACING.min, LETTER_SPACING.max, base.letterSpacing),
    transform: t.transform === "uppercase" ? "uppercase" : "none",
    align: ["start", "center", "end"].includes(t.align) ? t.align : "start",
  };
}

const SECTION_IDS: SectionId[] = ["work", "digital", "naming", "about", "contact"];

export function normalizeContent(raw: unknown): SiteContent {
  const c = merge(structuredClone(defaultContent), raw);
  const d = defaultContent;

  // סקשנים: כל אחד פעם אחת, אף אחד לא חסר
  const seen = new Set<SectionId>();
  c.sections = c.sections.filter((s) => SECTION_IDS.includes(s.id) && !seen.has(s.id) && seen.add(s.id));
  for (const id of SECTION_IDS) if (!seen.has(id)) c.sections.push({ id, visible: true });

  // עבודות: מבנה מלא, slug ייחודי
  const slugs = new Set<string>();
  c.work.projects = c.work.projects.map((p, i) => {
    const full = merge(emptyProject(p.id, p.slug), p);
    let slug = slugify(full.slug) || `work-${i + 1}`;
    while (slugs.has(slug)) slug = `${slug}-2`;
    slugs.add(slug);
    return {
      ...full,
      slug,
      cover: media(full.cover),
      gallery: full.gallery.map((g) => ({ ...g, media: media(g.media)! })).filter((g) => g.media),
      stats: full.stats.filter((s) => typeof s === "string"),
      design: { ...full.design, accent: color(full.design.accent, "#111110") },
    };
  });

  c.digital.items = c.digital.items.map((x) => ({ ...merge(emptyDigital(x.id), x), media: media(x.media) }));
  c.naming.items = c.naming.items.map((x) => ({ ...merge(emptyName(x.id), x), image: media(x.image) }));

  c.digital.columns = {
    desktop: Math.round(clamp(c.digital.columns.desktop, DIGITAL_COLUMNS.desktop.min, DIGITAL_COLUMNS.desktop.max, 5)),
    tablet: Math.round(clamp(c.digital.columns.tablet, DIGITAL_COLUMNS.tablet.min, DIGITAL_COLUMNS.tablet.max, 3)),
    mobile: Math.round(clamp(c.digital.columns.mobile, DIGITAL_COLUMNS.mobile.min, DIGITAL_COLUMNS.mobile.max, 2)),
  };
  c.digital.homeLimit = Math.round(clamp(c.digital.homeLimit, 1, 60, 10));
  c.naming.visibleCount = Math.round(clamp(c.naming.visibleCount, 1, 24, 4));

  for (const k of Object.keys(d.theme.colors) as (keyof typeof d.theme.colors)[]) {
    c.theme.colors[k] = color(c.theme.colors[k], d.theme.colors[k]);
  }
  c.header.background = HEX.test(c.header.background) ? c.header.background : "";
  c.header.text = HEX.test(c.header.text) ? c.header.text : "";
  for (const role of Object.keys(d.theme.typography) as TypeRole[]) {
    c.theme.typography[role] = typeStyle(role, c.theme.typography[role], d.theme.typography[role]);
  }

  c.hero.image = media(c.hero.image);
  c.hero.video = media(c.hero.video);
  c.about.image = media(c.about.image);
  c.settings.ogImage = media(c.settings.ogImage);
  c.settings.favicon = media(c.settings.favicon);
  return c;
}
