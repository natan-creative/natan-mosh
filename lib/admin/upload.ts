"use client";

import { registerMedia, updateMedia } from "@/app/admin/actions";
import { MEDIA_BUCKET } from "@/lib/env";
import type { MediaAsset } from "@/lib/content/types";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { ACCEPTED, MAX_BYTES } from "./media-rules";

export class UploadError extends Error {}

function mb(n: number) {
  return `${Math.round(n / 1024 / 1024)}MB`;
}

export function validate(file: File): "image" | "video" {
  if (!ACCEPTED[file.type]) throw new UploadError(`"${file.name}": סוג קובץ לא נתמך. אפשר JPG, PNG, WebP, AVIF, GIF, MP4 או WebM.`);
  const kind = file.type.startsWith("video/") ? "video" : "image";
  if (file.size > MAX_BYTES[kind]) throw new UploadError(`"${file.name}" גדול מדי (עד ${mb(MAX_BYTES[kind])}).`);
  return kind;
}

async function dimensions(file: File, kind: "image" | "video"): Promise<{ width?: number; height?: number }> {
  try {
    if (kind === "image") {
      const bmp = await createImageBitmap(file);
      const r = { width: bmp.width, height: bmp.height };
      bmp.close();
      return r;
    }
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.src = url;
    await new Promise((res, rej) => {
      v.onloadedmetadata = res;
      v.onerror = rej;
    });
    URL.revokeObjectURL(url);
    return { width: v.videoWidth, height: v.videoHeight };
  } catch {
    return {};
  }
}

async function putFile(file: File, backend: "supabase" | "local"): Promise<string> {
  if (backend === "local") {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new UploadError(json.error ?? "ההעלאה נכשלה.");
    return json.src;
  }
  const sb = supabaseBrowser();
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ACCEPTED[file.type]}`;
  const { error } = await sb.storage.from(MEDIA_BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) throw new UploadError("ההעלאה נכשלה. בדוק את החיבור ונסה שוב.");
  return sb.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

const baseName = (name: string) => name.replace(/\.[^.]+$/, "");

export async function uploadFile(file: File, backend: "supabase" | "local"): Promise<MediaAsset> {
  const kind = validate(file);
  const [src, dims] = await Promise.all([putFile(file, backend), dimensions(file, kind)]);
  const res = await registerMedia({ kind, src, name: baseName(file.name), mime: file.type, size: file.size, ...dims, alt: "", caption: "" });
  if (!res.ok) throw new UploadError(res.error);
  return res.data;
}

/** החלפת קובץ: אותו פריט בספרייה, קובץ חדש. ההפניות בתוכן מתעדכנות בצד הקורא. */
export async function replaceFile(asset: MediaAsset, file: File, backend: "supabase" | "local"): Promise<MediaAsset> {
  const kind = validate(file);
  if (kind !== asset.kind) throw new UploadError(asset.kind === "image" ? "צריך להחליף בתמונה." : "צריך להחליף בסרטון.");
  const [src, dims] = await Promise.all([putFile(file, backend), dimensions(file, kind)]);
  const patch = { src, mime: file.type, size: file.size, ...dims };
  const res = await updateMedia(asset.id, patch);
  if (!res.ok) throw new UploadError(res.error);
  return { ...asset, ...patch };
}
