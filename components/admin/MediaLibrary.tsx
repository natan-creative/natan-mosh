"use client";

import { useMemo, useRef, useState } from "react";
import { deleteMedia, updateMedia } from "@/app/admin/actions";
import { ACCEPT_ATTR } from "@/lib/admin/media-rules";
import { replaceFile, uploadFile, UploadError } from "@/lib/admin/upload";
import { mediaUsage, removeMediaRefs, replaceMediaRefs, usageOf } from "@/lib/content/media-usage";
import type { MediaAsset, MediaKind } from "@/lib/content/types";
import { useStudio } from "./StudioContext";
import { Button, EmptyState, useConfirm } from "./ui";

type Filter = "all" | "image" | "video" | "used" | "unused";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "הכל" },
  { id: "image", label: "תמונות" },
  { id: "video", label: "סרטונים" },
  { id: "used", label: "בשימוש" },
  { id: "unused", label: "לא בשימוש" },
];

const size = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)}MB` : `${Math.round(n / 1024)}KB`);

export function Thumb({ asset, style }: { asset: Pick<MediaAsset, "kind" | "src" | "name">; style?: React.CSSProperties }) {
  return asset.kind === "video" ? (
    <video src={asset.src} muted playsInline preload="metadata" aria-hidden="true" style={style} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset.src} alt="" loading="lazy" style={style} />
  );
}

/** העלאה: drag & drop או בחירת קבצים. כמה קבצים בבת אחת. */
export function useUploader() {
  const { backend, setMedia, notify } = useStudio();
  const [busy, setBusy] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const upload = async (files: FileList | File[]): Promise<MediaAsset[]> => {
    const list = Array.from(files);
    if (!list.length) return [];
    setErrors([]);
    setBusy(list.length);
    const done: MediaAsset[] = [];
    await Promise.all(
      list.map(async (f) => {
        try {
          const a = await uploadFile(f, backend);
          done.push(a);
          setMedia((m) => [a, ...m]);
        } catch (e) {
          setErrors((x) => [...x, e instanceof UploadError ? e.message : `"${f.name}": ההעלאה נכשלה.`]);
        } finally {
          setBusy((b) => b - 1);
        }
      }),
    );
    if (done.length) notify(done.length === 1 ? "הקובץ הועלה ✓" : `${done.length} קבצים הועלו ✓`);
    return done;
  };
  return { upload, busy, errors };
}

export function Dropzone({ onFiles, busy, kind, compact }: { onFiles: (f: FileList) => void; busy: number; kind?: MediaKind; compact?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      className="ad-dropzone"
      data-over={over || undefined}
      data-compact={compact || undefined}
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
      }}
    >
      <p>{busy ? `מעלה ${busy} ${busy === 1 ? "קובץ" : "קבצים"}…` : "גרור לכאן תמונות או סרטונים"}</p>
      <Button variant="primary" onClick={() => input.current?.click()} disabled={busy > 0}>
        {kind === "video" ? "העלאת סרטון" : kind === "image" ? "העלאת תמונה" : "העלאת קבצים"}
      </Button>
      <p className="ad-hint">תמונות עד 15MB · סרטונים (MP4, WebM) עד 50MB</p>
      <input
        ref={input}
        type="file"
        hidden
        multiple
        accept={kind === "video" ? "video/mp4,video/webm" : kind === "image" ? ACCEPT_ATTR.split(",").filter((t) => t.startsWith("image/")).join(",") : ACCEPT_ATTR}
        onChange={(e) => {
          if (e.target.files?.length) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

type LibraryProps = {
  /** מצב בחירה: לחיצה על פריט בוחרת אותו */
  onSelect?: (a: MediaAsset) => void;
  kind?: MediaKind;
};

export function MediaLibrary({ onSelect, kind }: LibraryProps) {
  const { media, setMedia, content, update, backend, notify } = useStudio();
  const confirm = useConfirm();
  const { upload, busy, errors } = useUploader();
  const [filter, setFilter] = useState<Filter>(kind ?? "all");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const [replacing, setReplacing] = useState(false);

  const usage = useMemo(() => mediaUsage(content), [content]);
  const builtIn = media.filter((m) => m.builtIn);

  const list = media.filter((a) => {
    if (kind && a.kind !== kind) return false;
    if (filter === "image" || filter === "video") if (a.kind !== filter) return false;
    const used = usageOf(usage, a).length > 0;
    if (filter === "used" && !used) return false;
    if (filter === "unused" && used) return false;
    if (q && !`${a.name} ${a.alt} ${a.caption}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const current = media.find((m) => m.id === selected) ?? null;
  const currentUsage = current ? usageOf(usage, current) : [];

  const patchAsset = async (a: MediaAsset, patch: Partial<Pick<MediaAsset, "alt" | "caption" | "name">>) => {
    setMedia((m) => m.map((x) => (x.id === a.id ? { ...x, ...patch } : x)));
    if (a.builtIn) return;
    const res = await updateMedia(a.id, patch);
    if (!res.ok) notify(res.error);
  };

  const onDelete = async (a: MediaAsset) => {
    const used = usageOf(usage, a);
    const ok = await confirm({
      title: "מחיקת קובץ",
      body: used.length ? (
        <>
          <p>הקובץ בשימוש ב-{used.length} {used.length === 1 ? "מקום" : "מקומות"}. אחרי המחיקה המקומות האלה יישארו בלי תמונה:</p>
          <ul>
            {used.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>האם אתה בטוח שברצונך למחוק את &quot;{a.name}&quot;? אי אפשר לבטל את זה.</p>
      ),
      confirm: "מחיקה",
      danger: true,
    });
    if (!ok) return;
    const res = await deleteMedia(a.id);
    if (!res.ok) return notify(res.error);
    setMedia((m) => m.filter((x) => x.id !== a.id));
    if (used.length) update((d) => removeMediaRefs(d, a));
    setSelected(null);
    notify("הקובץ נמחק");
  };

  const onReplace = async (file: File) => {
    if (!current) return;
    setReplacing(true);
    try {
      const next = await replaceFile(current, file, backend);
      setMedia((m) => m.map((x) => (x.id === next.id ? next : x)));
      update((d) => replaceMediaRefs(d, next, current.src));
      notify("הקובץ הוחלף ✓");
    } catch (e) {
      notify(e instanceof UploadError ? e.message : "ההחלפה נכשלה.");
    } finally {
      setReplacing(false);
    }
  };

  return (
    <div className="ad-library" data-picking={onSelect ? "" : undefined}>
      <Dropzone onFiles={async (f) => {
        const done = await upload(f);
        if (onSelect && done.length === 1) onSelect(done[0]);
      }} busy={busy} kind={kind} compact={Boolean(onSelect)} />
      {errors.length > 0 && (
        <ul className="ad-errors" role="alert">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <div className="ad-library-bar">
        {!kind && (
          <div className="ad-chips" role="radiogroup" aria-label="סינון">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" role="radio" aria-checked={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        )}
        <input className="ad-input ad-search" type="search" placeholder="חיפוש לפי שם או תיאור" aria-label="חיפוש מדיה" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {media.length === builtIn.length && builtIn.length === 0 ? (
        <EmptyState text="ספריית המדיה ריקה." />
      ) : list.length === 0 ? (
        <EmptyState text="אין קבצים שמתאימים לסינון." />
      ) : (
        <ul className="ad-grid" aria-label="קבצי מדיה">
          {list.map((a) => {
            const used = usageOf(usage, a).length;
            return (
              <li key={a.id}>
                <button
                  type="button"
                  className="ad-tile"
                  aria-pressed={!onSelect ? selected === a.id : undefined}
                  onClick={() => (onSelect ? onSelect(a) : setSelected(a.id))}
                  aria-label={`${a.name}, ${a.kind === "video" ? "סרטון" : "תמונה"}${used ? `, בשימוש ב-${used}` : ", לא בשימוש"}${onSelect ? ". לחיצה לבחירה" : ""}`}
                >
                  <span className="ad-tile-img">
                    <Thumb asset={a} />
                    {a.kind === "video" && <span className="ad-badge">וידאו</span>}
                  </span>
                  <span className="ad-tile-name">{a.name}</span>
                  <span className="ad-tile-meta">{used ? `בשימוש · ${used}` : "לא בשימוש"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!onSelect && current && (
        <aside className="ad-details" aria-label={`פרטי הקובץ ${current.name}`}>
          <div className="ad-details-head">
            <h2>{current.name}</h2>
            <Button variant="ghost" onClick={() => setSelected(null)}>
              סגירה
            </Button>
          </div>
          <div className="ad-details-preview">
            {current.kind === "video" ? <video src={current.src} controls playsInline preload="metadata" /> : <Thumb asset={current} />}
          </div>
          <dl className="ad-meta">
            <div>
              <dt>סוג</dt>
              <dd>{current.kind === "video" ? "סרטון" : "תמונה"}</dd>
            </div>
            <div>
              <dt>גודל</dt>
              <dd dir="ltr">{size(current.size)}</dd>
            </div>
            {current.width && (
              <div>
                <dt>מידות</dt>
                <dd dir="ltr">
                  {current.width}×{current.height}
                </dd>
              </div>
            )}
          </dl>
          {current.builtIn ? (
            <p className="ad-hint">הקובץ מגיע עם האתר. אפשר להשתמש בו, אבל לא למחוק או להחליף.</p>
          ) : (
            <>
              <label className="ad-label" htmlFor="asset-name">
                שם
              </label>
              <input id="asset-name" className="ad-input" value={current.name} onChange={(e) => patchAsset(current, { name: e.target.value })} />
              <label className="ad-label" htmlFor="asset-alt">
                תיאור לנגישות (ברירת מחדל)
              </label>
              <input id="asset-alt" className="ad-input" value={current.alt} placeholder="מה רואים בתמונה?" onChange={(e) => patchAsset(current, { alt: e.target.value })} />
              <label className="ad-label" htmlFor="asset-caption">
                כיתוב (ברירת מחדל)
              </label>
              <input id="asset-caption" className="ad-input" value={current.caption} onChange={(e) => patchAsset(current, { caption: e.target.value })} />
            </>
          )}
          <h3 className="ad-label">איפה זה בשימוש</h3>
          {currentUsage.length ? (
            <ul className="ad-usage">
              {currentUsage.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          ) : (
            <p className="ad-hint">לא בשימוש באתר.</p>
          )}
          {!current.builtIn && (
            <div className="ad-details-actions">
              <Button onClick={() => replaceInput.current?.click()} disabled={replacing}>
                {replacing ? "מחליף…" : "החלפת קובץ"}
              </Button>
              <Button variant="danger" onClick={() => onDelete(current)}>
                מחיקה
              </Button>
              <input
                ref={replaceInput}
                type="file"
                hidden
                accept={current.kind === "video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp,image/avif,image/gif"}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onReplace(f);
                  e.target.value = "";
                }}
              />
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
