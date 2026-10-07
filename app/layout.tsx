import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const display = Frank_Ruhl_Libre({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700", "900"],
});

const body = Heebo({
  variable: "--font-body",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: "תיק עבודות: רעיונות, קונספט וקופי.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
