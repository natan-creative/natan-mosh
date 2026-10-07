import Link from "next/link";
import type { Project } from "@/lib/content/types";
import { Media } from "./Media";

export const pad = (n: number) => String(n).padStart(2, "0");

/**
 * הכרטיס בגריד ותמונת הפתיחה בעמוד העבודה חולקים שם מעבר, כך שהתמונה "גדלה" לעמוד.
 * השם ניתן ב-CSS ולא ב-<ViewTransition name>: Next משאיר עמודים קודמים מוסתרים (Activity),
 * ו-React היה רואה שני רכיבים עם אותו שם לרגע. הדפדפן מתעלם מאלמנטים מוסתרים, אז אין כפילות.
 */
export const morphStyle = (id: string): React.CSSProperties =>
  ({ viewTransitionName: `work-${id}`, viewTransitionClass: "morph" }) as React.CSSProperties;

export function WorkGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="work-grid">
      {projects.map((w, i) => (
        <Link
          key={w.id}
          href={`/work/${w.slug}`}
          transitionTypes={["nav-forward"]}
          className="work-card"
          data-cursor={w.type === "case" ? "VIEW" : "IDEA →"}
          style={{ ["--accent" as string]: w.design.accent, ["--i" as string]: i % 4 }}
          data-reveal="up"
        >
          <div className="work-frame" style={morphStyle(w.id)}>
            <Media media={w.cover} ratio="3/4" sizes="(max-width: 599px) 50vw, (max-width: 999px) 50vw, 25vw" priority={i < 2} className="work-media" placeholder={w.title} />
          </div>
          <h3 className="work-title">{w.title}</h3>
          <p className="work-kind">{w.kind}</p>
        </Link>
      ))}
    </div>
  );
}
