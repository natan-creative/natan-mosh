import { hero, site } from "@/content/site";
import { ThoughtTicker } from "@/components/ThoughtTicker";

function Letters({ word, start }: { word: string; start: number }) {
  return (
    <span className="hero-word" aria-hidden="true">
      {[...word].map((ch, i) => (
        <span key={i} className="hero-letter" style={{ ["--i" as string]: start + i }}>
          {ch}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const [first, last] = site.name.split(" ");
  const { before, struck, after } = hero.line;
  return (
    <section className="hero wrap" aria-label="פתיחה">
      <ThoughtTicker words={hero.thoughts} />
      <h1 className="hero-name latin" aria-label={site.name}>
        <Letters word={first} start={0} />
        <Letters word={last} start={first.length + 1} />
      </h1>
      <div className="hero-bottom">
        <p className="hero-role latin">{site.role}</p>
        <p className="hero-line">
          {before}{" "}
          {struck && (
            <>
              <s className="struck">{struck}</s>{" "}
            </>
          )}
          {after}
        </p>
      </div>
    </section>
  );
}
