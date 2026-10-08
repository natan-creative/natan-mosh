import type { SiteContent } from "@/lib/content/types";
import { A11yMenu } from "./A11yMenu";
import { Cursor } from "./Cursor";
import { Loader } from "./Loader";
import { Reveal } from "./Reveal";
import { SiteHeader } from "./SiteHeader";
import { ThemeStyle } from "./ThemeStyle";
import { WhatsApp } from "./WhatsApp";
import { el, shown } from "@/lib/elements";

/** כל מה שעוטף את העמודים: צבעים וטיפוגרפיה, header, כפתורים צפים */
export function SiteChrome({ c, children, watch }: { c: SiteContent; children: React.ReactNode; watch?: string }) {
  return (
    <>
      <ThemeStyle c={c} />
      <a href="#main" className="skip-link">
        דלג לתוכן
      </a>
      <Loader name={c.brand.name} />
      <SiteHeader brand={c.brand} nav={c.header.nav} />
      {children}
      <Cursor />
      <Reveal watch={watch} />
      <aside aria-label="פעולות מהירות">
        {shown(c.elements, "fab.whatsapp") && <WhatsApp whatsapp={c.contact.whatsapp} el={el(c.elements, "fab.whatsapp")} />}
        {shown(c.elements, "fab.a11y") && <A11yMenu el={el(c.elements, "fab.a11y")} />}
      </aside>
    </>
  );
}
