import Link from "next/link";
import type { Project, Ratio } from "@/lib/content/types";
import { Media } from "./Media";

export const pad = (n: number) => String(n).padStart(2, "0");

/**
 * הכרטיס בגריד ותמונת הפתיחה בעמוד העבודה חולקים שם מעבר, כך שהתמונה "גדלה" לעמוד.
 * השם ניתן ב-CSS ולא ב-<ViewTransition name>: Next משאיר עמודים קודמים מוסתרים (Activity),
 * ו-React היה רואה שני רכיבים עם אותו שם לרגע. הדפדפן מתעלם מאלמנטים מוסתרים, אז אין כפילות.
 */
export const morphStyle = (id: string): React.CSSProperties =>
  ({ viewTransitionName: `work-${id}`, viewTransitionClass: "morph" }) as React.CSSProperties;

export function WorkGrid({ projects, columns = 3, ratio = "4/3" }: { projects: Project[]; columns?: number; ratio?: Ratio }) {
  return (
    <div className="work-grid" style={{ ["--work-cols" as string]: columns }}>
      {projects.map((w, i) => (
        <Link
          key={w.id}
          href={`/work/${w.slug}`}
          transitionTypes={["nav-forward"]}
          className="work-card"
          data-cursor={w.type === "case" ? "VIEW" : "IDEA →"}
          style={{ ["--accent" as string]: w.design.accent, ["--i" as string]: i % columns }}
          data-reveal="up"
        >
          <div className="work-frame" style={morphStyle(w.id)}>
            <Media media={w.cover} ratio={ratio} sizes={`(max-width: 999px) 100vw, ${Math.round(100 / columns)}vw`} priority={i < 2} className="work-media" placeholder={w.title} />
          </div>
          <h3 className="work-title">{w.title}</h3>
          <p className="work-kind">{w.kind}</p>
        </Link>
      ))}
    </div>
  );
}
