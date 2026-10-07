import { about, winks, works } from "@/content/site";
import { PageTransition } from "@/components/PageTransition";
import { Hero } from "@/components/Hero";
import { SectionHead } from "@/components/SectionHead";
import { Wink } from "@/components/Wink";
import { WorkGrid } from "@/components/WorkGrid";
import { DigitalGrid } from "@/components/DigitalGrid";
import { NamingStage } from "@/components/NamingStage";
import { WordReveal } from "@/components/WordReveal";
import { Contact } from "@/components/Contact";

export default function Home() {
  return (
    <PageTransition>
      <main id="main">
        <Hero />

        <section id="work" className="section wrap" aria-label="Selected Work">
          <SectionHead index="01" title="SELECTED WORK">
            <Wink idle={winks.works.idle} reveal={winks.works.reveal} />
          </SectionHead>
          <WorkGrid />
          <p className="section-count latin" aria-hidden="true">
            {String(works.length).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
          </p>
        </section>

        <section id="digital" className="section wrap" aria-label="Digital / Ideas">
          <SectionHead index="02" title="DIGITAL / IDEAS">
            <p className="section-note">לא פוסטים. החשיבה שמאחוריהם.</p>
          </SectionHead>
          <DigitalGrid />
        </section>

        <section id="naming" className="section wrap" aria-label="Naming">
          <SectionHead index="03" title="NAMING">
            <p className="section-note">שם טוב עושה חצי מהעבודה.</p>
          </SectionHead>
          <NamingStage />
        </section>

        <section id="about" className="section wrap" aria-label="אודות">
          <SectionHead index="04" title="ABOUT" />
          <div className="about">
            <WordReveal text={about.statement} />
            <div className="about-side" data-reveal="up">
              <h3 className="about-title">{about.title}</h3>
              <div className="about-body">
                {about.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <ul className="clients" aria-label="לקוחות">
                {about.clients.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Contact />
    </PageTransition>
  );
}
