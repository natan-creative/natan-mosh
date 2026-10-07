import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { Loader } from "@/components/Loader";
import { Cursor } from "@/components/Cursor";
import { Reveal } from "@/components/Reveal";
import "./globals.css";

const display = Frank_Ruhl_Libre({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
});

const body = Heebo({
  variable: "--font-body",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: "תיק עבודות: רעיונות, קונספט וקופי.",
};

// רץ לפני הציור הראשון: מסמן שיש JS, ומחליט אם להציג את מסך הפתיחה (פעם אחת לסשן).
const boot = `(function(){var d=document.documentElement;d.classList.add("js","first-load");try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("nk-intro")){d.classList.add("intro");sessionStorage.setItem("nk-intro","1")}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          דלג לתוכן
        </a>
        <Loader />
        <SiteHeader />
        {children}
        <Cursor />
        <Reveal />
      </body>
    </html>
  );
}
