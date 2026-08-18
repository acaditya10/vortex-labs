"use client";

import { useEffect, useRef, useState } from "react";
import { useContact } from "./ContactContext";
import styles from "./ContactOverlay.module.css";

const PROJECT_TYPES = ["Website", "E-commerce", "Custom Software", "AI / Automation", "Other"];
const BUDGET_RANGES = ["Under $2k", "$2k – $5k", "$5k – $10k", "10k+"];

export function ContactOverlay() {
  const { open, hide } = useContact();
  const [calView, setCalView] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, hide]);

  // Listen for Cal.com booking events via postMessage
  useEffect(() => {
    if (!open || !calView) return;
    function onMessage(e: MessageEvent) {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "cal.event_success") {
          setSubmitted(true);
        }
      } catch { /* ignore */ }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [open, calView]);

  function handleClose() {
    hide();
    // Reset after close animation
    setTimeout(() => {
      setCalView(false);
      setSubmitted(false);
    }, 300);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setSubmitted(true);
        e.currentTarget.reset();
      }
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  }

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={handleClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Contact Vortex"
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close} onClick={handleClose} aria-label="Close">
          ✕
        </button>

        {submitted ? (
          <div className={styles.success}>
            <span className={styles.successIcon}>✓</span>
            <p className={styles.successTitle}>We&apos;ll be in touch.</p>
            <p className={styles.successText}>
              Thanks for reaching out. Expect a response within 24 hours.
            </p>
          </div>
        ) : (
          <div className={`${styles.grid} ${calView ? styles.gridCal : ""}`}>
            {/* Left — Cal.com */}
            <div className={`${styles.left} ${calView ? styles.leftCal : ""}`}>
              {!calView ? (
                <div className={styles.leftPrompt}>
                  <p className={styles.panelLabel}>DISCOVERY CALL</p>
                  <p className={styles.panelDesc}>
                    30 minutes to understand your goals and see if we&apos;re the right fit.
                  </p>
                  <button className={styles.bookBtn} onClick={() => setCalView(true)}>
                    Book a Discovery Call <span aria-hidden="true">↗</span>
                  </button>
                </div>
              ) : (
                <div className={styles.calWrap}>
                  <iframe
                    src="https://cal.com/acaditya10/discovery?embed=true&layout=month_view&theme=dark"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="yes"
                    loading="lazy"
                    className={styles.calIframe}
                    title="Schedule a discovery call on Cal.com"
                    allow="payment"
                  />
                </div>
              )}
            </div>

            {/* Right — Form */}
            <div className={`${styles.right} ${calView ? styles.rightHidden : ""}`}>
              <div className={styles.rightInner}>
                <p className={styles.panelLabel}>SEND A MESSAGE</p>
                <p className={styles.panelDesc}>
                  Drop us the details and we&apos;ll get back within 24 hours.
                </p>
                <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
                  <input type="hidden" name="access_key" value="67ae8a1d-ddfb-4493-ad0c-9484248ebac5" />
                  <input type="hidden" name="subject" value="New Project Inquiry — Vortex" />
                  <input type="hidden" name="from_name" value="Vortex Website" />
                  <input type="checkbox" name="botcheck" className={styles.botcheck} tabIndex={-1} autoComplete="off" />

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="ov-name">Name</label>
                    <input id="ov-name" name="name" type="text" required placeholder="Your name" className={styles.input} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="ov-email">Email</label>
                    <input id="ov-email" name="email" type="email" required placeholder="you@company.com" className={styles.input} />
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="ov-type">Project Type</label>
                      <select id="ov-type" name="project_type" required className={styles.input}>
                        <option value="" disabled>Select type</option>
                        {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="ov-budget">Budget Range</label>
                      <select id="ov-budget" name="budget_range" required className={styles.input}>
                        <option value="" disabled>Select range</option>
                        {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="ov-message">Message</label>
                    <textarea id="ov-message" name="message" rows={3} placeholder="Tell us about your project..." className={styles.input} />
                  </div>
                  <button type="submit" disabled={submitting} className={styles.submit}>
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
