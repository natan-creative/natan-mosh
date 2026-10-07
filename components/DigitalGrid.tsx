"use client";

import Image from "next/image";
import { useState } from "react";
import { digital } from "@/content/site";

// גריד משתנה: 4 → 3 → 2 → 3. כל שורה ביחס תמונה משלה.
const rows = [
  { count: 4, ratio: "4 / 5", sizes: "(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 25vw" },
  { count: 3, ratio: "1 / 1", sizes: "(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 33vw" },
  { count: 2, ratio: "3 / 2", sizes: "(max-width: 767px) 100vw, 50vw" },
  { count: 3, ratio: "1 / 1", sizes: "(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 33vw" },
];

const layout = rows.flatMap((r) => Array.from({ length: r.count }, () => r));

export function DigitalGrid() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="digital-grid">
      {digital.map((d, i) => {
        const row = layout[i % layout.length];
        const isOpen = open === i;
        return (
          <article
            key={i}
            className="d-tile"
            data-open={isOpen || undefined}
            style={{ ["--span" as string]: 12 / row.count, ["--accent" as string]: d.accent ?? "var(--ink)" }}
            data-reveal="up"
          >
            <button
              type="button"
              className="d-face"
              style={{ aspectRatio: row.ratio }}
              aria-expanded={isOpen}
              aria-label={`${d.title}: בעיה, רעיון, ביצוע`}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              {d.face === "visual" && d.media?.kind === "image" ? (
                <Image src={d.media.src} alt={d.media.alt} fill sizes={row.sizes} />
              ) : d.face === "logo" && d.logo ? (
                <Image src={d.logo} alt={d.client} fill sizes={row.sizes} className="d-logo" />
              ) : (
                <span className="d-headline">{d.headline ?? d.client}</span>
              )}
              <span className="d-steps">
                <span className="d-step" style={{ ["--s" as string]: 0 }}>
                  <b>בעיה</b>
                  {d.problem}
                </span>
                <span className="d-step" style={{ ["--s" as string]: 1 }}>
                  <b>רעיון</b>
                  {d.idea}
                </span>
                <span className="d-step" style={{ ["--s" as string]: 2 }}>
                  <b>ביצוע</b>
                  {d.execution}
                </span>
              </span>
            </button>
            <div className="d-meta">
              <h3 className="d-title">{d.title}</h3>
              <span className="d-client">{d.client}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
