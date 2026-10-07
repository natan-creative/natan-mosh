import Link from "next/link";
import { winks } from "@/content/site";

export default function NotFound() {
  return (
    <main id="main" className="not-found wrap">
      <p className="label latin">404</p>
      <h1>{winks.notFound}</h1>
      <Link href="/" className="btn btn-secondary">
        חזרה לעבודות
      </Link>
    </main>
  );
}
