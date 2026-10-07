"use client";

import { useEffect, useRef, useState } from "react";

// "האתר חושב": מונה מחשבות קטן בפינה. מגיב מעט לעכבר.
export function ThoughtTicker({ words }: { words: string[] }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setN((v) => v + 1), 1900);
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      if (!ref.current) return;
      const dx = (e.clientX / innerWidth - 0.5) * 10;
      const dy = (e.clientY / innerHeight - 0.5) * 8;
      ref.current.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0)`;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      clearInterval(id);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const word = words[n % words.length];
  const next = words[(n + 1) % words.length];

  return (
    <div ref={ref} className="thought latin" aria-hidden="true">
      <span className="thought-label">THOUGHT #{String((n % 99) + 1).padStart(2, "0")}</span>
      <span className="thought-flow">
        <span key={n} className="thought-word">
          {word}
        </span>
        <span className="thought-arrow">→</span>
        <span className="thought-next">{next}</span>
      </span>
    </div>
  );
}
