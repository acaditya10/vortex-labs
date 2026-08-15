import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import styles from "./Capabilities.module.css";

const SERVICES = [
  {
    num: "01",
    name: "Digital Experiences",
    desc: "High-performing websites and landing pages that turn visitors into customers.",
    tags: "WEB DESIGN · DEVELOPMENT · CMS",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="22" height="16" rx="2" />
        <line x1="3" y1="10" x2="25" y2="10" />
        <circle cx="6.5" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="9.5" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="12.5" cy="7.5" r="0.8" fill="currentColor" stroke="none" />
        <line x1="10" y1="24" x2="18" y2="24" />
        <line x1="14" y1="21" x2="14" y2="24" />
      </svg>
    ),
  },
  {
    num: "02",
    name: "Digital Products",
    desc: "Custom web applications, dashboards and SaaS platforms built around your business.",
    tags: "WEB APPS · SAAS · MVP",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="10" height="10" rx="2" />
        <rect x="15" y="3" width="10" height="10" rx="2" />
        <rect x="3" y="15" width="10" height="10" rx="2" />
        <rect x="15" y="15" width="10" height="10" rx="2" />
      </svg>
    ),
  },
  {
    num: "03",
    name: "Commerce",
    desc: "E-commerce stores and product experiences designed to make buying effortless.",
    tags: "E-COMMERCE · PAYMENTS · INTEGRATIONS",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h18l-2 11H8L6 7z" />
        <line x1="6" y1="7" x2="4" y2="3" />
        <circle cx="10" cy="23" r="1.5" />
        <circle cx="20" cy="23" r="1.5" />
      </svg>
    ),
  },
  {
    num: "04",
    name: "Intelligent Systems",
    desc: "AI integrations and automation that streamline operations and unlock new opportunities.",
    tags: "AI · AUTOMATION · INTERNAL TOOLS",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="4" />
        <circle cx="14" cy="14" r="1" fill="currentColor" stroke="none" />
        <line x1="14" y1="3" x2="14" y2="10" />
        <line x1="14" y1="18" x2="14" y2="25" />
        <line x1="3" y1="14" x2="10" y2="14" />
        <line x1="18" y1="14" x2="25" y2="14" />
        <line x1="6.2" y1="6.2" x2="11.2" y2="11.2" />
        <line x1="16.8" y1="16.8" x2="21.8" y2="21.8" />
      </svg>
    ),
  },
];

export function Capabilities() {
  return (
    <section id="services" className={styles.section}>
      <div className="shell">
        <SectionHeader
          eyebrow="WHAT WE BUILD"
          title="End-to-end digital solutions for modern businesses."
        />

        <div className={styles.grid}>
          {SERVICES.map((service) => (
            <Reveal key={service.num} variant="up" className={styles.service}>
              <div className={styles.serviceInner}>
                <span className={styles.serviceIcon} aria-hidden="true">
                  {service.icon}
                </span>
                <span className={styles.serviceNum}>{service.num}</span>
                <h3 className={styles.serviceName}>{service.name}</h3>
                <p className={styles.serviceDesc}>{service.desc}</p>
                <p className={styles.serviceTags}>{service.tags}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}