"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm({ mode, resetDone }: { mode: "supabase" | "local" | "unconfigured"; resetDone?: boolean }) {
  const [state, action, pending] = useActionState(login, undefined);

  if (mode === "unconfigured") {
    return (
      <div className="ad-login-card">
        <h1>הסטודיו</h1>
        <p>מערכת הניהול עוד לא מחוברת. צריך להגדיר את Supabase (ראו README).</p>
      </div>
    );
  }

  return (
    <form action={action} className="ad-login-card">
      <h1>הסטודיו</h1>
      <p className="ad-hint">כניסה לעריכת האתר</p>
      {resetDone && <p className="ad-notice">הסיסמה עודכנה. אפשר להתחבר.</p>}
      {mode === "supabase" && (
        <>
          <label className="ad-label" htmlFor="login-email">
            שם משתמש (המייל)
          </label>
          <input id="login-email" name="email" type="email" autoComplete="username" dir="ltr" required className="ad-input" />
        </>
      )}
      <label className="ad-label" htmlFor="login-password">
        סיסמה
      </label>
      <input id="login-password" name="password" type="password" autoComplete="current-password" dir="ltr" required className="ad-input" />
      {state?.error && (
        <p className="ad-warning" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="ad-btn ad-btn-primary" disabled={pending}>
        {pending ? "נכנס…" : "כניסה"}
      </button>
      {mode === "supabase" && (
        <Link href="/admin/forgot" className="ad-link">
          שכחתי סיסמה
        </Link>
      )}
      {mode === "local" && <p className="ad-hint">מצב פיתוח: הסיסמה מוגדרת ב-ADMIN_DEV_PASSWORD.</p>}
    </form>
  );
}
