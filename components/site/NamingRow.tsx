"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { Media } from "./Media";
import { el, type Elements } from "@/lib/elements";
import { SectionHead } from "./SectionHead";

export function NamingRow({ naming, els = {} }: { naming: SiteContent["naming"]; els?: Elements }) {
  const [all, setAll] = useState(false);
  const items = naming.items.filter((n) => !n.hidden);
  const FIRST = naming.visibleCount;
  const list = all ? items : items.slice(0, FIRST);

  return (
    <>
      <SectionHead
        title={naming.title}
        el={el(els, "naming.head")}
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
            {n.image ? (
              <Media media={n.image} ratio="16/9" sizes="(max-width: 699px) 50vw, 25vw" className="name-logo" />
            ) : (
              <span className={`name-mark is-${n.style}`} dir="auto">
                {n.name}
              </span>
            )}
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
