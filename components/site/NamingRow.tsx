"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { SectionHead } from "./SectionHead";

export function NamingRow({ naming }: { naming: SiteContent["naming"] }) {
  const [all, setAll] = useState(false);
  const items = naming.items.filter((n) => !n.hidden);
  const FIRST = naming.visibleCount;
  const list = all ? items : items.slice(0, FIRST);

  return (
    <>
      <SectionHead
        title={naming.title}
        action={
          items.length > FIRST && (
            <button type="button" className="section-action" aria-expanded={all} onClick={() => setAll((v) => !v)}>
              {all ? "פחות שמות" : "לכל השמות"} <span aria-hidden="true">{all ? "↑" : "←"}</span>
            </button>
          )
        }
      />
      <ul className="names">
        {list.map((n, i) => (
          <li key={n.id} className="name-cell" tabIndex={0} data-reveal="up" style={{ ["--i" as string]: i % 4 }}>
            <span className={`name-mark is-${n.style}`} dir="auto">
              {n.name}
            </span>
            <span className="name-info">
              {[n.description, n.client, n.year].filter(Boolean).length > 0 && <span>{[n.description, n.client, n.year].filter(Boolean).join(" · ")}</span>}
              {n.note && <span>{n.note}</span>}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
