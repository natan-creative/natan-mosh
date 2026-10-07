import { site } from "@/content/site";
import { ContactForm } from "@/components/ContactForm";

export function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <p className="section-title" style={{ marginBottom: 24 }}>Contact</p>
        <a href={`mailto:${site.email}`} className="contact-big latin">
          {site.email}
        </a>
        <div className="contact-links">
          {site.phone && <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="latin">{site.phone}</a>}
          {site.linkedin && <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          {site.instagram && <a href={site.instagram} target="_blank" rel="noreferrer">Instagram</a>}
        </div>
        <ContactForm />
        <footer className="footer">
          <span className="latin">{site.name}</span>
          <span className="latin">© 2026</span>
        </footer>
      </div>
    </section>
  );
}
