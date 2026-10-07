import Link from "next/link";
import { contact, site } from "@/content/site";
import { ContactForm } from "@/components/ContactForm";

export function Contact() {
  const links = [
    site.linkedin && { href: site.linkedin, label: "LinkedIn" },
    site.instagram && { href: site.instagram, label: "Instagram" },
    site.phone && { href: `tel:${site.phone.replace(/[^\d+]/g, "")}`, label: site.phone },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <h2 id="contact-title" className="contact-head" data-reveal="up">
          {contact.headline.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </h2>
        <div className="contact-grid" data-reveal="up">
          <a href={`mailto:${site.email}`} className="contact-mail latin">
            {site.email}
          </a>
          <ul className="contact-links">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-link latin" target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </div>
      <Footer />
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer wrap">
      <div className="footer-id">
        <span className="latin">{site.name}</span>
        <span className="latin">{site.role}</span>
        <span className="latin">© 2026</span>
      </div>
      <nav className="footer-nav" aria-label="ניווט תחתון">
        <Link href="/#work" transitionTypes={["nav-back"]}>עבודות</Link>
        <Link href="/#about" transitionTypes={["nav-back"]}>אודות</Link>
        <Link href="/#contact" transitionTypes={["nav-back"]}>יצירת קשר</Link>
      </nav>
    </footer>
  );
}
