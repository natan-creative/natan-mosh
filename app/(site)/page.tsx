import { getPublishedContent } from "@/lib/store";
import { HomeView } from "@/components/site/views";

export default async function Home() {
  return <HomeView c={await getPublishedContent()} />;
}
