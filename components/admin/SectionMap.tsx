"use client";

import { BLOCK_LABELS, SECTION_TEMPLATES } from "@/lib/content/blocks";
import type { BlockKind, CustomSection } from "@/lib/content/types";
import { useSections } from "./useSections";

const ICON: Record<BlockKind, string> = { heading: "כ", text: "¶", image: "▣", button: "⬭" };

/** מפה של הסקשן: החלקים בגריד, כמו באתר (בגודל מוקטן). עם onSelect היא גם בוחרת חלק */
export function SectionMap({
  s,
  selected,
  onSelect,
  onAdd,
  small,
}: {
  s: CustomSection;
  selected?: string;
  onSelect?: (cellId: string) => void;
  onAdd?: () => void;
  small?: boolean;
}) {
  return (
    <div className={`ad-smap${small ? " is-small" : ""}`} style={{ ["--cols" as string]: s.columns }} aria-hidden={!onSelect || undefined}>
      {s.cells.map((cell, i) => {
        const span = Math.min(cell.span, s.columns);
        const body = (
          <>
            {!small && <span className="ad-smap-num">חלק {i + 1}</span>}
            <span className="ad-smap-blocks" data-dir={cell.dir}>
              {cell.blocks.length ? (
                cell.blocks.map((b) => (
                  <span key={b.id} className={`ad-smap-block is-${b.kind}`} title={BLOCK_LABELS[b.kind]}>
                    {ICON[b.kind]}
                    {!small && <span className="sr-only">{BLOCK_LABELS[b.kind]}</span>}
                  </span>
                ))
              ) : (
                <span className="ad-smap-empty">ריק</span>
              )}
            </span>
          </>
        );
        return onSelect ? (
          <button
            key={cell.id}
            type="button"
            className="ad-smap-cell"
            style={{ gridColumn: `span ${span}` }}
            aria-pressed={selected === cell.id}
            aria-label={`חלק ${i + 1}: ${cell.blocks.length ? cell.blocks.map((b) => BLOCK_LABELS[b.kind]).join(", ") : "ריק"}`}
            onClick={() => onSelect(cell.id)}
          >
            {body}
          </button>
        ) : (
          <span key={cell.id} className="ad-smap-cell" style={{ gridColumn: `span ${span}` }}>
            {body}
          </span>
        );
      })}
      {onAdd && (
        <button type="button" className="ad-smap-cell is-add" onClick={onAdd}>
          + חלק
        </button>
      )}
    </div>
  );
}

/** מזהים קבועים לתצוגת התבניות (לא נשמרים) */
const previewId = () => {
  let n = 0;
  return (p: string) => `${p}-${n++}`;
};

/** בחירת תבנית לסקשן חדש */
export function TemplatePicker() {
  const { add } = useSections();
  return (
    <div className="ad-templates">
      {SECTION_TEMPLATES.map((t) => (
        <button key={t.id} type="button" className="ad-template" onClick={() => add(t.id)}>
          <SectionMap s={t.build(previewId())} small />
          <strong>{t.label}</strong>
          <span className="ad-hint">{t.hint}</span>
        </button>
      ))}
    </div>
  );
}
