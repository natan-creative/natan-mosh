import Link from "next/link";

// יציאה מדפי הכניסה והאיפוס חזרה לאתר. בלי זה אין דרך חזרה כשהסטודיו נעול
export function LoginExit() {
  return (
    <Link href="/" className="ad-login-exit">
      ← לאתר
    </Link>
  );
}
