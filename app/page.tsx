import Link from "next/link";
import { about, digital, names, site, works } from "@/content/site";
import { Header } from "@/components/Header";
import { MediaBlock } from "@/components/MediaBlock";
import { Contact } from "@/components/Contact";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero wrap">
          <h1 className="hero-name latin">
            Natan
            <br />
            Kosovsky
          </h1>
          <div className="hero-bottom">
            <p className="hero-line">
              {site.intro.before} <span className="struck">{site.intro.struck}</span>{" "}
              {site.intro.after}
            </p>
            <p className="hero-role latin">{site.role}</p>
          </div>
        </section>

        <section id="work" className="section wrap">
          <div className="section-head">
            <h2 className="section-title">Selected Work</h2>
          </div>
          <div className="works">
            {works.map((w, i) => {
              const text = (
                <div className="work-text">
                  <span className="work-index">{pad(i + 1)}</span>
                  <h3 className="work-title">{w.title}</h3>
                  <p className="work-sub">{w.subtitle}</p>
                  <p className="work-summary">{w.summary}</p>
                  <p className="work-meta">
                    {w.client}
                    {w.year && ` · ${w.year}`}
                  </p>
                  {w.type === "case" && <span className="work-link">לקייס המלא ←</span>}
                </div>
              );
              return w.type === "case" ? (
                <Link key={w.slug} href={`/work/${w.slug}`} className="work">
                  {text}
                  <MediaBlock media={w.cover} />
                </Link>
              ) : (
                <article key={w.slug} className="work is-idea">
                  {text}
                  <MediaBlock media={w.cover} />
                </article>
              );
            })}
          </div>
        </section>

        <section id="digital" className="section wrap">
          <div className="section-head">
            <h2 className="section-title">Digital / Ideas</h2>
            <p className="section-note">לא פוסטים. החשיבה שמאחוריהם.</p>
          </div>
          <div className="digital">
            {digital.map((d, i) => (
              <article key={i} className="d-item">
                <div className="d-client">
                  {d.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={d.logo} alt={d.client} />
                  ) : (
                    d.client
                  )}
                </div>
                <h3 className="d-title">{d.title}</h3>
                <dl className="d-steps">
                  <div>
                    <dt>בעיה</dt>
                    <dd>{d.problem}</dd>
                  </div>
                  <div>
                    <dt>רעיון</dt>
                    <dd>{d.idea}</dd>
                  </div>
                  <div>
                    <dt>ביצוע</dt>
                    <dd>{d.execution}</dd>
                  </div>
                </dl>
                {d.media && <MediaBlock media={d.media} />}
              </article>
            ))}
          </div>
        </section>

        <section id="naming" className="section wrap">
          <div className="section-head">
            <h2 className="section-title">Naming</h2>
          </div>
          <ul className="names">
            {names.map((n, i) => (
              <li key={i} className="name-row">
                <span className="name-word">{n.name}</span>
                <span className="name-what">{n.what}</span>
                <span className="name-note">{n.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="about" className="section wrap">
          <div className="section-head">
            <h2 className="section-title">About</h2>
          </div>
          <div className="about">
            <p className="about-lead">{about.lead}</p>
            <div>
              <div className="about-body">
                {about.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="clients">
                {about.clients.map((c, i) => (
                  <span key={i}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Contact />
    </>
  );
}
