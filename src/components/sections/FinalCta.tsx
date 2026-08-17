"use client";

import dynamic from "next/dynamic";
import { Reveal } from "@/components/ui/Reveal";
import styles from "./FinalCta.module.css";

const MiniVortex = dynamic(
  () => import("./MiniVortex").then((m) => m.MiniVortex),
  { ssr: false },
);

export function FinalCta() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.panel}>
        <div className={styles.vortex} aria-hidden="true">
          <MiniVortex />
        </div>

        <div className={styles.inner}>
          <Reveal variant="fade">
            <p className={styles.label}>START SOMETHING</p>
          </Reveal>
          <Reveal variant="up">
            <h2 className={styles.title}>Have something worth building?</h2>
          </Reveal>
          <Reveal variant="fade" delay={120}>
            <p className={styles.support}>
              Tell us what you&apos;re working on. We&apos;ll figure out what it takes to bring it
              to life.
            </p>
          </Reveal>
          <Reveal variant="up" delay={220}>
            <div className={styles.actions}>
              <a className={styles.primary} href="mailto:hello@vortex.acaditya10.tech">
                Start a Project <span aria-hidden="true">↗</span>
              </a>
              <a
                className={styles.secondary}
                href="mailto:hello@vortex.acaditya10.tech"
              >
                hello@vortex.acaditya10.tech
              </a>
            </div>
          </Reveal>
          <Reveal variant="fade" delay={320}>
            <p className={styles.meta}>BASED IN INDIA · WORKING WORLDWIDE</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
