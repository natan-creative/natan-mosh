// התצוגות של האתר. מקבלות את התוכן כ-props, כך שאותו קוד מציג את האתר המפורסם,
// את ה-Live Preview ואת הגרסאות בהיסטוריה.
import Link from "next/link";
import { notFound } from "next/navigation";
import type { SiteContent } from "@/lib/content/types";
import { AboutContact, real, SiteFooter, tel } from "./AboutContact";
import { DigitalGrid } from "./DigitalGrid";
import { Hero } from "./Hero";
import { Media } from "./Media";
import { NamingRow } from "./NamingRow";
import { PageTransition } from "./PageTransition";
import { Parallax } from "./Parallax";
import { SectionHead } from "./SectionHead";
import { morphStyle, pad, WorkGrid } from "./WorkGrid";
import { el, shown } from "@/lib/elements";

const visibleProjects = (c: SiteContent) => c.work.projects.filter((p) => !p.hidden);
const visibleDigital = (c: SiteContent) => c.digital.items.filter((d) => !d.hidden);

export function HomeView({ c }: { c: SiteContent }) {
  const visible = new Set(c.sections.filter((s) => s.visible).map((s) => s.id));
  // About ו-Contact מוצגים יחד, במיקום של הראשון מביניהם
  const acAt = c.sections.findIndex((s) => s.visible && (s.id === "about" || s.id === "contact"));
  return (
    <PageTransition>
      <main id="main">
        <Hero hero={c.hero} brand={c.brand} els={c.elements} />
        {c.sections.map((s, i) => {
          if (!s.visible) return null;
          switch (s.id) {
            case "work":
              return (
                <section key="work" id="work" className="section wrap" aria-label={c.work.title}>
                  <SectionHead title={c.work.title} action={{ href: "/work", label: c.work.linkLabel }} el={el(c.elements, "work.head")} />
                  <WorkGrid projects={visibleProjects(c)} columns={c.work.columns} ratio={c.work.cardRatio} />
                </section>
              );
            case "digital":
              return (
                <section key="digital" id="digital" className="section wrap" aria-label={c.digital.title}>
                  <SectionHead title={c.digital.title} action={visibleDigital(c).length > c.digital.homeLimit ? { href: "/work#digital", label: c.digital.linkLabel } : undefined} />
                  {c.digital.intro && shown(c.elements, "digital.intro") && (
                    <p className="section-intro" {...el(c.elements, "digital.intro")}>
                      {c.digital.intro}
                    </p>
                  )}
                  <DigitalGrid items={visibleDigital(c).slice(0, c.digital.homeLimit)} columns={c.digital.columns} />
                </section>
              );
            case "naming":
              return (
                <section key="naming" id="naming" className="section wrap" aria-label={c.naming.title}>
                  <NamingRow naming={c.naming} els={c.elements} />
                </section>
              );
            default:
              if (i !== acAt) return null;
              return <AboutContact key="ac" c={c} showAbout={visible.has("about")} showContact={visible.has("contact")} withFooter={false} />;
          }
        })}
      </main>
      <SiteFooter c={c} withForm={visible.has("contact")} />
    </PageTransition>
  );
}

export function WorkIndexView({ c }: { c: SiteContent }) {
  return (
    <PageTransition>
      <main id="main">
        <header className="page-head wrap">
          <h1 className="page-title latin">ALL WORK</h1>
        </header>
        <section className="section wrap" aria-label={c.work.title}>
          <SectionHead title={c.work.title} />
          <WorkGrid projects={visibleProjects(c)} columns={c.work.columns} ratio={c.work.cardRatio} />
        </section>
        <section id="digital" className="section wrap" aria-label={c.digital.title}>
          <SectionHead title={c.digital.title} />
          {c.digital.intro && <p className="section-intro">{c.digital.intro}</p>}
          <DigitalGrid items={visibleDigital(c)} columns={c.digital.columns} />
        </section>
      </main>
      <AboutContact c={c} />
    </PageTransition>
  );
}

function Chapter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="chapter" data-reveal="up">
      <h2 className="label latin">{label}</h2>
      <div className="chapter-body">{children}</div>
    </section>
  );
}

