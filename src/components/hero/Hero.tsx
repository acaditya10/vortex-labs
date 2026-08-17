"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { VortexMark } from "./VortexMark";
import styles from "./Hero.module.css";

const VortexCanvas = dynamic(
  () => import("./vortex/VortexCanvas").then((m) => m.VortexCanvas),
  { ssr: false }
);

const NAV_LINKS = ["Work", "Services", "Process", "About", "Contact"] as const;

export function Hero() {
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      ref={rootRef}
      id="top"
      className={`${styles.hero} ${ready ? styles.ready : ""}`}
    >
      {/* Top Navigation */}
      <header className={`${styles.nav} ${styles.reveal} ${styles.revealNav}`}>
        <div className={styles.navInner}>
          <a className={styles.brand} href="#top" aria-label="VORTEX — home">
            <VortexMark size={22} />
            <span className={styles.brandWord}>VORTEX</span>
          </a>

          <nav className={styles.links} aria-label="Primary">
            <ul>
              {NAV_LINKS.map((label) => (
                <li key={label}>
                  <a
                    className={styles.link}
                    href={`#${label.toLowerCase()}`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            className={styles.navCta}
            href="#contact"
          >
            Start a Project
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </header>

      {/* 3D WebGL Canvas */}
      <div
        className={`${styles.canvas} ${styles.reveal} ${styles.revealFade} ${styles.revealCanvas}`}
      >
        <VortexCanvas hover={hover} />
      </div>

      {/* Main Content Area */}
      <div className={styles.content}>
        {/* Left Column: Brand Statement & CTAs */}
        <div className={styles.col}>
          {/* Live Studio Availability Pill */}
          <div className={`${styles.statusBadge} ${styles.reveal} ${styles.revealEyebrow}`}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.statusText}>ACCEPTING SELECT Q3/Q4 ENGAGEMENTS</span>
          </div>

          <p
            className={`${styles.eyebrow} ${styles.reveal} ${styles.revealEyebrow}`}
          >
            INDEPENDENT DIGITAL PRODUCT STUDIO
          </p>

          <h1 className={styles.headline}>
            <span className={styles.line}>
              <span
                className={`${styles.lineInner} ${styles.reveal} ${styles.revealLine} ${styles.revealLine1}`}
              >
                We build what
              </span>
            </span>
            <span className={styles.line}>
              <span
                className={`${styles.lineInner} ${styles.reveal} ${styles.revealLine} ${styles.revealLine2}`}
              >
                businesses become.
              </span>
            </span>
          </h1>

          <p className={`${styles.lede} ${styles.reveal} ${styles.revealLede}`}>
            Vortex is an independent digital product studio creating premium
            websites, e-commerce experiences and custom software for ambitious
            businesses worldwide.
          </p>

          <div className={`${styles.actions} ${styles.reveal} ${styles.revealActions}`}>
            <a
              className={`${styles.primary} ${hover ? styles.hover : ""}`}
              href="#contact"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <span className={styles.primaryBgGlow} aria-hidden="true" />
              <span className={styles.primaryText}>Start a Project</span>
              <span className={styles.primaryIcon} aria-hidden="true">
                ↗
              </span>
            </a>

            <a
              className={styles.secondary}
              href="#work"
            >
              <span>Explore Our Work</span>
              <span className={styles.secondaryArrow} aria-hidden="true">
                ↓
              </span>
            </a>
          </div>

          <div className={`${styles.meta} ${styles.reveal} ${styles.revealMeta}`}>
            <p>WEB · E-COMMERCE · SOFTWARE · AI · AUTOMATION</p>
            <p>DESIGNED IN DETAIL. ENGINEERED TO PERFORM.</p>
          </div>
        </div>

        {/* Right Column: Architectural HUD Framing & Focal Telemetry */}
        <aside
          className={`${styles.hudCol} ${styles.reveal} ${styles.revealFade} ${styles.revealHud}`}
          aria-label="Interactive visual telemetry"
        >
          <div className={styles.hudCrosshairTL} aria-hidden="true" />
          <div className={styles.hudCrosshairTR} aria-hidden="true" />
          <div className={styles.hudCrosshairBR} aria-hidden="true" />
          
          <div className={styles.hudTopBar}>
            <div className={styles.hudTag}>
              <span className={styles.hudTagNum}>01</span>
              <span className={styles.hudTagLabel}>CORE_SINGULARITY // ENGINE</span>
            </div>
            <div className={styles.hudCoord}>37°46&apos;N · 122°25&apos;W</div>
          </div>

          <div className={styles.hudCenterGuide} aria-hidden="true">
            <div className={styles.hudReticle} />
          </div>

          <div className={styles.hudBottomBar}>
            <div className={styles.hudStatus}>
              <span className={styles.hudPulseDot} />
              <span>FIELD: HYPER-STABLE</span>
            </div>
            <div className={styles.hudSpec}>60 FPS · 3D ACCRETION DISC</div>
          </div>
        </aside>
      </div>

      <div className="grain" aria-hidden="true" />
    </section>
  );
}
