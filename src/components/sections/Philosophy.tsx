import { Reveal } from "@/components/ui/Reveal";
import styles from "./Philosophy.module.css";

export function Philosophy() {
  return (
    <section className={styles.section}>
      <div className="shell">
        <div className="philosophyCanvas" aria-hidden="true" role="img" aria-label="Vortex philosophy subtle orbital graphics">
          <div className="orbitLeft" />
          <div className="orbitRight" />
        </div>

        <div className="inner">
          <Reveal variant="fade">
            <p className={styles.eyebrow}>OUR PHILOSOPHY</p>
          </Reveal>
          <Reveal variant="up" delay={100}>
            <p className={styles.statement}>
              Good technology should disappear.
              <span className={styles.line}>The experience shouldn&apos;t.</span>
            </p>
          </Reveal>
          <Reveal variant="fade" delay={240}>
            <p className={styles.support}>
              We combine thoughtful design, solid engineering and emerging technology to create
              digital products that feel simple, intentional and effortless to use.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}