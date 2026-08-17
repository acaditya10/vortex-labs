"use client";

import { useEffect, useState } from "react";
import { VortexMark } from "../hero/VortexMark";
import { useContact } from "./ContactContext";
import styles from "./Navbar.module.css";

const NAV_LINKS = ["Work", "Services", "Process", "About", "Contact"] as const;

export function Navbar() {
  const { show } = useContact();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
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

        <button
          className={styles.navCta}
          onClick={show}
          type="button"
        >
          Start a Project
          <span className={styles.arrow} aria-hidden="true">↗</span>
        </button>
      </div>
    </header>
  );
}
