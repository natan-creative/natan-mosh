import { getPublishedContent } from "@/lib/store";
import { NotFoundView } from "@/components/site/views";

export default async function NotFound() {
  const c = await getPublishedContent();
  return <NotFoundView text={c.footer.notFound} />;
}
