"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { sendContact } from "@/app/contact/actions";
import { MOBILE_HINT, MOBILE_PATTERN } from "@/lib/phone";

type Props = { form: SiteContent["contact"]["form"]; el?: { "data-el": string; style: React.CSSProperties } };

/** טופס קומפקטי: כותרת וטקסט מצד אחד, שורת שדות מהצד השני. ההודעה נשלחת במייל לנתן. */
export function ContactForm({ form, el }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  // שגיאת שדה (מוצגת כמו שהיא) או קוד כישלון שליחה (מוצג בטקסט מהניהול, והקוד נשמר ב-data-code לאבחון)
  const [error, setError] = useState<{ text: string; code?: string } | null>(null);

  if (!form.enabled) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    setStatus("sending");
    setError(null);
    try {
      const res = await sendContact(undefined, new FormData(f));
      if (res?.ok) {
        f.reset();
        setStatus("sent");
        return;
      }
      setError({ text: res?.code === "invalid" && res.error ? res.error : form.errorText, code: res?.code });
    } catch {
      setError({ text: form.errorText, code: "network" });
    }
    setStatus("error");
  }

  // הודעה בעברית לשדה הטלפון, במקום הודעת הדפדפן הכללית
  const phoneValidity = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.setCustomValidity("");
    if (!input.validity.valid) input.setCustomValidity(`${MOBILE_HINT}, בלי מקפים.`);
  };

  return (
    <section className="cform" aria-labelledby="cform-title" data-reveal="up" suppressHydrationWarning {...el}>
      <div className="cform-head">
        <h2 id="cform-title">{form.title}</h2>
        {form.text && <p>{form.text}</p>}
      </div>
      {status === "sent" ? (
        <p className="cform-status" role="status">
          {form.success}
        </p>
      ) : (
        <form className="cform-fields" onSubmit={onSubmit}>
          <label>
            <span>{form.nameLabel}</span>
            <input name="name" required maxLength={200} autoComplete="name" />
          </label>
          <label>
            <span>{form.phoneLabel}</span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              required
              minLength={10}
              maxLength={10}
              pattern={MOBILE_PATTERN}
              title={MOBILE_HINT}
              placeholder="05XXXXXXXX"
              autoComplete="tel-national"
              dir="ltr"
              onInvalid={phoneValidity}
              onInput={phoneValidity}
            />
          </label>
          <label className="cform-message">
            <span>{form.messageLabel}</span>
            <textarea name="message" required maxLength={5000} rows={1} />
          </label>
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cform-hp" />
          <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
            {status === "sending" ? "שולח…" : form.button}
          </button>
          {status === "error" && error && (
            <p className="cform-status is-error" role="alert" data-code={error.code}>
              {error.text}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
