import type { Metadata } from "next";
import { Bebas_Neue, Frank_Ruhl_Libre, Gveret_Levin, Heebo, Secular_One } from "next/font/google";
import { site } from "@/content/site";
import { SiteHeader } from "@/components/SiteHeader";
import { Loader } from "@/components/Loader";
import { Cursor } from "@/components/Cursor";
import { Reveal } from "@/components/Reveal";
import { WhatsApp } from "@/components/WhatsApp";
import { A11yMenu } from "@/components/A11yMenu";
import "./globals.css";

// כותרות באנגלית: condensed, חזק
const cond = Bebas_Neue({ variable: "--font-cond", subsets: ["latin"], weight: "400" });
// הפתק בכתב יד
const hand = Gveret_Levin({ variable: "--font-hand", subsets: ["hebrew", "latin"], weight: "400" });
// wordmarks באזור ה-Naming
const serif = Frank_Ruhl_Libre({ variable: "--font-serif", subsets: ["hebrew", "latin"], weight: ["400", "500"] });
const heavy = Secular_One({ variable: "--font-heavy", subsets: ["hebrew", "latin"], weight: "400" });

const body = Heebo({
  variable: "--font-body",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: "תיק עבודות: רעיונות, קונספט וקופי.",
};

// רץ לפני הציור הראשון: מסמן שיש JS, מחיל את הגדרות הנגישות השמורות,
// ומחליט אם להציג את מסך הפתיחה (פעם אחת לסשן, לא כשמבקשים פחות תנועה).
const boot = `(function(){var d=document.documentElement;d.classList.add("js","first-load");try{var a=JSON.parse(localStorage.getItem("nk-a11y")||"{}");if(a.zoom)d.classList.add("a11y-zoom-"+a.zoom);["contrast","mono","links","font","still","cursor"].forEach(function(k){if(a[k])d.classList.add("a11y-"+k)});if(!a.still&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("nk-intro")){d.classList.add("intro");sessionStorage.setItem("nk-intro","1")}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${body.variable} ${cond.variable} ${hand.variable} ${serif.variable} ${heavy.variable}`}
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
        <aside aria-label="פעולות מהירות">
          <WhatsApp />
          <A11yMenu />
        </aside>
      </body>
    </html>
  );
}
