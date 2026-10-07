"use client";

import { useEffect, useRef } from "react";

// parallax עדין מאוד. כבוי במובייל וב-reduced motion.
export function Parallax({ children, strength = 0.08 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !matchMedia("(min-width: 768px)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      el.style.transform = `translate3d(0, ${(r.top * -strength).toFixed(1)}px, 0) scale(1.06)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div className="parallax">
      <div ref={ref} className="parallax-inner">
        {children}
      </div>
    </div>
  );
}
