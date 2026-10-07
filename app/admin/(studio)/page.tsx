"use client";

import Link from "next/link";
import { AREA_LABELS } from "@/lib/content/diff";
import { openPreview, usePublishFlow } from "@/components/admin/StudioShell";
import { usePreviewPath, useStudio } from "@/components/admin/StudioContext";
import { Button } from "@/components/admin/ui";

const QUICK = [
  { href: "/admin/hero", title: "פתיחה", text: "הכותרת, הפתק והתמונה בפתיחה" },
  { href: "/admin/work", title: "עבודות נבחרות", text: "העבודות המרכזיות" },
  { href: "/admin/digital", title: "דיגיטל ורעיונות", text: "בעיה → רעיון → ביצוע" },
  { href: "/admin/naming", title: "שמות", text: "השמות שיצרת" },
  { href: "/admin/media", title: "ספריית מדיה", text: "תמונות וסרטונים" },
  { href: "/admin/style", title: "סגנון וצבעים", text: "מגזיני, נועז, מינימלי, כהה" },
];

export default function Dashboard() {
  const { content, changes } = useStudio();
  const publishFlow = usePublishFlow();
  usePreviewPath("/");
  const first = content.brand.name.split(" ")[0];

  return (
    <div className="ad-dashboard">
      <header className="ad-hello">
        <h1>שלום, {first}.</h1>
        <p>האתר שלך מוכן לעריכה.</p>
      </header>

      <div className="ad-cards">
        <section className="ad-stat">
          <h2>האתר</h2>
          <p className="ad-stat-big">מפורסם</p>
          <a href="/" target="_blank" rel="noreferrer" className="ad-link">
            לאתר החי ↗
          </a>
        </section>
        <section className="ad-stat">
          <h2>שינויים אחרונים</h2>
          <p className="ad-stat-big">{changes.length ? `${changes.length} ${changes.length === 1 ? "שינוי" : "שינויים"} שלא פורסמו` : "הכל מפורסם ✓"}</p>
          {changes.length > 0 && <p className="ad-hint">{changes.map((k) => AREA_LABELS[k]).join(", ")}</p>}
        </section>
        <section className="ad-stat">
          <h2>תצוגה מקדימה</h2>
          <p className="ad-hint">האתר עם כל השינויים, לפני שהם עולים לאוויר.</p>
          <Button onClick={() => openPreview("/")}>פתח תצוגה מקדימה</Button>
        </section>
        <section className="ad-stat">
          <h2>פרסום</h2>
          <p className="ad-hint">מעלה את הטיוטה לאתר החי.</p>
          <Button variant="primary" onClick={publishFlow} disabled={!changes.length}>
            פרסם שינויים
          </Button>
        </section>
      </div>

      <h2 className="ad-section-title">מה רוצים לעשות?</h2>
      <div className="ad-quick">
        {QUICK.map((q) => (
          <Link key={q.href} href={q.href} className="ad-quick-card">
            <strong>{q.title}</strong>
            <span>{q.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
