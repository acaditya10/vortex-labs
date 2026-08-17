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
                  <li className={`${styles.stage} ${active ? styles.stageActive : ""}`}>
                    <span className={styles.stageNum}>{stage.num}</span>
                    <h3 className={styles.stageName}>{stage.name}</h3>
                    <p className={styles.stageDesc}>{stage.desc}</p>
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
