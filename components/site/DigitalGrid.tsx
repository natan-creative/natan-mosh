"use client";

import { useState } from "react";
import type { DigitalItem, SiteContent } from "@/lib/content/types";
import { Media } from "./Media";

// משבצות ריבועיות. hover (או tap בטלפון) חושף: בעיה → רעיון → ביצוע.
export function DigitalGrid({ items, columns }: { items: DigitalItem[]; columns: SiteContent["digital"]["columns"] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div
      className="digital-grid"
      style={{ ["--cols-d" as string]: columns.desktop, ["--cols-t" as string]: columns.tablet, ["--cols-m" as string]: columns.mobile }}
    >
      {items.map((d, i) => {
        const isOpen = open === d.id;
        return (
          <article key={d.id} className="d-tile" data-open={isOpen || undefined} data-reveal="up" style={{ ["--i" as string]: i % columns.desktop }}>
            <button
              type="button"
              className="d-face"
              aria-expanded={isOpen}
              aria-label={`${d.title}${d.client ? `, ${d.client}` : ""}: בעיה, רעיון, ביצוע`}
              onClick={() => setOpen(isOpen ? null : d.id)}
            >
              <Media media={d.media} ratio="1/1" sizes={`(max-width: 599px) ${Math.round(100 / columns.mobile)}vw, (max-width: 1023px) ${Math.round(100 / columns.tablet)}vw, ${Math.round(100 / columns.desktop)}vw`} className="d-media" placeholder={d.title} />
              <span className="d-steps">
                <span className="d-head">
                  {d.title} {d.client && <small>{d.client}</small>}
                </span>
                {(
                  [
                    ["בעיה", d.problem],
                    ["רעיון", d.idea],
                    ["ביצוע", d.execution],
                  ] as const
                )
                  .filter(([, text]) => text)
                  .map(([label, text], s) => (
                    <span key={label} className="d-step" style={{ ["--s" as string]: s }}>
                      <b>{label}</b>
                      {text}
                    </span>
                  ))}
              </span>
            </button>
            {d.link && (
              <a href={d.link} className="d-link" target="_blank" rel="noreferrer">
                לצפייה בעבודה ←
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}
