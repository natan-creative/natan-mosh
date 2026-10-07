import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { BACKEND } from "@/lib/env";
import { normalizeContent } from "@/lib/content/normalize";
import type { MediaAsset, SiteContent } from "@/lib/content/types";
import builtin from "@/lib/content/builtin-media.json";
import type { StoreAdapter } from "./adapter";
import { localStore } from "./local";
import { supabaseStore } from "./supabase";

export const store: StoreAdapter = BACKEND === "supabase" ? supabaseStore : localStore;

export const CONTENT_TAG = "site-content";

/** התוכן המפורסם. מה שהאתר הציבורי מציג. נשמר ב-cache ומתרענן ב-Publish. */
export async function getPublishedContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("days");
  try {
    return normalizeContent(await store.readPublished());
  } catch (e) {
    console.error("[content] failed to read published content, using defaults", e);
    return normalizeContent(null);
  }
}

/** הטיוטה. רק אחרי בדיקת הרשאה (requireAdmin). אם אין טיוטה, מתחילים מהגרסה המפורסמת. */
export async function getDraftContent(): Promise<SiteContent> {
  return normalizeContent((await store.readDraft()) ?? (await store.readPublished()));
}

/** הקבצים שמגיעים עם האתר (public/work), מוצגים בספרייה לקריאה בלבד */
export const builtinMedia: MediaAsset[] = (builtin as { name: string; width: number; height: number; size: number }[]).map((f) => ({
  id: `static:/work/${f.name}`,
  kind: "image",
  src: `/work/${f.name}`,
  name: f.name,
  mime: "image/webp",
  size: f.size,
  width: f.width,
  height: f.height,
  alt: "",
  caption: "",
  createdAt: "2026-10-08T00:00:00.000Z",
  builtIn: true,
}));
