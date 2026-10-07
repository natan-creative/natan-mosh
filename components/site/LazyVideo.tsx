"use client";

import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/lib/a11y";
import type { MediaRef } from "@/lib/content/types";

// וידאו שלא נטען עד שהוא מתקרב למסך. autoplay רק מושתק, ולא כשמבקשים פחות תנועה או חוסכים בנתונים.
export function LazyVideo({ media, style, eager }: { media: MediaRef; style?: React.CSSProperties; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | undefined>(eager ? media.src : undefined);
  const autoplay = media.autoplay ?? true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const canAutoplay = autoplay && !reducedMotion() && !saveData;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSrc(media.src);
          if (canAutoplay) el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [media.src, autoplay]);

  const controls = media.controls ?? !autoplay;
  return (
    <video
      ref={ref}
      src={src}
      poster={media.poster || undefined}
      muted={media.muted ?? autoplay}
      loop={media.loop ?? autoplay}
      controls={controls}
      playsInline
      preload={src ? "metadata" : "none"}
      aria-label={media.alt || undefined}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }}
    />
  );
}
