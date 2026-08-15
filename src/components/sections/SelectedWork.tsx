import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WorkPreview } from "./WorkPreview";
import styles from "./SelectedWork.module.css";

const PROJECTS = [
  {
    index: "01",
    name: "UPMARK MEDIA",
    tags: "Branding · Web Design · Development",
    desc: "A modern marketing agency — positioning, campaigns and a digital presence with the confidence to back them up.",
    url: "https://upmarkmedia.in",
    variant: "upmark" as const,
  },
  {
    index: "02",
    name: "WINIT MEDIA",
    tags: "Strategy · Design · Development",
    desc: "Influencer marketing and media built for a new generation — connecting brands with the creators and audiences that matter.",
    url: "https://winitmedia.com",
    variant: "winit" as const,
  },
  {
    index: "03",
    name: "PRINCE ACHAR",
    tags: "E-commerce · UX/UI · Development",
    desc: "A heritage Delhi pickle brand brought into the digital world — a storefront that carries four decades of craft into the modern market.",
    url: "https://prince.acaditya10.tech",
    variant: "prince" as const,
  },
];

export function SelectedWork() {
  return (
    <section id="work" className={styles.section}>
      <div className="shell">
        <SectionHeader
          eyebrow="SELECTED WORK"
          title="Digital experiences that deliver results."
        />

        <Reveal variant="fade">
          <div className={styles.head}>
            <p className={styles.support}>
              A selection of digital experiences we&apos;ve designed and built for ambitious
              businesses — from positioning and brand to the final shipped product.
            </p>
            <a
              className={styles.allLink}
              href="#contact"
            >
              View All Projects <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Reveal>

        <div className={styles.grid}>
          {PROJECTS.map((project, i) => (
            <article
              key={project.index}
              className={styles.project}
            >
              <a
                className={styles.projectLink}
                href={project.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Visit ${project.name} — opens in a new tab`}
              >
                <Reveal variant="clip">
                  <WorkPreview
                    variant={project.variant}
                    url={project.url.replace("https://", "")}
                  />
                </Reveal>
              </a>

              <div className={styles.meta}>
                <Reveal variant="up" delay={80}>
                  <h3 className={styles.name}>{project.name}</h3>
                </Reveal>
                <Reveal variant="fade" delay={140}>
                  <p className={styles.desc}>{project.desc}</p>
                </Reveal>
                <div className={styles.metaFoot}>
                  <Reveal variant="fade" delay={200}>
                    <p className={styles.tags}>{project.tags}</p>
                  </Reveal>
                  <Reveal variant="up" delay={240}>
                    <span className={styles.index}>{project.index} / CASE STUDY</span>
                  </Reveal>
                </div>
                <Reveal variant="up" delay={280}>
                  <a
                    className={styles.link}
                    href={project.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Visit Live Site <span aria-hidden="true">↗</span>
                  </a>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}