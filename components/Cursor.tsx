"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// cursor קטן שמופיע רק מעל אלמנטים עם data-cursor. רק בעכבר אמיתי.
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);

  // אחרי מעבר עמוד האלמנט שמתחת לעכבר כבר לא קיים: מאפסים
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setLabel(null);
  }

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;

    const tick = () => {
      cx += (x - cx) * (reduce ? 1 : 0.22);
      cy += (y - cy) * (reduce ? 1 : 0.22);
      if (ref.current) ref.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(t ? t.getAttribute("data-cursor") : null);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => setLabel(null);

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" data-active={label ? "" : undefined} aria-hidden="true">
      <span className="cursor-dot latin">{label}</span>
    </div>
  );
}
