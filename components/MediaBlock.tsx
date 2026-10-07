import type { Media } from "@/content/site";

export function MediaBlock({ media, className = "" }: { media: Media; className?: string }) {
  if (media.kind === "placeholder") {
    return (
      <div className={`media ${media.ratio ?? "wide"} ${className}`}>
        <div className="media-placeholder">{media.label}</div>
      </div>
    );
  }

  const body =
    media.kind === "image" ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={media.src} alt={media.alt} loading="lazy" />
    ) : media.kind === "video" ? (
      <video src={media.src} poster={media.poster} controls playsInline preload="metadata" />
    ) : (
      <div className="media wide">
        <iframe src={media.src} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
      </div>
    );

  return (
    <figure className={className}>
      {body}
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  );
}
