import styles from "./Footer.module.css";

const NAVIGATE = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  "Digital Experiences",
  "Digital Products",
  "Commerce",
  "AI & Automation",
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.word}>VORTEX</p>
            <p className={styles.tag}>
              Digital products. Intelligent systems. Built to perform.
            </p>
            <div className={styles.orbital} aria-hidden="true">
              <span className={styles.orbitalRing} />
              <span className={styles.orbitalRing} />
              <span className={styles.orbitalDot} />
            </div>
          </div>

          <nav className={styles.col} aria-label="Navigate">
            <h4 className={styles.colTitle}>NAVIGATE</h4>
            <ul className={styles.links}>
              {NAVIGATE.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>SERVICES</h4>
            <ul className={styles.links}>
              {SERVICES.map((service) => (
                <li key={service}>
                  <span className={styles.plain}>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>CONNECT</h4>
            <ul className={styles.links}>
              <li>
                <a
                  className={styles.link}
                  href="mailto:hello@vortex.acaditya10.tech"
                >
                  hello@vortex.acaditya10.tech
                </a>
              </li>
              <li>
                <span className={styles.plain}>LinkedIn</span>
              </li>
              <li>
                <span className={styles.plain}>GitHub</span>
              </li>
              <li>
                <span className={styles.plain}>Instagram</span>
              </li>
            </ul>
            <p className={styles.location}>
              Based in India.
              <br />
              Working worldwide.
            </p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 Vortex. All rights reserved.</p>
          <p>Built with intention. Deployed with precision.</p>
        </div>
      </div>
    </footer>
  );
}
