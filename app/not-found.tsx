import { NotFoundView } from "@/components/site/views";
import { defaultContent } from "@/lib/content/defaults";

export default function NotFound() {
  return <NotFoundView text={defaultContent.footer.notFound} />;
}
