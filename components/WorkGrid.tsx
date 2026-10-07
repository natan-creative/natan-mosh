import Link from "next/link";
import { ViewTransition } from "react";
import { works } from "@/content/site";
import { Media } from "@/components/Media";

export const pad = (n: number) => String(n).padStart(2, "0");

const sizes: Record<string, string> = {
  major: "(max-width: 767px) 100vw, 58vw",
  side: "(max-width: 767px) 100vw, 34vw",
  mid: "(max-width: 767px) 100vw, 46vw",
  small: "(max-width: 767px) 100vw, 34vw",
};

export function WorkGrid() {
  return (
    <div className="work-grid">
      {works.map((w, i) => (
        <Link
          key={w.slug}
          href={`/work/${w.slug}`}
          transitionTypes={["nav-forward"]}
          className={`work-card is-${w.layout}`}
          data-cursor={w.type === "case" ? "VIEW" : "IDEA →"}
          style={{ ["--accent" as string]: w.accent }}
          data-reveal="up"
        >
          <ViewTransition name={`work-${w.slug}`} share="morph" default="none">
            <div className="work-frame">
              <Media media={w.cover} ratio={w.ratio} sizes={sizes[w.layout]} priority={i === 0} className="work-media" />
            </div>
          </ViewTransition>
          <div className="work-info">
            <span className="work-num latin">
              <span className="work-num-a">{pad(i + 1)}</span>
              <span className="work-num-b">{pad(i + 1)} · {w.type === "case" ? "VIEW CASE" : "ENTER IDEA"} ←</span>
            </span>
            <h3 className="work-title">{w.title}</h3>
            <p className="work-sub">{w.subtitle}</p>
            <span className="work-cat latin">[{w.category}]</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
