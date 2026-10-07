import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site, works } from "@/content/site";
import { Header } from "@/components/Header";
import { MediaBlock } from "@/components/MediaBlock";
import { Contact } from "@/components/Contact";

const cases = works.filter((w) => w.type === "case");

export function generateStaticParams() {
  return cases.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const w = cases.find((c) => c.slug === slug);
  return { title: w ? `${w.title} — ${site.name}` : site.name, description: w?.summary };
}

export default async function CasePage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const i = cases.findIndex((c) => c.slug === slug);
  if (i === -1) notFound();
  const w = cases[i];
  const next = cases[(i + 1) % cases.length];

  const rows: [string, string | undefined][] = [
    ["הבריף", w.brief],
    ["התובנה", w.insight],
  ];

  return (
    <>
      <Header />
      <main className="wrap">
        <div className="case-head">
          <Link href="/#work" className="back">→ כל העבודות</Link>
          <h1 className="case-title">{w.title}</h1>
          <p className="case-sub">{w.subtitle}</p>
          <dl className="case-meta">
            <div>
              <dt>לקוח</dt>
              <dd>{w.client}</dd>
            </div>
            {w.role && (
              <div>
                <dt>תפקיד</dt>
                <dd>{w.role}</dd>
              </div>
            )}
            {w.year && (
              <div>
                <dt>שנה</dt>
                <dd>{w.year}</dd>
              </div>
            )}
          </dl>
        </div>

        <MediaBlock media={w.cover} />

        <div className="case-body">
          {rows.map(
            ([label, text]) =>
              text && (
                <div key={label} className="case-row">
                  <h2 className="case-label">{label}</h2>
                  <p className="case-text">{text}</p>
                </div>
              ),
          )}

          {w.idea && (
            <div className="case-row">
              <h2 className="case-label">הרעיון</h2>
              <p className="case-idea">{w.idea}</p>
            </div>
          )}

          {w.execution && (
            <div className="case-row">
              <h2 className="case-label">הביצוע</h2>
              <p className="case-text">{w.execution}</p>
            </div>
          )}

          {w.gallery && w.gallery.length > 0 && (
            <div className="gallery">
              {w.gallery.map((m, j) => (
                <MediaBlock
                  key={j}
                  media={m}
                  className={m.kind === "placeholder" && m.ratio !== "wide" ? "" : "full"}
                />
              ))}
            </div>
          )}

          {w.results && w.results.length > 0 && (
            <div className="case-row">
              <h2 className="case-label">תוצאות</h2>
              <ul className="results">
                {w.results.map((r, j) => (
                  <li key={j}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {next && next.slug !== w.slug && (
          <Link href={`/work/${next.slug}`} className="next-work">
            <span>הקייס הבא</span>
            <strong>{next.title}</strong>
          </Link>
        )}
      </main>
      <Contact />
    </>
  );
}
