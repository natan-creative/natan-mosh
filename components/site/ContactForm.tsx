"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content/types";
import { sendContact } from "@/app/contact/actions";

type Props = { form: SiteContent["contact"]["form"]; el?: { "data-el": string; style: React.CSSProperties } };

/** טופס קומפקטי: כותרת וטקסט מצד אחד, שורת שדות מהצד השני. ההודעה נשלחת למייל פנימי של נתן, והטלפון של הפונה נשמר איתה. */
export function ContactForm({ form, el }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!form.enabled) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    setStatus("sending");
    const res = await sendContact(undefined, new FormData(f));
    if (res?.ok) {
      f.reset();
      setStatus("sent");
    } else {
      setStatus("error");
    }
  }

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
            <input name="phone" type="tel" required maxLength={20} autoComplete="tel" dir="ltr" />
          </label>
          <label className="cform-message">
            <span>{form.messageLabel}</span>
            <textarea name="message" required maxLength={5000} rows={1} />
          </label>
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="cform-hp" />
          <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
            {status === "sending" ? "שולח…" : form.button}
          </button>
          {status === "error" && (
            <p className="cform-status is-error" role="alert">
              {form.errorText}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
