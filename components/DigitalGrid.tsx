"use client";

import Image from "next/image";
import { useState } from "react";
import { digital } from "@/content/site";

// משבצות ריבועיות. hover (או tap בטלפון) חושף: בעיה → רעיון → ביצוע.
export function DigitalGrid({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const items = limit ? digital.slice(0, limit) : digital;

  return (
    <div className="digital-grid">
      {items.map((d, i) => {
        const isOpen = open === i;
        return (
          <article key={i} className="d-tile" data-open={isOpen || undefined} data-reveal="up" style={{ ["--i" as string]: i % 5 }}>
            <button
              type="button"
              className="d-face"
              aria-expanded={isOpen}
              aria-label={`${d.title}, ${d.client}: בעיה, רעיון, ביצוע`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {d.face === "visual" && d.media?.kind === "image" ? (
                <Image src={d.media.src} alt={d.media.alt} fill sizes="(max-width: 599px) 50vw, (max-width: 999px) 33vw, 20vw" />
              ) : d.face === "logo" && d.logo ? (
                <Image src={d.logo} alt={d.client} fill sizes="20vw" className="d-logo" />
              ) : (
                <span className="d-headline">{d.headline ?? d.client}</span>
              )}
              <span className="d-steps">
                <span className="d-head">
                  {d.title} <small>{d.client}</small>
                </span>
                {(
                  [
                    ["בעיה", d.problem],
                    ["רעיון", d.idea],
                    ["ביצוע", d.execution],
                  ] as const
                ).map(([label, text], s) => (
                  <span key={label} className="d-step" style={{ ["--s" as string]: s }}>
                    <b>{label}</b>
                    {text}
                  </span>
                ))}
              </span>
            </button>
          </article>
        );
      })}
    </div>
  );
}
