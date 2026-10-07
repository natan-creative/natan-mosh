"use client";

import { useState } from "react";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const contactFormEnabled = Boolean(url && key);

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  if (!contactFormEnabled) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch(`${url}/rest/v1/contact_messages`, {
        method: "POST",
        headers: {
          apikey: key!,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p className="form-done">ההודעה נשלחה. אחזור אליך בקרוב.</p>;
  }

  return (
    <form className="contact-form" onSubmit={onSubmit} data-reveal="up">
      <label>
        <span>שם</span>
        <input name="name" required maxLength={200} autoComplete="name" />
      </label>
      <label>
        <span>מייל</span>
        <input name="email" type="email" required maxLength={320} autoComplete="email" dir="ltr" />
      </label>
      <label className="full">
        <span>מה על הפרק?</span>
        <textarea name="message" required maxLength={5000} rows={4} />
      </label>
      <div className="full form-actions">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? "שולח..." : "שליחה"}
        </button>
        {status === "error" && <span className="form-error">משהו לא עבד. אפשר לנסות שוב או לשלוח מייל.</span>}
      </div>
    </form>
  );
}
