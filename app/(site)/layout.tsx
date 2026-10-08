import type { Metadata } from "next";
import Script from "next/script";
import { getPublishedContent } from "@/lib/store";
import { SiteChrome } from "@/components/site/SiteChrome";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPublishedContent();
  const s = c.settings;
  return {
    title: s.siteTitle,
    description: s.metaDescription,
    ...(s.canonical ? { metadataBase: new URL(s.canonical), alternates: { canonical: "/" } } : {}),
    openGraph: { title: s.siteTitle, description: s.metaDescription, images: s.ogImage ? [s.ogImage.src] : undefined, locale: "he_IL", type: "website" },
    icons: s.favicon ? { icon: s.favicon.src, apple: s.favicon.src } : undefined,
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const c = await getPublishedContent();
  const ga = /^G-[A-Z0-9]+$/.test(c.settings.gaId) ? c.settings.gaId : "";
  return (
    <SiteChrome c={c}>
      {children}
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga}');`}</Script>
        </>
      )}
    </SiteChrome>
  );
}
