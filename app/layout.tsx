import { Bebas_Neue, Frank_Ruhl_Libre, Gveret_Levin, Heebo, Rubik, Secular_One } from "next/font/google";
import "./globals.css";

const body = Heebo({ variable: "--font-body", subsets: ["hebrew", "latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
// כותרות באנגלית: condensed, חזק
const cond = Bebas_Neue({ variable: "--font-cond", subsets: ["latin"], weight: "400" });
// הפתק בכתב יד
const hand = Gveret_Levin({ variable: "--font-hand", subsets: ["hebrew", "latin"], weight: "400" });
// wordmarks ואפשרויות נוספות בעורך הטיפוגרפיה (נטענים רק אם משתמשים בהם)
const serif = Frank_Ruhl_Libre({ variable: "--font-serif", subsets: ["hebrew", "latin"], weight: ["400", "500", "700"], preload: false });
const heavy = Secular_One({ variable: "--font-heavy", subsets: ["hebrew", "latin"], weight: "400", preload: false });
const rubik = Rubik({ variable: "--font-rubik", subsets: ["hebrew", "latin"], weight: ["400", "500", "600", "700", "800"], preload: false });

// רץ לפני הציור הראשון: מסמן שיש JS, מחיל את הגדרות הנגישות השמורות,
// ומחליט אם להציג את מסך הפתיחה (פעם אחת לסשן, לא כשמבקשים פחות תנועה).
const boot = `(function(){var d=document.documentElement;d.classList.add("js","first-load");try{var a=JSON.parse(localStorage.getItem("nk-a11y")||"{}");if(a.zoom)d.classList.add("a11y-zoom-"+a.zoom);["contrast","mono","links","font","still","cursor"].forEach(function(k){if(a[k])d.classList.add("a11y-"+k)});if(!a.still&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("nk-intro")&&!location.pathname.startsWith("/admin")&&!location.pathname.startsWith("/preview")){d.classList.add("intro");sessionStorage.setItem("nk-intro","1")}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${body.variable} ${cond.variable} ${hand.variable} ${serif.variable} ${heavy.variable} ${rubik.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
