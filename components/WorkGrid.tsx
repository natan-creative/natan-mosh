import Link from "next/link";
import { ViewTransition } from "react";
import { works } from "@/content/site";
import { Media } from "@/components/Media";

export const pad = (n: number) => String(n).padStart(2, "0");

export function WorkGrid() {
  return (
    <div className="work-grid">
      {works.map((w, i) => (
        <Link
          key={w.slug}
          href={`/work/${w.slug}`}
          transitionTypes={["nav-forward"]}
          className="work-card"
          data-cursor={w.type === "case" ? "VIEW" : "IDEA →"}
          style={{ ["--accent" as string]: w.accent, ["--i" as string]: i }}
          data-reveal="up"
        >
          <ViewTransition name={`work-${w.slug}`} share="morph" default="none">
            <div className="work-frame">
              <Media media={w.cover} ratio="3/4" sizes="(max-width: 599px) 100vw, (max-width: 999px) 50vw, 25vw" priority={i < 2} className="work-media" focus={w.focus} />
            </div>
          </ViewTransition>
          <h3 className="work-title">{w.title}</h3>
          <p className="work-kind">{w.kind}</p>
        </Link>
      ))}
    </div>
  );
}
