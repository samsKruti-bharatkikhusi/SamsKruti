"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm({ ctaLabel = "Join the journey", segmentBtn = false }: { ctaLabel?: string; segmentBtn?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setMsg({ text: "Please enter your email address.", type: "error" });
      return;
    }
    setSubmitting(true);
    setMsg(null);
    // No backend yet — mock a successful subscribe locally.
    setTimeout(() => {
      setMsg({ text: `Thank you${name ? `, ${name}` : ""}. We'll be in touch.`, type: "success" });
      setName("");
      setEmail("");
      setSubmitting(false);
    }, 500);
  }

  return (
    <form className="newsletter-form" onSubmit={submit} noValidate>
      <div className="newsletter-fields">
        <input
          type="text"
          className="newsletter-input"
          placeholder="Your name (optional)"
          autoComplete="given-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="newsletter-input"
          placeholder="Your email address"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className={`btn-primary newsletter-btn${segmentBtn ? " seg-btn" : ""}`}
        disabled={submitting}
      >
        {submitting ? "Sending…" : ctaLabel}
      </button>
      {msg && <p className={`newsletter-msg ${msg.type}`}>{msg.text}</p>}
    </form>
  );
}
