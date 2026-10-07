import type { Metadata } from "next";
import { getPublishedContent } from "@/lib/store";
import { WorkIndexView } from "@/components/site/views";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPublishedContent();
  return { title: `עבודות — ${c.brand.name}` };
}

export default async function WorkIndex() {
  return <WorkIndexView c={await getPublishedContent()} />;
}
