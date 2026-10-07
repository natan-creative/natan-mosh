"use client";

import { useState } from "react";
import { names } from "@/content/site";
import { SectionHead } from "@/components/SectionHead";

const FIRST = 4;

export function NamingRow() {
  const [all, setAll] = useState(false);
  const list = all ? names : names.slice(0, FIRST);

  return (
    <>
      <SectionHead
        title="NAMING"
        action={
          names.length > FIRST && (
            <button type="button" className="section-action" aria-expanded={all} onClick={() => setAll((v) => !v)}>
              {all ? "פחות שמות" : "לכל השמות"} <span aria-hidden="true">{all ? "↑" : "←"}</span>
            </button>
          )
        }
      />
      <ul className="names">
        {list.map((n, i) => (
          <li key={n.name} className="name-cell" tabIndex={0} data-reveal="up" style={{ ["--i" as string]: i % FIRST }}>
            <span className={`name-mark is-${n.style}`} dir="auto">
              {n.name}
            </span>
            <span className="name-info">
              <span>{n.what}</span>
              {n.note && <span>{n.note}</span>}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}
