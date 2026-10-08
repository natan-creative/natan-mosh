// איפה כל קובץ מדיה בשימוש בתוך התוכן, והחלפה/הסרה של כל ההפניות אליו.
import type { MediaAsset, MediaRef, SiteContent } from "./types";

type Visit = (ref: MediaRef, where: string, set: (r: MediaRef | null) => void) => void;

/** עובר על כל ההפניות למדיה בתוכן, עם תיאור מקום קריא */
export function walkMedia(c: SiteContent, visit: Visit) {
  const slot = <K extends string>(obj: Record<K, MediaRef | null>, key: K, where: string) => {
    const r = obj[key];
    if (r) visit(r, where, (v) => (obj[key] = v as never));
    if (r?.poster) {
      // poster של וידאו: מוצג כהפניה נפרדת לתמונה
      visit({ ...r, id: `poster:${r.poster}`, kind: "image", src: r.poster }, `${where} (תמונת פתיחה לווידאו)`, () => {});
    }
  };
  slot(c.hero, "image", "פתיחה");
  slot(c.hero, "video", "פתיחה (וידאו)");
  slot(c.about, "image", "אודות");
  slot(c.settings, "ogImage", "גוגל ושיתוף (תמונת שיתוף)");
  slot(c.settings, "favicon", "הגדרות (Favicon)");
  for (const p of c.work.projects) {
    slot(p, "cover", `עבודות נבחרות › ${p.title}`);
    p.gallery = p.gallery.filter((g) => {
      let keep = true;
      visit(g.media, `עבודות נבחרות › ${p.title} › גלריה`, (v) => (v ? (g.media = v) : (keep = false)));
      return keep;
    });
  }
  for (const d of c.digital.items) slot(d, "media", `דיגיטל › ${d.title}`);
  for (const n of c.naming.items) slot(n, "image", `שמות › ${n.name}`);
  for (const s of c.custom) for (const cell of s.cells) for (const b of cell.blocks) if (b.kind === "image") slot(b, "media", `סקשנים › ${s.name}`);
}

export function mediaUsage(c: SiteContent): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const add = (key: string, where: string) => map.set(key, [...(map.get(key) ?? []), where]);
  walkMedia(structuredClone(c), (ref, where) => {
    add(ref.id, where);
    if (ref.id !== ref.src) add(ref.src, where);
  });
  return map;
}

export const usageOf = (usage: Map<string, string[]>, a: MediaAsset) => [...new Set([...(usage.get(a.id) ?? []), ...(usage.get(a.src) ?? [])])];

/** אחרי החלפת קובץ: כל ההפניות (וגם תמונות פתיחה של וידאו) מקבלות את הכתובת והמידות החדשות */
export function replaceMediaRefs(c: SiteContent, a: MediaAsset, oldSrc: string) {
  walkMedia(c, (ref, _w, set) => {
    if (ref.id.startsWith("poster:")) return;
    if (ref.id === a.id) set({ ...ref, src: a.src, kind: a.kind, width: a.width, height: a.height });
    else if (ref.poster === oldSrc) set({ ...ref, poster: a.src });
  });
}

/** אחרי מחיקה: ההפניות נעלמות (במקומן משבצת ריקה) */
export function removeMediaRefs(c: SiteContent, a: MediaAsset) {
  walkMedia(c, (ref, _w, set) => {
    if (ref.id === a.id || ref.src === a.src) set(null);
    else if (ref.poster === a.src) set({ ...ref, poster: undefined });
  });
}

/** הפניה חדשה מתוך פריט בספרייה */
export function refFromAsset(a: MediaAsset, keep?: MediaRef | null): MediaRef {
  return {
    ...(keep ?? {}),
    id: a.id,
    kind: a.kind,
    src: a.src,
    alt: keep?.alt || a.alt,
    caption: keep?.caption || a.caption || undefined,
    width: a.width,
    height: a.height,
    ...(a.kind === "video" ? { autoplay: keep?.autoplay ?? true, loop: keep?.loop ?? true, muted: keep?.muted ?? true, controls: keep?.controls ?? false } : {}),
  };
}
