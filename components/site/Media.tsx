import Image from "next/image";
import type { MediaRef, Ratio } from "@/lib/content/types";
import { LazyVideo } from "./LazyVideo";

type Props = {
  media: MediaRef | null;
  ratio: Ratio;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** מה לכתוב במשבצת כשאין מדיה */
  placeholder?: string;
};

export function mediaStyle(m: MediaRef): React.CSSProperties {
  const fx = m.focal?.x ?? 50;
  const fy = m.focal?.y ?? 50;
  const zoom = m.zoom ?? 1;
  return {
    objectFit: m.fit === "contain" || m.fit === "original" ? "contain" : "cover",
    objectPosition: `${fx}% ${fy}%`,
    ...(zoom > 1 ? { transform: `scale(${zoom})`, transformOrigin: `${fx}% ${fy}%` } : {}),
  };
}

/** תמונה מוקטנת: רוחב באחוזים, ויישור לימין / למרכז / לשמאל */
function sizeStyle(m: MediaRef | null): React.CSSProperties {
  const scale = m?.scale ?? 100;
  if (scale >= 100) return {};
  const align = m?.align ?? "start";
  return { width: `${scale}%`, marginInlineStart: align === "start" ? 0 : "auto", marginInlineEnd: align === "end" ? 0 : "auto" };
}

// מסגרת ביחס קבוע + התוכן בפנים. תמונות דרך next/image (AVIF/WebP, lazy, srcset), וידאו lazy,
// וסרטונים מ-YouTube/Vimeo ב-iframe שנטען רק כשמתקרבים אליו.
export function Media({ media, ratio, sizes, priority, className = "", placeholder = "" }: Props) {
  const natural = media?.fit === "original" && media.width && media.height ? `${media.width} / ${media.height}` : null;
  return (
    <div className={`media ${className}`} data-fit={media?.fit === "contain" || media?.fit === "original" ? "contain" : undefined} style={{ aspectRatio: natural ?? ratio.replace("/", " / "), ...sizeStyle(media) }}>
      {media?.kind === "image" && (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={media.src.endsWith(".gif")}
          style={mediaStyle(media)}
        />
      )}
      {media?.kind === "video" && <LazyVideo media={media} style={mediaStyle(media)} eager={priority} />}
      {media?.kind === "embed" && (
        <iframe
          src={media.src}
          title={media.alt || "וידאו"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
      {!media && placeholder && <span className="media-placeholder">{placeholder}</span>}
    </div>
  );
}
