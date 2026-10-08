"use client";

import { useId, useRef, useState } from "react";
import { SCALE, ZOOM } from "@/lib/content/limits";
import { refFromAsset } from "@/lib/content/media-usage";
import { toEmbed } from "@/lib/content/embed";
import type { MediaKind, MediaRef } from "@/lib/content/types";
import { MediaLibrary, Thumb, useUploader } from "./MediaLibrary";
import { Button, Modal, Segmented, Slider, TextInput, Toggle } from "./ui";

/** נקודת פוקוס: גוררים את הנקודה (או חיצים במקלדת) */
export function FocalPicker({ media, value, onChange, ratio }: { media: MediaRef; value: { x: number; y: number }; onChange: (v: { x: number; y: number }) => void; ratio?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);
  const set = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    onChange({
      x: Math.round(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100))),
      y: Math.round(Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100))),
    });
  };
  return (
    <div className="ad-focal-wrap">
      <div
        ref={box}
        className="ad-focal"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          setDrag(true);
          set(e);
        }}
        onPointerMove={(e) => drag && set(e)}
        onPointerUp={() => setDrag(false)}
      >
        <Thumb asset={{ kind: media.kind, src: media.poster && media.kind === "video" ? media.poster : media.src, name: "" }} />
        <button
          type="button"
          className="ad-focal-dot"
          style={{ left: `${value.x}%`, top: `${value.y}%` }}
          aria-label={`נקודת פוקוס: ${value.x}% מהשמאל, ${value.y}% מלמעלה. חיצים להזזה`}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 10 : 2;
            const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
            const d = map[e.key];
            if (!d) return;
            e.preventDefault();
            onChange({ x: Math.min(100, Math.max(0, value.x + d[0])), y: Math.min(100, Math.max(0, value.y + d[1])) });
          }}
        />
      </div>
      {ratio && (
        <div className="ad-focal-result">
          <span className="ad-hint">כך זה ייחתך:</span>
          <div className="ad-crop-preview" style={{ aspectRatio: ratio.replace("/", " / ") }}>
            <Thumb
              asset={{ kind: media.kind, src: media.poster && media.kind === "video" ? media.poster : media.src, name: "" }}
              style={{
                objectFit: media.fit === "contain" || media.fit === "original" ? "contain" : "cover",
                objectPosition: `${value.x}% ${value.y}%`,
                transform: `scale(${media.zoom ?? 1})`,
                transformOrigin: `${value.x}% ${value.y}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PosterPicker({ value, onChange }: { value?: string; onChange: (src?: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ad-field">
      <span className="ad-label">תמונת פתיחה לווידאו</span>
      <p className="ad-hint">מוצגת עד שהסרטון נטען, ובמקום הסרטון כשמבקשים פחות תנועה.</p>
      <div className="ad-media-row">
        {value && (
          <span className="ad-media-thumb">
            <Thumb asset={{ kind: "image", src: value, name: "" }} />
          </span>
        )}
        <Button onClick={() => setOpen(true)}>{value ? "החלפה" : "בחירת תמונה"}</Button>
        {value && (
          <Button variant="ghost" onClick={() => onChange(undefined)}>
            הסרה
          </Button>
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="בחירת תמונת פתיחה" wide>
        <MediaLibrary
          kind="image"
          onSelect={(a) => {
            onChange(a.src);
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

/** עריכת אופן ההצגה של מדיה במקום מסוים */
export function MediaRefEditor({ value, onChange, ratio }: { value: MediaRef; onChange: (m: MediaRef) => void; ratio?: string }) {
  const set = (patch: Partial<MediaRef>) => onChange({ ...value, ...patch });
  if (value.kind === "embed") {
    return (
      <div className="ad-ref-fields">
        <p className="ad-hint" dir="ltr">
          {value.src}
        </p>
        <TextInput label="תיאור לנגישות" hint="על מה הסרטון? קורא מסך יקריא את זה." value={value.alt} onChange={(alt) => set({ alt })} />
        <TextInput label="כיתוב" hint="לא חובה" value={value.caption ?? ""} onChange={(caption) => set({ caption })} />
      </div>
    );
  }
  return (
    <div className="ad-ref-editor">
      <FocalPicker media={value} value={value.focal ?? { x: 50, y: 50 }} onChange={(focal) => set({ focal })} ratio={ratio} />
      <div className="ad-ref-fields">
        <Slider label="זום (חיתוך)" hint="מגדיל את התמונה סביב נקודת הפוקוס" min={ZOOM.min} max={ZOOM.max} step={ZOOM.step} value={value.zoom ?? 1} onChange={(zoom) => set({ zoom })} format={(v) => `${Math.round(v * 100)}%`} />
        <Segmented
          label="התאמה למסגרת"
          value={value.fit ?? "cover"}
          onChange={(fit) => set({ fit })}
          options={[
            { value: "cover", label: "ממלא (חותך)" },
            { value: "contain", label: "נכנס כולו" },
            { value: "original", label: "מקורי" },
          ]}
        />
        <TextInput label="תיאור לנגישות" hint="מה רואים? קורא מסך יקריא את זה. חובה לפי התקן." value={value.alt} onChange={(alt) => set({ alt })} />
        <TextInput label="כיתוב" hint="מופיע מתחת לתמונה בגלריה (לא חובה)" value={value.caption ?? ""} onChange={(caption) => set({ caption })} />
        {value.kind === "video" && (
          <>
            <Toggle label="הפעל אוטומטית" hint="מתנגן בלי קול כשהוא מגיע למסך" checked={value.autoplay ?? true} onChange={(autoplay) => set({ autoplay, muted: autoplay ? true : value.muted })} />
            <Toggle label="בלופ" checked={value.loop ?? true} onChange={(loop) => set({ loop })} />
            <Toggle label="מושתק" checked={value.muted ?? true} onChange={(muted) => set({ muted })} />
            <Toggle label="כפתורי נגן" checked={value.controls ?? false} onChange={(controls) => set({ controls })} />
            <PosterPicker value={value.poster} onChange={(poster) => set({ poster })} />
          </>
        )}
      </div>
    </div>
  );
}

/** גודל התמונה במקום שלה. הערך נשמר כשעוזבים את הסליידר, כדי שכל גרירה תהיה צעד undo אחד */
function SizeControl({ value, onChange }: { value: MediaRef; onChange: (m: MediaRef) => void }) {
  const id = useId();
  const scale = value.scale ?? 100;
  const [live, setLive] = useState(scale);
  const [prev, setPrev] = useState(scale);
  if (scale !== prev) {
    setPrev(scale);
    setLive(scale);
  }
  const commit = () => live !== scale && onChange({ ...value, scale: live });
  return (
    <div className="ad-media-size">
      <div className="ad-field">
        <label className="ad-label" htmlFor={id}>
          גודל
        </label>
        <div className="ad-slider">
          <input
            id={id}
            type="range"
            dir="ltr"
            min={SCALE.min}
            max={SCALE.max}
            step={SCALE.step}
            value={live}
            aria-valuetext={`${live}%`}
            onChange={(e) => setLive(Number(e.target.value))}
            onPointerUp={commit}
            onKeyUp={commit}
            onBlur={commit}
          />
          <output htmlFor={id} dir="ltr">
            {live}%
          </output>
        </div>
        <div className="ad-size-presets">
          {[100, 75, 50, 33].map((v) => (
            <button key={v} type="button" className="ad-chip" aria-pressed={scale === v} onClick={() => onChange({ ...value, scale: v })}>
              {v === 100 ? "מלא" : `${v}%`}
            </button>
          ))}
        </div>
      </div>
      {scale < 100 && (
        <Segmented
          label="יישור"
          value={value.align ?? "start"}
          onChange={(align) => onChange({ ...value, align })}
          options={[
            { value: "start", label: "ימין" },
            { value: "center", label: "מרכז" },
            { value: "end", label: "שמאל" },
          ]}
        />
      )}
    </div>
  );
}

type Props = {
  label: string;
  hint?: string;
  value: MediaRef | null;
  onChange: (m: MediaRef | null) => void;
  kind?: MediaKind;
  /** היחס שבו המדיה מוצגת באתר: לתצוגת החיתוך */
  ratio?: string;
  /** לאפשר סרטון מ-YouTube / Vimeo לפי קישור */
  allowEmbed?: boolean;
};

function EmbedInput({ onAdd }: { onAdd: (m: MediaRef) => void }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const add = () => {
    const e = toEmbed(url);
    if (!e) return setError("לא זיהיתי קישור של YouTube או Vimeo.");
    setError("");
    setUrl("");
    onAdd({ id: `embed:${e.src}`, kind: "embed", src: e.src, alt: "" });
  };
  return (
    <div className="ad-embed">
      <label className="ad-label" htmlFor="embed-url">
        או קישור לסרטון ב-YouTube / Vimeo
      </label>
      <div className="ad-embed-row">
        <input id="embed-url" className="ad-input" dir="ltr" placeholder="https://www.youtube.com/watch?v=..." value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())} />
        <Button onClick={add} disabled={!url.trim()}>
          הוספה
        </Button>
      </div>
      {error && <p className="ad-warning">{error}</p>}
    </div>
  );
}

export function MediaField({ label, hint, value, onChange, kind, ratio, allowEmbed }: Props) {
  const id = useId();
  const [picking, setPicking] = useState(false);
  const [editing, setEditing] = useState(false);
  const { upload, busy, errors } = useUploader();
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="ad-field is-wide ad-media-field" role="group" aria-labelledby={id}>
      <span className="ad-label" id={id}>
        {label}
      </span>
      {hint && <p className="ad-hint">{hint}</p>}
      <div className="ad-media-row">
        <button type="button" className="ad-media-thumb" onClick={() => (value ? setEditing(true) : setPicking(true))} aria-label={value ? `עריכת ${label}` : `בחירת ${label}`}>
          {value ? <Thumb asset={{ kind: value.kind, src: value.kind === "video" && value.poster ? value.poster : value.src, name: "" }} /> : <span>אין עדיין</span>}
        </button>
        <div className="ad-media-actions">
          <Button onClick={() => setPicking(true)}>{value ? "החלפה מהספרייה" : "בחירה מהספרייה"}</Button>
          <Button onClick={() => input.current?.click()} disabled={busy > 0}>
            {busy ? "מעלה…" : "העלאה"}
          </Button>
          {value && (
            <>
              <Button onClick={() => setEditing(true)}>פוקוס, חיתוך ותיאור</Button>
              <Button variant="ghost" onClick={() => onChange(null)}>
                הסרה
              </Button>
            </>
          )}
        </div>
        <input
          ref={input}
          type="file"
          hidden
          accept={kind === "video" ? "video/mp4,video/webm" : kind === "image" ? "image/jpeg,image/png,image/webp,image/avif,image/gif" : "image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm"}
          onChange={async (e) => {
            // העלאה ישירה מהשדה
            const f = e.target.files;
            if (f?.length) {
              const [a] = await upload(f);
              if (a) onChange(refFromAsset(a, value));
            }
            e.target.value = "";
          }}
        />
      </div>
      {value && <SizeControl value={value} onChange={onChange} />}
      {value && !value.alt && <p className="ad-warning">חסר תיאור לנגישות.</p>}
      {errors.map((e) => (
        <p key={e} className="ad-warning" role="alert">
          {e}
        </p>
      ))}

      <Modal open={picking} onClose={() => setPicking(false)} title={`בחירת ${label}`} wide>
        {allowEmbed && (
          <EmbedInput
            onAdd={(m) => {
              onChange({ ...m, alt: value?.alt ?? "" });
              setPicking(false);
            }}
          />
        )}
        <MediaLibrary
          kind={kind === "embed" ? undefined : kind}
          onSelect={(a) => {
            onChange(refFromAsset(a, value));
            setPicking(false);
          }}
        />
      </Modal>
      <Modal open={editing} onClose={() => setEditing(false)} title={label} wide>
        {value && <MediaRefEditor value={value} onChange={onChange} ratio={ratio} />}
      </Modal>
    </div>
  );
}
