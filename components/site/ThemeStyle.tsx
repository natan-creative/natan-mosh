import { buildThemeCss } from "@/lib/theme";
import type { SiteContent } from "@/lib/content/types";

export function ThemeStyle({ c }: { c: Pick<SiteContent, "theme" | "motion" | "header"> }) {
  return <style dangerouslySetInnerHTML={{ __html: buildThemeCss(c) }} />;
}