export function ProjectView({ c, slug }: { c: SiteContent; slug: string }) {
  const list = visibleProjects(c);
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1) notFound();
  const w = list[i];
  const next = list[(i + 1) % list.length];
  const isCase = w.type === "case";
  const meta = [
    ["לקוח", w.client],
    ["תפקיד", w.role],
    ["שנה", w.year],
    ["סוג", w.category],
  ].filter(([, v]) => v);

  return (
    <PageTransition>
      <main id="main" className="case" data-align={w.design.align} style={{ ["--accent" as string]: w.design.accent }}>
        <header className="case-hero wrap">
          <Link href="/#work" className="back text-link" transitionTypes={["nav-back"]}>
            → כל העבודות
          </Link>
          <div className="case-top layer" style={{ ["--l" as string]: 0 }}>
            <p className="case-num latin">
              {pad(i + 1)} {w.category && <span>/ {w.category}</span>}
            </p>
            {w.logo && <Media media={w.logo} ratio="3/1" sizes="240px" className="case-logo" />}
          </div>
          <h1 className="case-title layer" style={{ ["--l" as string]: 1 }}>
            {w.title}
          </h1>
          {w.subtitle && (
            <p className="case-sub layer" style={{ ["--l" as string]: 2 }}>
              {w.subtitle}
            </p>
          )}
        </header>

        {w.cover && (
          <div className="case-visual wrap">
            <div className="case-cover" style={morphStyle(w.id)}>
              <Parallax>
                <Media media={w.cover} ratio={w.design.heroRatio} sizes="100vw" priority />
              </Parallax>
            </div>
          </div>
        )}

        <div className="wrap">
          {meta.length > 0 && (
            <dl className="case-meta" data-reveal="slide">
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="chapters">
            {w.brief && (
              <Chapter label="THE BRIEF">
                <p className="lead">{w.brief}</p>
              </Chapter>
            )}
            {w.challenge && (
              <Chapter label="THE CHALLENGE">
                <p className="lead">{w.challenge}</p>
              </Chapter>
            )}
            {w.insight && (
              <Chapter label="THE INSIGHT">
                <p className="lead">{w.insight}</p>
              </Chapter>
            )}
            {(w.idea || (!isCase && w.summary)) && (
              <Chapter label="THE IDEA">
                {w.idea && <p className="big-idea" data-long={w.idea.length > 90 || undefined}>{w.idea}</p>}
                {w.ideaMore && <p className="body-text">{w.ideaMore}</p>}
                {!isCase && !w.idea && w.summary && <p className="lead">{w.summary}</p>}
              </Chapter>
            )}
            {w.execution && (
              <Chapter label="THE EXECUTION">
                <p className="lead">{w.execution}</p>
              </Chapter>
            )}
            {w.myPart && (
              <Chapter label="MY ROLE">
                <p className="lead">{w.myPart}</p>
              </Chapter>
            )}
          </div>

          {w.gallery.length > 0 && (
            <div className="gallery">
              {w.gallery.map((g) => (
                <figure key={g.id} className={`gallery-item is-${g.span}`} data-reveal="scale">
                  <Media media={g.media} ratio={g.ratio} sizes={g.span === "half" ? "(max-width: 767px) 100vw, 50vw" : "100vw"} />
                  {g.media.caption && <figcaption>{g.media.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          {isCase && (w.result || w.stats.length > 0) && (
            <div className="chapters">
              <Chapter label="THE RESULT">
                {w.result && <p className="lead">{w.result}</p>}
                {w.stats.length > 0 && (
                  <ul className="stats">
                    {w.stats.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                )}
              </Chapter>
            </div>
          )}

          {(w.credits || w.links.length > 0) && (
            <div className="case-extra" data-reveal="up">
              {w.credits && (
                <div>
                  <h2 className="label latin">CREDITS</h2>
                  <p className="body-text case-credits">{w.credits}</p>
                </div>
              )}
              {w.links.length > 0 && (
                <div className="case-links">
                  {w.links.map((l) => (
                    <a key={l.id} href={l.href} className="btn btn-secondary" target="_blank" rel="noreferrer">
                      {l.label} <span aria-hidden="true">←</span>
                      <span className="sr-only">(נפתח בחלון חדש)</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {next && next.id !== w.id && (
            <Link href={`/work/${next.slug}`} className="next-work" transitionTypes={["nav-forward"]} data-cursor="NEXT" style={{ ["--accent" as string]: next.design.accent }}>
              <span className="label latin">NEXT IDEA · {pad(list.indexOf(next) + 1)}</span>
              <strong>{next.title}</strong>
              {next.subtitle && <span className="next-sub">{next.subtitle}</span>}
            </Link>
          )}
        </div>
      </main>
      <AboutContact c={c} />
    </PageTransition>
  );
}

export function AccessibilityView({ c, updated }: { c: SiteContent; updated: string }) {
  const { contact } = c;
  return (
    <PageTransition>
      <main id="main" className="wrap statement">
        <h1 className="page-title latin">ACCESSIBILITY</h1>
        <p className="statement-lead">הצהרת נגישות</p>

        <section>
          <h2>מחויבות לנגישות</h2>
          <p>
            חשוב לי שכל אחד ואחת יוכלו לגלוש באתר, לראות את העבודות וליצור קשר, כולל אנשים עם מוגבלות. האתר נבנה
            והונגש בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע״ג-2013, ולתקן הישראלי
            ת״י 5568, המבוסס על הנחיות WCAG 2.0, ברמה AA.
          </p>
        </section>

        <section>
          <h2>מה נעשה באתר</h2>
          <ul>
            <li>מבנה סמנטי עם כותרות, אזורים ותוויות, שמאפשר ניווט נוח בקורא מסך.</li>
            <li>ניווט מלא במקלדת, סימון ברור של הרכיב שבפוקוס, וקישור &quot;דלג לתוכן&quot; בתחילת כל עמוד.</li>
            <li>טקסט חלופי לתמונות.</li>
            <li>תמיכה מלאה בעברית ובכיווניות מימין לשמאל.</li>
            <li>התאמה לטלפונים, לטאבלטים ולמחשבים, ותמיכה בהגדלת תצוגה בדפדפן.</li>
            <li>כיבוד הגדרת &quot;הפחתת תנועה&quot; של מערכת ההפעלה: רוב האנימציות כבויות.</li>
            <li>
              תפריט נגישות (הכפתור בפינת המסך): הגדלת טקסט, ניגודיות גבוהה, גווני אפור, הדגשת קישורים, גופן קריא,
              עצירת אנימציות וסמן עכבר גדול. ההגדרות נשמרות לביקור הבא.
            </li>
          </ul>
        </section>

        <section>
          <h2>מגבלות ידועות</h2>
          <p>
            חלק מהעבודות מוצגות כתמונות שמכילות טקסט (מודעות, שלטים ואריזות), כי זו העבודה עצמה. לכל תמונה כזו יש
            תיאור טקסטואלי. סרטונים שיתווספו לאתר יקבלו כתוביות ככל האפשר. אם נתקלתם ברכיב שאינו נגיש, אשמח לדעת.
          </p>
        </section>

        <section>
          <h2>פניות בנושא נגישות</h2>
          <p>אם נתקלתם בבעיה או שיש לכם הצעה לשיפור, אפשר לפנות אליי ואחזור אליכם בהקדם:</p>
          <dl className="statement-contact">
            <div>
              <dt>רכז נגישות</dt>
              <dd>{c.brand.name}</dd>
            </div>
            {contact.phone && (
              <div>
                <dt>טלפון</dt>
                <dd>
                  <a href={`tel:${tel(contact.phone)}`} className="latin">
                    {contact.phone}
                  </a>
                </dd>
              </div>
            )}
            {real(contact.email) && (
              <div>
                <dt>מייל</dt>
                <dd>
                  <a href={`mailto:${contact.email}`} className="latin">
                    {contact.email}
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <p className="statement-date">ההצהרה עודכנה לאחרונה: {updated}</p>
        </section>
      </main>
      <AboutContact c={c} />
    </PageTransition>
  );
}

export function NotFoundView({ text }: { text: string }) {
  return (
    <main id="main" className="not-found wrap">
      <p className="label latin">404</p>
      <h1>{text}</h1>
      <Link href="/" className="btn btn-secondary">
        חזרה לעבודות
      </Link>
    </main>
  );
}
