import Link from "next/link";
import { sectionAnchor } from "@/lib/content/blocks";
import type { Block, CustomSection } from "@/lib/content/types";
import { Media } from "./Media";
import { SectionHead } from "./SectionHead";

// סקשן שנבנה ב-Admin: גריד של עד 4 עמודות. כל חלק תופס כמה עמודות, ובתוכו רכיבים
// אחד מתחת לשני או זה לצד זה. בטאבלט עד 2 עמודות, בטלפון הכל בטור וחלקים ריקים נעלמים.

function BlockView({ b, columns, span, heading }: { b: Block; columns: number; span: number; heading: "h2" | "h3" }) {
  const style = { textAlign: b.align } as React.CSSProperties;
  switch (b.kind) {
    case "heading": {
      const H = heading;
      return (
        <H className="csec-heading" style={style}>
          {b.text}
        </H>
      );
    }
    case "text":
      return (
        <div className="csec-text" data-align={b.align} style={style}>
          {b.text
            .split("\n")
            .filter((l) => l.trim())
            .map((l, i) => (
              <p key={i}>{l}</p>
            ))}
        </div>
      );
    case "image": {
      const vw = Math.round((100 * span) / columns);
      return (
        <figure className="csec-media">
          <Media media={b.media} ratio={b.ratio} sizes={`(max-width: 599px) 100vw, (max-width: 1023px) 50vw, ${vw}vw`} />
          {b.media?.caption && <figcaption>{b.media.caption}</figcaption>}
        </figure>
      );
    }
    case "button":
      if (!b.text || !b.href) return null;
      return (
        <div className="csec-btn" style={{ justifyContent: b.align === "center" ? "center" : b.align === "end" ? "flex-end" : "flex-start" }}>
          <Link href={b.href} className="btn btn-primary">
            {b.text}
          </Link>
        </div>
      );
  }
}

export function CustomSectionView({ s }: { s: CustomSection }) {
  const heading = s.title ? "h3" : "h2";
  return (
    <section
      id={sectionAnchor(s.id)}
      className={`section csec is-gap-${s.gap}`}
      data-tone={s.tone === "inverted" || undefined}
      aria-label={s.title || s.name}
      style={{ ["--cols" as string]: s.columns }}
    >
      <div className="wrap">
        {s.title && <SectionHead title={s.title} />}
        <div className="csec-grid">
          {s.cells.map((cell) => {
            const span = Math.min(cell.span, s.columns);
            return (
              <div
                key={cell.id}
                className="csec-cell"
                data-cell={cell.id}
                data-empty={!cell.blocks.length || undefined}
                data-dir={cell.dir}
                data-valign={cell.valign}
                data-reveal="up"
                suppressHydrationWarning
                style={{ ["--span" as string]: span, ["--span-t" as string]: Math.min(span, 2) }}
              >
                {cell.blocks.map((b) => (
                  <BlockView key={b.id} b={b} columns={s.columns} span={span} heading={heading} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
