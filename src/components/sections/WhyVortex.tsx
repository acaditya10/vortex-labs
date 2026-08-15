import { Reveal } from "@/components/ui/Reveal";
import styles from "./WhyVortex.module.css";

const PRINCIPLES = [
  {
    name: "Direct Collaboration",
    desc: "No account managers. No unnecessary layers. Direct communication with the person building your product.",
  },
  {
    name: "Quality Over Quantity",
    desc: "We take on selective projects so every build gets the attention it deserves.",
  },
  {
    name: "Built To Scale",
    desc: "Thoughtful foundations today make it easier to evolve your product tomorrow.",
  },
];

export function WhyVortex() {
  return (
    <section id="about" className={styles.section}>
      <div className="shell">
        <div className={styles.grid}>
          <div className={styles.left}>
            <Reveal variant="fade">
              <p className={styles.eyebrow}>WHY VORTEX</p>
            </Reveal>
            <Reveal variant="up" delay={80}>
              <h2 className={styles.heading}>
                Independent by choice.
                <br />
                Focused on quality.
              </h2>
            </Reveal>
            <Reveal variant="fade" delay={160}>
              <p className={styles.whyIntro}>
                Vortex is intentionally small. You work directly with the person designing and
                building your product — from the first conversation to launch and beyond.
              </p>
            </Reveal>
          </div>

          <div className={styles.center}>
            <Reveal variant="clip" className={styles.portraitReveal}>
              <div
                className={styles.portrait}
                role="img"
                aria-label="Aditya Chandra, founder and developer of Vortex"
              >
                <span className={styles.portraitOrbit} aria-hidden="true" />
                <span className={styles.portraitMono}>AC</span>
                <span className={styles.portraitAccent} aria-hidden="true" />
              </div>
            </Reveal>
          </div>

          <div className={styles.right}>
            <ol className={styles.principles}>
              {PRINCIPLES.map((principle, i) => (
                <li key={principle.name} className={styles.principle}>
                  <Reveal variant="up" delay={i * 80}>
                    <div className={styles.principleIcon} aria-hidden="true" />
                    <h3 className={styles.principleName}>{principle.name}</h3>
                    <p className={styles.principleDesc}>{principle.desc}</p>
                  </Reveal>
                </li>
              ))}
            </ol>

            <Reveal variant="up" delay={260} className={styles.founder}>
              <h3 className={styles.founderName}>Aditya Chandra</h3>
              <p className={styles.founderRole}>Founder & Developer</p>
              <p className={styles.founderLoc}>Based in India · Working worldwide</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
