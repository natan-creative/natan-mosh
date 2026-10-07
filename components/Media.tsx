import Image from "next/image";
import type { Media as MediaT, Ratio } from "@/content/site";

type Props = {
  media: MediaT;
  ratio: Ratio;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** נקודת המיקוד בחיתוך, למשל "20% 50%" */
  focus?: string;
};

// מסגרת ביחס קבוע + התוכן בפנים. תמונות דרך next/image (AVIF/WebP, lazy, srcset).
export function Media({ media, ratio, sizes, priority, className = "", focus }: Props) {
  return (
    <div className={`media ${className}`} style={{ aspectRatio: ratio.replace("/", " / ") }}>
      {media.kind === "image" && (
        <Image src={media.src} alt={media.alt} fill sizes={sizes} priority={priority} style={focus ? { objectPosition: focus } : undefined} />
      )}
      {media.kind === "video" && (
        <video src={media.src} poster={media.poster} controls playsInline preload="metadata" />
      )}
      {media.kind === "embed" && (
        <iframe src={media.src} title={media.caption ?? "וידאו"} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen loading="lazy" />
      )}
      {media.kind === "placeholder" && <span className="media-placeholder">{media.label}</span>}
    </div>
  );
}
