import type { Metadata } from "next";
import { site } from "@/content/site";
import { PageTransition } from "@/components/PageTransition";
import { SectionHead } from "@/components/SectionHead";
import { WorkGrid } from "@/components/WorkGrid";
import { DigitalGrid } from "@/components/DigitalGrid";
import { AboutContact } from "@/components/AboutContact";

export const metadata: Metadata = { title: `עבודות — ${site.name}` };

export default function WorkIndex() {
  return (
    <PageTransition>
      <main id="main">
        <header className="page-head wrap">
          <h1 className="page-title latin">ALL WORK</h1>
          <p className="page-sub">רעיונות, קמפיינים, ומה שקרה בדרך.</p>
        </header>
        <section className="section wrap" aria-label="Selected Work">
          <SectionHead title="SELECTED WORK" />
          <WorkGrid />
        </section>
        <section id="digital" className="section wrap" aria-label="Digital / Ideas">
          <SectionHead title="DIGITAL / IDEAS" />
          <DigitalGrid />
        </section>
      </main>
      <AboutContact />
    </PageTransition>
  );
}
