import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublishedContent } from "@/lib/store";
import { ProjectView } from "@/components/site/views";

export async function generateStaticParams() {
  const c = await getPublishedContent();
  return c.work.projects.filter((p) => !p.hidden).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getPublishedContent();
  const w = c.work.projects.find((p) => p.slug === slug && !p.hidden);
  return w
    ? { title: `${w.title} — ${c.brand.name}`, description: w.summary, openGraph: { images: w.cover?.kind === "image" ? [w.cover.src] : undefined } }
    : { title: c.brand.name };
}

// params נקרא בתוך Suspense: עבודות שקיימות בזמן ה-build מוכנות מראש לגמרי,
// ועבודה חדשה (שנוספה מה-Admin אחרי ה-deploy) מקבלת מסגרת ריקה לרגע עד שהיא נבנית.
async function Project({ params }: Pick<PageProps<"/work/[slug]">, "params">) {
  const { slug } = await params;
  return <ProjectView c={await getPublishedContent()} slug={slug} />;
}

export default function WorkPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<main id="main" className="case" aria-busy="true" />}>
      <Project params={params} />
    </Suspense>
  );
}
