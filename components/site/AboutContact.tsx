import Link from "next/link";
import type { SiteContent } from "@/lib/content/types";
import { ContactForm } from "./ContactForm";
import { Media } from "./Media";
import { Wink } from "./Wink";
import { el, shown } from "@/lib/elements";

const tel = (phone: string) => "+972" + phone.replace(/\D/g, "").replace(/^972/, "").replace(/^0/, "");
const real = (s: string) => s && !s.startsWith("[");

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

/** About + Contact (כל אחד אפשר להסתיר) + הפוטר */
export function AboutContact({ c, showAbout = true, showContact = true, withFooter = true }: { c: SiteContent; showAbout?: boolean; showContact?: boolean; withFooter?: boolean }) {
  const { about, contact } = c;
  return (
    <>
      {(showAbout || showContact) && (
        <section className="ac wrap" data-single={showAbout !== showContact || undefined} aria-label="אודות ויצירת קשר">
          {showAbout && (
            <div id="about" className="ac-about" data-reveal="up">
              <h2 className="section-title latin">{about.title}</h2>
              {shown(c.elements, "about.text") && (
                <div className="ac-body" {...el(c.elements, "about.text")}>
                  {about.body.split("\n").filter(Boolean).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {about.quote && <blockquote className="ac-quote">{about.quote}</blockquote>}
                </div>
              )}
              {about.image && shown(c.elements, "about.image") && (
                <div className="ac-image-wrap" {...el(c.elements, "about.image")}>
                  <Media media={about.image} ratio="1/1" sizes="(max-width: 767px) 100vw, 30vw" className="ac-image" />
                </div>
              )}
            </div>
          )}

          {showContact && shown(c.elements, "contact.block") && (
            <div id="contact" className="ac-contact" data-reveal="up" {...el(c.elements, "contact.block")}>
              <h2 className="section-title latin">{contact.title}</h2>
              {contact.cta && <p className="ac-cta">{contact.cta}</p>}
              <a href={`mailto:${contact.email}`} className="ac-mail latin">
                {contact.email}
              </a>
              <div className="ac-row">
                <div className="ac-social">
                  {contact.instagram && (
                    <a href={contact.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                      <Instagram />
                    </a>
                  )}
                  {contact.linkedin && (
                    <a href={contact.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                      <LinkedIn />
                    </a>
                  )}
                  {contact.phone && (
                    <a href={`tel:${tel(contact.phone)}`} className="ac-phone latin">
                      {contact.phone}
                    </a>
                  )}
                </div>
                <a href={`mailto:${contact.email}`} className="ac-arrow" aria-label="שליחת מייל">
                  ←
                </a>
              </div>
            </div>
          )}
        </section>
      )}

      {withFooter && <SiteFooter c={c} withForm={showContact} />}
    </>
  );
}

export function SiteFooter({ c, withForm = true }: { c: SiteContent; withForm?: boolean }) {
  return (
    <>
      <div className="wrap">
        {withForm && shown(c.elements, "contact.form") && <ContactForm form={c.contact.form} el={el(c.elements, "contact.form")} />}
        <footer className="footer">
          <span className="latin">{c.footer.copyright}</span>
          {c.footer.wink.idle && shown(c.elements, "footer.wink") && (
            <span {...el(c.elements, "footer.wink")}>
              <Wink idle={c.footer.wink.idle} reveal={c.footer.wink.reveal} />
            </span>
          )}
          <nav className="footer-nav" aria-label="ניווט תחתון">
            {c.footer.nav.map((n) => (
              <Link key={n.id} href={n.href} transitionTypes={["nav-back"]}>
                {n.label}
              </Link>
            ))}
          </nav>
        </footer>
      </div>
    </>
  );
}

export { tel, real };
