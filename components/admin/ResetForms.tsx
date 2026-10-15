"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPassword, setNewPassword } from "@/app/admin/actions";

export function ForgotForm({ expired }: { expired?: boolean }) {
  const [state, action, pending] = useActionState(forgotPassword, undefined);
  if (state?.sent) {
    return (
      <div className="ad-login-card">
        <h1>בדקו את המייל</h1>
        <p className="ad-hint">אם המייל רשום במערכת, נשלח אליו קישור לאיפוס סיסמה. הקישור תקף לזמן מוגבל.</p>
        <Link href="/admin/login" className="ad-link">
          חזרה לכניסה
        </Link>
      </div>
    );
  }
  return (
    <form action={action} className="ad-login-card">
      <h1>איפוס סיסמה</h1>
      <p className="ad-hint">נשלח קישור לאיפוס למייל של המשתמש.</p>
      {expired && (
        <p className="ad-warning" role="alert">
          הקישור פג תוקף. בקשו קישור חדש.
        </p>
      )}
      <label className="ad-label" htmlFor="forgot-email">
        שם משתמש (המייל)
      </label>
      <input id="forgot-email" name="email" type="email" autoComplete="username" dir="ltr" required className="ad-input" />
      {state?.error && (
        <p className="ad-warning" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="ad-btn ad-btn-primary" disabled={pending}>
        {pending ? "שולח…" : "שליחת קישור"}
      </button>
      <Link href="/admin/login" className="ad-link">
        חזרה לכניסה
      </Link>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(setNewPassword, undefined);
  return (
    <form action={action} className="ad-login-card">
      <h1>סיסמה חדשה</h1>
      <p className="ad-hint">לפחות 10 תווים. מומלץ לשלב אותיות, מספרים וסימנים.</p>
      <label className="ad-label" htmlFor="new-password">
        סיסמה חדשה
      </label>
      <input id="new-password" name="password" type="password" autoComplete="new-password" dir="ltr" required minLength={10} className="ad-input" />
      <label className="ad-label" htmlFor="new-again">
        הקלידו שוב
      </label>
      <input id="new-again" name="again" type="password" autoComplete="new-password" dir="ltr" required minLength={10} className="ad-input" />
      {state?.error && (
        <p className="ad-warning" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="ad-btn ad-btn-primary" disabled={pending}>
        {pending ? "שומר…" : "שמירת הסיסמה"}
      </button>
    </form>
  );
}
