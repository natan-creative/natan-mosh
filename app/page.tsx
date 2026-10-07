import { PageTransition } from "@/components/PageTransition";
import { Hero } from "@/components/Hero";
import { SectionHead } from "@/components/SectionHead";
import { WorkGrid } from "@/components/WorkGrid";
import { DigitalGrid } from "@/components/DigitalGrid";
import { NamingRow } from "@/components/NamingRow";
import { AboutContact } from "@/components/AboutContact";

export default function Home() {
  return (
    <PageTransition>
      <main id="main">
        <Hero />

        <section id="work" className="section wrap" aria-label="Selected Work">
          <SectionHead title="SELECTED WORK" action={{ href: "/work", label: "לכל העבודות" }} />
          <WorkGrid />
        </section>

        <section id="digital" className="section wrap" aria-label="Digital / Ideas">
          <SectionHead title="DIGITAL / IDEAS" action={{ href: "/work#digital", label: "לכל העבודות" }} />
          <DigitalGrid limit={10} />
        </section>

        <section id="naming" className="section wrap" aria-label="Naming">
          <NamingRow />
        </section>
      </main>
      <AboutContact />
    </PageTransition>
  );
}
