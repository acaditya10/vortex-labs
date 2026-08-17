"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./FinalCta.module.css";

const MiniVortex = dynamic(
  () => import("./MiniVortex").then((m) => m.MiniVortex),
  { ssr: false },
);

const PROJECT_TYPES = ["Website", "E-commerce", "Custom Software", "AI / Automation", "Other"];
const BUDGET_RANGES = ["Under $2k", "$2k – $5k", "$5k – $10k", "$10k+"];

export function FinalCta() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (json.success) {
        setSubmitted(true);
        form.reset();
      }
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.vortex} aria-hidden="true">
          <MiniVortex />
        </div>

        <div className={styles.content}>
          <Reveal variant="fade">
            <p className={styles.label}>START SOMETHING</p>
          </Reveal>
          <Reveal variant="up">
            <h2 className={styles.title}>Have something worth building?</h2>
          </Reveal>
          <Reveal variant="fade" delay={100}>
            <p className={styles.support}>
              Tell us what you&apos;re working on. We&apos;ll figure out what it takes to bring it
              to life.
            </p>
          </Reveal>

          <div className={styles.grid}>
            {/* ── Left: Cal.com embed ── */}
            <Reveal variant="up" delay={180}>
              <div className={styles.card}>
                <p className={styles.cardLabel}>LET&apos;S TALK</p>
                <p className={styles.cardDesc}>
                  Schedule a 30-minute discovery call. Pick a time that works for you.
                </p>
                <div className={styles.calWrap}>
                  <iframe
                    src="https://cal.com/acaditya10/discovery?embed=true&layout=month_view&theme=dark"
                    width="100%"
                    height="500"
                    frameBorder="0"
                    scrolling="no"
                    className={styles.calIframe}
                    title="Schedule a discovery call on Cal.com"
                  />
                </div>
              </div>
            </Reveal>

            {/* ── Right: Web3Forms ── */}
            <Reveal variant="up" delay={260}>
              <div className={styles.card}>
                <p className={styles.cardLabel}>SEND A MESSAGE</p>
                <p className={styles.cardDesc}>
                  Prefer email? Drop us the details and we&apos;ll get back within 24 hours.
                </p>

                {submitted ? (
                  <div className={styles.success}>
                    <span className={styles.successIcon}>✓</span>
                    <p className={styles.successTitle}>Message sent.</p>
                    <p className={styles.successText}>
                      Check your inbox for a confirmation. We&apos;ll be in touch shortly.
                    </p>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
                    <input type="hidden" name="access_key" value="67ae8a1d-ddfb-4493-ad0c-9484248ebac5" />
                    <input type="hidden" name="subject" value="New Project Inquiry — Vortex" />
                    <input type="hidden" name="from_name" value="Vortex Website" />
                    <input type="checkbox" name="botcheck" className={styles.botcheck} tabIndex={-1} autoComplete="off" />

                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="cta-name">Name</label>
                        <input id="cta-name" name="name" type="text" required placeholder="Your name" className={styles.input} />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="cta-email">Email</label>
                        <input id="cta-email" name="email" type="email" required placeholder="you@company.com" className={styles.input} />
                      </div>
                    </div>

                    <div className={styles.fieldRow}>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="cta-type">Project Type</label>
                        <select id="cta-type" name="project_type" required className={styles.input}>
                          <option value="" disabled>Select type</option>
                          {PROJECT_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="cta-budget">Budget Range</label>
                        <select id="cta-budget" name="budget_range" required className={styles.input}>
                          <option value="" disabled>Select range</option>
                          {BUDGET_RANGES.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="cta-message">Message</label>
                      <textarea id="cta-message" name="message" rows={4} placeholder="Tell us about your project..." className={styles.input} />
                    </div>

                    <button type="submit" disabled={submitting} className={styles.submit}>
                      {submitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal variant="fade" delay={340}>
            <p className={styles.meta}>BASED IN INDIA · WORKING WORLDWIDE</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
