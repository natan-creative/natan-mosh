"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { names } from "@/content/site";

// השמות מתחלפים כמו דפדוף ברעיונות: הנוכחי עולה החוצה, הבא נכנס מלמטה.
export function NamingStage() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (touched || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(id);
      if (e.isIntersecting) id = setInterval(() => setActive((a) => (a + 1) % names.length), 2600);
    });
    if (ref.current) io.observe(ref.current);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [touched]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  const current = names[active];

  return (
    <div className="naming" ref={ref}>
      <div className="naming-stage" aria-live="polite">
        <div className="naming-words">
          {names.map((n, i) => (
            <span
              key={i}
              className={`naming-word v${i % 4}`}
              data-state={i === active ? "in" : i < active ? "before" : "after"}
              aria-hidden={i !== active}
            >
              {n.name}
            </span>
          ))}
        </div>
        <div className="naming-image">
          {names.map((n, i) =>
            n.image?.kind === "image" ? (
              <Image
                key={i}
                src={n.image.src}
                alt={i === active ? n.image.alt : ""}
                fill
                sizes="(max-width: 767px) 100vw, 30vw"
                data-on={i === active || undefined}
              />
            ) : null,
          )}
        </div>
        <p className="naming-note">
          <span className="naming-what">{current.what}</span>
          {current.note && <span>{current.note}</span>}
        </p>
      </div>

      <ol className="naming-list">
        {names.map((n, i) => (
          <li key={i}>
            <button
              type="button"
              data-on={i === active || undefined}
              onMouseEnter={() => pick(i)}
              onFocus={() => pick(i)}
              onClick={() => pick(i)}
            >
              <span className="naming-idx latin">{String(i + 1).padStart(2, "0")}</span>
              <span className="latin">{n.name}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
