"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./Process.module.css";

const STAGES = [
  { num: "01", name: "Discover", desc: "Understand your business, audience and challenges." },
  { num: "02", name: "Define", desc: "Turn your ideas into a clear strategy and product plan." },
  { num: "03", name: "Design", desc: "Craft intuitive experiences that are built around your users." },
  { num: "04", name: "Build", desc: "Develop with clean code and modern technology." },
  { num: "05", name: "Launch", desc: "Test, refine and launch your product into the world." },
  { num: "06", name: "Evolve", desc: "Continuously improve and scale as your business grows." },
];

const STAGE_ICONS = [
  /* Discover — magnifying glass */
  <svg key="d" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><circle cx="7" cy="7" r="4.5" /><line x1="10.2" y1="10.2" x2="14" y2="14" /></svg>,
  /* Define — target */
  <svg key="df" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><circle cx="8" cy="8" r="6" /><circle cx="8" cy="8" r="3" /><circle cx="8" cy="8" r="0.8" fill="currentColor" stroke="none" /></svg>,
  /* Design — pen tool */
  <svg key="ds" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 14l2-6 6 2-2 6z" /><line x1="8" y1="6" x2="12" y2="2" /><circle cx="12" cy="2" r="1" /></svg>,
  /* Build — code brackets */
  <svg key="b" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5,4 1,8 5,12" /><polyline points="11,4 15,8 11,12" /><line x1="9" y1="2" x2="7" y2="14" /></svg>,
  /* Launch — rocket */
  <svg key="l" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 1c-2 3-3 6-3 9h6c0-3-1-6-3-9z" /><line x1="5" y1="10" x2="3" y2="13" /><line x1="11" y1="10" x2="13" y2="13" /><circle cx="8" cy="6" r="1" /></svg>,
  /* Evolve — cycle arrows */
  <svg key="e" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8a6 6 0 0 1 10.5-4" /><polyline points="12,1 12.5,4 9.5,4" /><path d="M14 8a6 6 0 0 1-10.5 4" /><polyline points="4,15 3.5,12 6.5,12" /></svg>,
];

export function Process() {
  const trackRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const compute = () => {
      raf = 0;
      if (reduce) {
        setProgress(1);
        return;
      }
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.82 - rect.top;
      setProgress(Math.min(1, Math.max(0, start / rect.height)));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="process" className={styles.section}>
      <div className="shell">
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>OUR PROCESS</p>
            <h2 className={styles.heading}>From idea to impact.</h2>
          </div>
          <p className={styles.support}>
            A clear, collaborative process from the first conversation to launch and beyond.
          </p>
        </div>

        <div
          className={styles.trackWrap}
          style={{ ["--p" as string]: progress } as React.CSSProperties}
        >
          <div className={styles.trackLine} aria-hidden="true">
            <span className={styles.trackFill} />
          </div>
          <ol ref={trackRef} className={styles.track}>
            {STAGES.map((stage, i) => {
              const active = progress >= i / (STAGES.length - 1);
              return (
                <Reveal
                  key={stage.num}
                  variant="up"
                  className={styles.stageWrap}
                  delay={i * 60}
                >
                  <li className={styles.stage}>
                    <span
                      className={`${styles.dot} ${active ? styles.dotActive : ""}`}
                      aria-hidden="true"
                    >
                      <span className={styles.stageIcon} aria-hidden="true">
                        {STAGE_ICONS[i]}
                      </span>
                    </span>
                    <div className={styles.stageBody}>
                      <p className={styles.stageNum}>{stage.num}</p>
                      <h3 className={styles.stageName}>{stage.name}</h3>
                      <p className={styles.stageDesc}>{stage.desc}</p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
