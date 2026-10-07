import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { BACKEND } from "@/lib/env";
import { UPLOADS_DIR } from "@/lib/store/local";
import { ACCEPTED, MAX_BYTES } from "@/lib/admin/media-rules";

// העלאת קבצים במצב local (פיתוח). ב-Supabase הדפדפן מעלה ישירות ל-Storage.
export async function POST(request: Request) {
  if (BACKEND !== "local") return NextResponse.json({ error: "Not available" }, { status: 404 });
  if (!(await getAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  const ext = ACCEPTED[file.type];
  if (!ext) return NextResponse.json({ error: "סוג קובץ לא נתמך" }, { status: 415 });
  const kind = file.type.startsWith("video/") ? "video" : "image";
  if (file.size > MAX_BYTES[kind]) return NextResponse.json({ error: "הקובץ גדול מדי" }, { status: 413 });

  const name = `${crypto.randomUUID()}.${ext}`;
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOADS_DIR, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ src: `/uploads/${name}` });
}
