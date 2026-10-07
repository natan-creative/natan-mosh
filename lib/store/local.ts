import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { MediaAsset, Revision, SiteContent } from "@/lib/content/types";
import { REVISIONS_KEEP, type StoreAdapter } from "./adapter";

// מצב פיתוח: הכל בקבצי JSON בתיקיית .data, והעלאות ל-public/uploads.
const DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), ".data");
export const UPLOADS_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "public", "uploads");

async function read<T>(name: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(DIR, name), "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function write(name: string, data: unknown) {
  await fs.mkdir(DIR, { recursive: true });
  const file = path.join(DIR, name);
  await fs.writeFile(file + ".tmp", JSON.stringify(data));
  await fs.rename(file + ".tmp", file);
}

type StoredRevision = Revision & { data: SiteContent };

export const localStore: StoreAdapter = {
  readPublished: () => read("published.json", null),
  readDraft: () => read("draft.json", null),
  writeDraft: (c) => write("draft.json", c),
  writePublished: (c) => write("published.json", c),

  async addRevision(kind, label, data) {
    const list = await read<StoredRevision[]>("revisions.json", []);
    list.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), kind, label, data });
    await write("revisions.json", list.slice(0, REVISIONS_KEEP));
  },
  async listRevisions() {
    const list = await read<StoredRevision[]>("revisions.json", []);
    return list.map((r) => ({ id: r.id, createdAt: r.createdAt, kind: r.kind, label: r.label }));
  },
  async readRevision(id) {
    const list = await read<StoredRevision[]>("revisions.json", []);
    return list.find((r) => r.id === id)?.data ?? null;
  },

  listMedia: () => read<MediaAsset[]>("media.json", []),
  async addMedia(m) {
    const list = await read<MediaAsset[]>("media.json", []);
    const asset: MediaAsset = { ...m, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    list.unshift(asset);
    await write("media.json", list);
    return asset;
  },
  async updateMedia(id, patch) {
    const list = await read<MediaAsset[]>("media.json", []);
    await write("media.json", list.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  },
  async deleteMedia(id) {
    const list = await read<MediaAsset[]>("media.json", []);
    const asset = list.find((m) => m.id === id);
    if (asset?.src.startsWith("/uploads/")) {
      await fs.rm(path.join(UPLOADS_DIR, path.basename(asset.src)), { force: true });
    }
    await write("media.json", list.filter((m) => m.id !== id));
  },
};
