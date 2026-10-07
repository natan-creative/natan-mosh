import type { MediaAsset, Revision, SiteContent } from "@/lib/content/types";

/** כל מה שהאתר וה-Admin צריכים ממקור הנתונים. שני מימושים: supabase ו-local. */
export interface StoreAdapter {
  readPublished(): Promise<unknown | null>;
  readDraft(): Promise<unknown | null>;
  writeDraft(c: SiteContent): Promise<void>;
  writePublished(c: SiteContent): Promise<void>;
  addRevision(kind: Revision["kind"], label: string, c: SiteContent): Promise<void>;
  listRevisions(): Promise<Revision[]>;
  readRevision(id: string): Promise<unknown | null>;
  listMedia(): Promise<MediaAsset[]>;
  addMedia(m: Omit<MediaAsset, "id" | "createdAt">): Promise<MediaAsset>;
  updateMedia(id: string, patch: Partial<Pick<MediaAsset, "alt" | "caption" | "name" | "src" | "mime" | "size" | "width" | "height">>): Promise<void>;
  deleteMedia(id: string): Promise<void>;
}

export const REVISIONS_KEEP = 60;
