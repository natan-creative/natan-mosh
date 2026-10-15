"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePassword } from "@/app/admin/actions";

/** שינוי סיסמה: הנוכחית, והחדשה פעמיים */
export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="ad-pw-form">
      <label className="ad-field">
        <span className="ad-label">הסיסמה הנוכחית</span>
        <input name="current" type="password" autoComplete="current-password" dir="ltr" required className="ad-input" />
      </label>
      <label className="ad-field">
        <span className="ad-label">סיסמה חדשה</span>
        <input name="next" type="password" autoComplete="new-password" dir="ltr" required minLength={10} className="ad-input" />
        <span className="ad-hint">לפחות 10 תווים</span>
      </label>
      <label className="ad-field">
        <span className="ad-label">הקלדה חוזרת של הסיסמה החדשה</span>
        <input name="again" type="password" autoComplete="new-password" dir="ltr" required minLength={10} className="ad-input" />
      </label>
      {state?.error && (
        <p className="ad-warning" role="alert">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="ad-notice" role="status">
          הסיסמה עודכנה.
        </p>
      )}
      <button type="submit" className="ad-btn ad-btn-primary" disabled={pending}>
        {pending ? "שומר…" : "שינוי סיסמה"}
      </button>
    </form>
  );
}
