import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/content/types";
import { el, shown, type Elements } from "@/lib/elements";
import { LazyVideo } from "./LazyVideo";
import { mediaStyle } from "./Media";

const lines = (s: string) => s.split("\n").filter((l) => l.trim());

export function Hero({ hero, brand, els = {} }: { hero: SiteContent["hero"]; brand: SiteContent["brand"]; els?: Elements }) {
  const note = shown(els, "hero.note") ? lines(hero.note) : [];
  return (
    <section className="hero" aria-label="פתיחה">
      <div className="hero-photo" {...el(els, "hero.photo")} hidden={!shown(els, "hero.photo") || undefined}>
        {hero.video ? (
          <LazyVideo media={{ ...hero.video, poster: hero.video.poster || hero.image?.src }} style={mediaStyle(hero.video)} eager />
        ) : hero.image ? (
          <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="(max-width: 767px) 50vw, 26vw" style={{ ...mediaStyle(hero.image), objectPosition: `${hero.image.focal?.x ?? 50}% ${hero.image.focal?.y ?? 0}%` }} />
        ) : null}
      </div>

      {note.length > 0 && (
        <p className="hero-note" {...el(els, "hero.note")}>
          <span className="sr-only">{note.join(" ")}</span>
          {note.map((l, i) => (
            <span key={i} aria-hidden="true" style={{ ["--i" as string]: i }}>
              {l}
            </span>
          ))}
          {shown(els, "hero.arrow") && (
          <svg className="hero-arrow" viewBox="0 0 80 110" aria-hidden="true" {...el(els, "hero.arrow")}>
            <path d="M58 4 C 70 36, 52 72, 14 100" />
            <path d="M8 76 L 13 101 L 37 94" />
          </svg>
          )}
        </p>
      )}

      <div className="hero-text latin">
        <h1 className="hero-headline" {...el(els, "hero.headline")} hidden={!shown(els, "hero.headline") || undefined}>
          {lines(hero.headline).map((l, i) => (
            <span key={i} className="hero-line" style={{ ["--i" as string]: i }}>
              <span>{l}</span>
            </span>
          ))}
        </h1>
        {shown(els, "hero.rule") && <span className="hero-rule" aria-hidden="true" {...el(els, "hero.rule")} />}
        {hero.showRole && shown(els, "hero.role") && (
          <p className="hero-role" {...el(els, "hero.role")}>
            {brand.role}
          </p>
        )}
        {hero.cta.label && hero.cta.href && shown(els, "hero.cta") && (
          <Link href={hero.cta.href} className="btn btn-primary hero-cta" dir="auto" {...el(els, "hero.cta")}>
            {hero.cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
