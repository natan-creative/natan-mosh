import "server-only";
import { MEDIA_BUCKET, SUPABASE_URL } from "@/lib/env";
import type { MediaAsset } from "@/lib/content/types";
import { supabasePublic, supabaseServer } from "@/lib/supabase/server";
import { REVISIONS_KEEP, type StoreAdapter } from "./adapter";

// כל פעולות הכתיבה רצות עם ה-session של המשתמש: RLS מאשר רק admins.

type MediaRow = {
  id: string;
  path: string;
  url: string;
  kind: MediaAsset["kind"];
  name: string;
  mime: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string;
  caption: string;
  created_at: string;
};

const toAsset = (r: MediaRow): MediaAsset => ({
  id: r.id,
  kind: r.kind,
  src: r.url,
  name: r.name,
  mime: r.mime,
  size: r.size,
  width: r.width ?? undefined,
  height: r.height ?? undefined,
  alt: r.alt,
  caption: r.caption,
  createdAt: r.created_at,
});

/** מהכתובת הציבורית של הקובץ לנתיב שלו בתוך ה-bucket */
export const storagePath = (url: string) => url.split(`/storage/v1/object/public/${MEDIA_BUCKET}/`)[1] ?? "";

function fail(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export const supabaseStore: StoreAdapter = {
  async readPublished() {
    const { data, error } = await supabasePublic().from("site_content").select("data").eq("id", "published").maybeSingle();
    fail(error);
    return data?.data ?? null;
  },
  async readDraft() {
    const sb = await supabaseServer();
    const { data, error } = await sb.from("site_content").select("data").eq("id", "draft").maybeSingle();
    fail(error);
    return data?.data ?? null;
  },
  async writeDraft(c) {
    const sb = await supabaseServer();
    fail((await sb.from("site_content").upsert({ id: "draft", data: c, updated_at: new Date().toISOString() })).error);
  },
  async writePublished(c) {
    const sb = await supabaseServer();
    fail((await sb.from("site_content").upsert({ id: "published", data: c, updated_at: new Date().toISOString() })).error);
  },

  async addRevision(kind, label, data) {
    const sb = await supabaseServer();
    fail((await sb.from("revisions").insert({ kind, label, data })).error);
    // שומרים רק את האחרונות
    const { data: old } = await sb.from("revisions").select("id").order("created_at", { ascending: false }).range(REVISIONS_KEEP, REVISIONS_KEEP + 200);
    if (old?.length) await sb.from("revisions").delete().in("id", old.map((r) => r.id));
  },
  async listRevisions() {
    const sb = await supabaseServer();
    const { data, error } = await sb.from("revisions").select("id, created_at, kind, label").order("created_at", { ascending: false }).limit(REVISIONS_KEEP);
    fail(error);
    return (data ?? []).map((r) => ({ id: String(r.id), createdAt: r.created_at, kind: r.kind, label: r.label }));
  },
  async readRevision(id) {
    const sb = await supabaseServer();
    const { data, error } = await sb.from("revisions").select("data").eq("id", id).maybeSingle();
    fail(error);
    return data?.data ?? null;
  },

  async listMedia() {
    const sb = await supabaseServer();
    const { data, error } = await sb.from("media").select("*").order("created_at", { ascending: false });
    fail(error);
    return (data as MediaRow[]).map(toAsset);
  },
  async addMedia(m) {
    if (!m.src.startsWith(SUPABASE_URL)) throw new Error("Invalid media URL");
    const sb = await supabaseServer();
    const { data, error } = await sb
      .from("media")
      .insert({ path: storagePath(m.src), url: m.src, kind: m.kind, name: m.name, mime: m.mime, size: m.size, width: m.width ?? null, height: m.height ?? null, alt: m.alt, caption: m.caption })
      .select("*")
      .single();
    fail(error);
    return toAsset(data as MediaRow);
  },
  async updateMedia(id, patch) {
    if (patch.src && !patch.src.startsWith(SUPABASE_URL)) throw new Error("Invalid media URL");
    const sb = await supabaseServer();
    const row: Record<string, unknown> = { ...patch };
    if (patch.src) {
      row.url = patch.src;
      row.path = storagePath(patch.src);
      delete row.src;
    }
    fail((await sb.from("media").update(row).eq("id", id)).error);
  },
  async deleteMedia(id) {
    const sb = await supabaseServer();
    const { data } = await sb.from("media").select("path").eq("id", id).maybeSingle();
    if (data?.path) await sb.storage.from(MEDIA_BUCKET).remove([data.path]);
    fail((await sb.from("media").delete().eq("id", id)).error);
  },
};
