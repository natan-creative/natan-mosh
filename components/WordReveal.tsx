"use client";

import { useEffect, useRef } from "react";

// המשפט מתגלה בזמן גלילה: מילה אחרי מילה, כמשפט אחד.
export function WordReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const start = innerHeight * 0.9;
      const end = innerHeight * 0.35;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p ref={ref} className="word-reveal" style={{ ["--n" as string]: words.length }}>
      {words.map((w, i) => (
        <span key={i} style={{ ["--i" as string]: i }}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
