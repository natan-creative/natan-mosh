"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const contactFormEnabled = Boolean(url && key);

type Props = { form: SiteContent["contact"]["form"]; el?: { "data-el": string; style: React.CSSProperties } };

/** טופס קומפקטי: כותרת וטקסט מצד אחד, שורת שדות מהצד השני. נשמר בטבלת contact_messages ב-Supabase. */
export function ContactForm({ form, el }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!contactFormEnabled || !form.enabled) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const data = Object.fromEntries(new FormData(f));
    setStatus("sending");
    try {
      const res = await fetch(`${url}/rest/v1/contact_messages`, {
        method: "POST",
        headers: { apikey: key!, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      f.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="cform" aria-labelledby="cform-title" data-reveal="up" {...el}>
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
            <span>שם</span>
            <input name="name" required maxLength={200} autoComplete="name" />
          </label>
          <label>
            <span>מייל</span>
            <input name="email" type="email" required maxLength={320} autoComplete="email" dir="ltr" />
          </label>
          <label className="cform-message">
            <span>מה על הפרק?</span>
            <textarea name="message" required maxLength={5000} rows={1} />
          </label>
          <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
            {status === "sending" ? "שולח…" : form.button}
          </button>
          {status === "error" && (
            <p className="cform-status is-error" role="alert">
              משהו לא עבד. אפשר לנסות שוב או לשלוח מייל.
            </p>
          )}
        </form>
      )}
    </section>
  );
}
