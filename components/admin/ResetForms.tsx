"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPassword } from "@/app/admin/actions";

// שני שלבים באותו טופס: מספר טלפון ← שולחים קוד ב-SMS ← קוד וסיסמה חדשה
export function ForgotForm({ expired }: { expired?: boolean }) {
  const [state, action, pending] = useActionState(forgotPassword, undefined);

  if (state?.step === "code" && state.phone) {
    return (
      <form action={action} className="ad-login-card">
        <h1>הזינו את הקוד</h1>
        <p className="ad-hint">שלחנו קוד ב-SMS למספר שהזנתם. הקוד תקף לזמן מוגבל.</p>
        <input type="hidden" name="phone" value={state.phone} />
        <label className="ad-label" htmlFor="reset-code">
          קוד מ-SMS
        </label>
        <input id="reset-code" name="code" inputMode="numeric" autoComplete="one-time-code" dir="ltr" required className="ad-input" />
        <label className="ad-label" htmlFor="reset-password">
          סיסמה חדשה
        </label>
        <input id="reset-password" name="password" type="password" autoComplete="new-password" dir="ltr" required minLength={10} className="ad-input" />
        <p className="ad-hint">לפחות 10 תווים. מומלץ לשלב אותיות, מספרים וסימנים.</p>
        <label className="ad-label" htmlFor="reset-again">
          הקלידו שוב
        </label>
        <input id="reset-again" name="again" type="password" autoComplete="new-password" dir="ltr" required minLength={10} className="ad-input" />
        {state.error && (
          <p className="ad-warning" role="alert">
            {state.error}
          </p>
        )}
        <button type="submit" name="intent" value="reset" className="ad-btn ad-btn-primary" disabled={pending}>
          {pending ? "שומר…" : "שמירת הסיסמה"}
        </button>
        <button type="submit" name="intent" value="send" formNoValidate className="ad-btn" disabled={pending}>
          שליחת קוד חדש
        </button>
        <Link href="/admin/forgot" className="ad-link">
          לשנות מספר
        </Link>
      </form>
    );
  }

  return (
    <form action={action} className="ad-login-card">
      <h1>איפוס סיסמה</h1>
      <p className="ad-hint">נשלח קוד ב-SMS למספר הטלפון של המשתמש.</p>
      {expired && (
        <p className="ad-warning" role="alert">
          הקוד פג תוקף. בקשו קוד חדש.
        </p>
      )}
      <label className="ad-label" htmlFor="forgot-phone">
        מספר טלפון
      </label>
      <input id="forgot-phone" name="phone" type="tel" autoComplete="tel" dir="ltr" required className="ad-input" />
      {state?.error && (
        <p className="ad-warning" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" name="intent" value="send" className="ad-btn ad-btn-primary" disabled={pending}>
        {pending ? "שולח…" : "שליחת קוד"}
      </button>
      <Link href="/admin/login" className="ad-link">
        חזרה לכניסה
      </Link>
    </form>
  );
}
