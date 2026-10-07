import Link from "next/link";
import { site } from "@/content/site";

export function Header() {
  return (
    <header className="header">
      <div className="wrap">
        <Link href="/" className="header-name latin">
          {site.name}
        </Link>
        <nav className="nav">
          <Link href="/#work">עבודות</Link>
          <Link href="/#digital" className="nav-optional">דיגיטל</Link>
          <Link href="/#naming" className="nav-optional">שמות</Link>
          <Link href="/#about" className="nav-optional">עליי</Link>
          <Link href="/#contact">צור קשר</Link>
        </nav>
      </div>
    </header>
  );
}
