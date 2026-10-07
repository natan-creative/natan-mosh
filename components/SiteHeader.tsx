"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header" data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <div className="wrap header-row">
        <Link href="/" className="brand" aria-label={`${site.name} — דף הבית`} transitionTypes={["nav-back"]} onClick={() => setOpen(false)}>
          <span className="brand-full latin">NATAN KOSOVSKY</span>
          <span className="brand-short latin" aria-hidden="true">
            <b>{site.short}</b> / Natan Kosovsky
          </span>
        </Link>

        <nav className="nav" aria-label="ניווט ראשי">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="nav-link" transitionTypes={["nav-back"]}>
              {n.label}
            </Link>
          ))}
        </nav>

        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "סגירה" : "תפריט"}
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav className="wrap" aria-label="ניווט">
          {nav.map((n, i) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} style={{ ["--i" as string]: i }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
