import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { site, works } from "@/content/site";
import { PageTransition } from "@/components/PageTransition";
import { Media } from "@/components/Media";
import { Parallax } from "@/components/Parallax";
import { AboutContact } from "@/components/AboutContact";
import { pad } from "@/components/WorkGrid";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = works.find((c) => c.slug === slug);
  return { title: w ? `${w.title} — ${site.name}` : site.name, description: w?.summary };
}

function Chapter({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="chapter" data-reveal="up">
      <h2 className="label latin">{label}</h2>
      <div className="chapter-body">{children}</div>
    </section>
  );
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const i = works.findIndex((c) => c.slug === slug);
  if (i === -1) notFound();
  const w = works[i];
  const next = works[(i + 1) % works.length];
  const isCase = w.type === "case";

  return (
    <PageTransition>
      <main id="main" className="case" style={{ ["--accent" as string]: w.accent }}>
        <header className="case-hero wrap">
          <Link href="/#work" className="back text-link" transitionTypes={["nav-back"]}>
            → כל העבודות
          </Link>
          <p className="case-num latin layer" style={{ ["--l" as string]: 0 }}>
            {pad(i + 1)} <span>/ {w.category}</span>
          </p>
          <h1 className="case-title layer" style={{ ["--l" as string]: 1 }}>
            {w.title}
          </h1>
          <p className="case-sub layer" style={{ ["--l" as string]: 2 }}>
            {w.subtitle}
          </p>
        </header>

        <div className="case-visual wrap">
          <ViewTransition name={`work-${w.slug}`} share="morph" default="none">
            <div className="case-cover">
              <Parallax>
                <Media media={w.cover} ratio={isCase ? "16/9" : w.ratio === "1/1" ? "4/3" : "16/9"} sizes="100vw" priority />
              </Parallax>
            </div>
          </ViewTransition>
        </div>

        <div className="wrap">
          <dl className="case-meta" data-reveal="slide">
            <div>
              <dt>לקוח</dt>
              <dd>{w.client}</dd>
            </div>
            {w.role && (
              <div>
                <dt>תפקיד</dt>
                <dd className="latin">{w.role}</dd>
              </div>
            )}
            {w.year && (
              <div>
                <dt>שנה</dt>
                <dd>{w.year}</dd>
              </div>
            )}
            <div>
              <dt>סוג</dt>
              <dd className="latin">{w.category}</dd>
            </div>
          </dl>

          <div className="chapters">
            {isCase ? (
              <>
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
                {w.idea && (
                  <Chapter label="THE IDEA">
                    <p className="big-idea">{w.idea}</p>
                    {w.ideaMore && <p className="body-text">{w.ideaMore}</p>}
                  </Chapter>
                )}
                {w.execution && (
                  <Chapter label="THE EXECUTION">
                    <p className="lead">{w.execution}</p>
                  </Chapter>
                )}
              </>
            ) : (
              <Chapter label="THE IDEA">
                {w.idea && <p className="big-idea">{w.idea}</p>}
                <p className="body-text">{w.summary}</p>
              </Chapter>
            )}
          </div>

          {w.gallery && w.gallery.length > 0 && (
            <div className="gallery">
              {w.gallery.map((g, j) => (
                <figure key={j} className={`gallery-item is-${g.span ?? "full"}`} data-reveal="scale">
                  <Media media={g.media} ratio={g.ratio} sizes={g.span === "half" ? "(max-width: 767px) 100vw, 50vw" : "100vw"} />
                  {"caption" in g.media && g.media.caption && <figcaption>{g.media.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}

          {isCase && (w.result || w.stats) && (
            <div className="chapters">
              <Chapter label="THE RESULT">
                {w.result && <p className="lead">{w.result}</p>}
                {w.stats && (
                  <ul className="stats">
                    {w.stats.map((s, j) => (
                      <li key={j}>{s}</li>
                    ))}
                  </ul>
                )}
              </Chapter>
            </div>
          )}

          {next.slug !== w.slug && (
            <Link href={`/work/${next.slug}`} className="next-work" transitionTypes={["nav-forward"]} data-cursor="NEXT" style={{ ["--accent" as string]: next.accent }}>
              <span className="label latin">NEXT IDEA · {pad(works.indexOf(next) + 1)}</span>
              <strong>{next.title}</strong>
              <span className="next-sub">{next.subtitle}</span>
            </Link>
          )}
        </div>
      </main>
      <AboutContact />
    </PageTransition>
  );
}
