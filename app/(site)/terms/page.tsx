import type { Metadata } from "next";
import { getPublishedContent } from "@/lib/store";
import { LegalView } from "@/components/site/views";

export const metadata: Metadata = { title: "תקנון ותנאי שימוש" };

export default async function Page() {
  return <LegalView c={await getPublishedContent()} id="terms" />;
}
