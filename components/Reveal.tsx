"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// מוסיף is-in לכל [data-reveal] כשהוא נכנס למסך. שלושה סוגים בלבד: up / slide / scale.
export function Reveal() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    // אחרי הניווט הראשון: אנימציות "טעינה ראשונה" מפנות מקום למעברי העמודים
    if (first.current) first.current = false;
    else document.documentElement.classList.remove("first-load");

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
