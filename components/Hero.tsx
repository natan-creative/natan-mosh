import Image from "next/image";
import { hero, site } from "@/content/site";

export function Hero() {
  return (
    <section className="hero" aria-label="פתיחה">
      <div className="hero-photo">
        {hero.image.kind === "image" && (
          <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="(max-width: 767px) 50vw, 26vw" />
        )}
      </div>

      <p className="hero-note">
        <span className="sr-only">{hero.note.join(" ")}</span>
        {hero.note.map((l, i) => (
          <span key={i} aria-hidden="true" style={{ ["--i" as string]: i }}>
            {l}
          </span>
        ))}
        <svg className="hero-arrow" viewBox="0 0 80 110" aria-hidden="true">
          <path d="M58 4 C 70 36, 52 72, 14 100" />
          <path d="M8 76 L 13 101 L 37 94" />
        </svg>
      </p>

      <div className="hero-text latin">
        <h1 className="hero-headline">
          {hero.headline.map((l, i) => (
            <span key={i} className="hero-line" style={{ ["--i" as string]: i }}>
              <span>{l}</span>
            </span>
          ))}
        </h1>
        <span className="hero-rule" aria-hidden="true" />
        <p className="hero-role">{site.role}</p>
      </div>
    </section>
  );
}
