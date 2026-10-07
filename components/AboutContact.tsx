import Link from "next/link";
import { about, site, winks } from "@/content/site";
import { ContactForm } from "@/components/ContactForm";
import { Wink } from "@/components/Wink";

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M8 10.5V16M8 7.6v.1M11.5 16v-3.2c0-1.6 1-2.4 2.1-2.4s1.9.8 1.9 2.4V16M11.5 10.5V16" />
    </svg>
  );
}

export function AboutContact() {
  return (
    <>
      <section className="ac wrap" aria-label="אודות ויצירת קשר">
        <div id="about" className="ac-about" data-reveal="up">
          <h2 className="section-title latin">ABOUT</h2>
          <div className="ac-body">
            {about.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div id="contact" className="ac-contact" data-reveal="up">
          <h2 className="section-title latin">CONTACT</h2>
          <a href={`mailto:${site.email}`} className="ac-mail latin">
            {site.email}
          </a>
          <div className="ac-row">
            <div className="ac-social">
              {site.instagram && (
                <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                  <Instagram />
                </a>
              )}
              {site.linkedin && (
                <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <LinkedIn />
                </a>
              )}
              {site.phone && (
                <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="ac-phone latin">
                  {site.phone}
                </a>
              )}
            </div>
            <a href={`mailto:${site.email}`} className="ac-arrow" aria-label="שליחת מייל">
              ←
            </a>
          </div>
        </div>
      </section>

      <div className="wrap">
        <ContactForm />
        <footer className="footer">
          <span className="latin">© 2026 {site.name}</span>
          <Wink idle={winks.footer.idle} reveal={winks.footer.reveal} />
          <nav className="footer-nav" aria-label="ניווט תחתון">
            <Link href="/#work" transitionTypes={["nav-back"]}>עבודות</Link>
            <Link href="/#about" transitionTypes={["nav-back"]}>אודות</Link>
            <Link href="/#contact" transitionTypes={["nav-back"]}>צור קשר</Link>
          </nav>
        </footer>
      </div>
    </>
  );
}
