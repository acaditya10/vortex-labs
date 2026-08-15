import styles from "./WorkPreview.module.css";

type WorkPreviewProps = {
  variant: "upmark" | "winit" | "prince";
  url: string;
};

/**
 * Art-directed, image-free previews of the three live client sites.
 * Each variant is a miniature CSS recreation of the real site's design
 * language (layout, typography, density) kept strictly within the
 * Vortex neutral + orange palette. Purely decorative.
 */
export function WorkPreview({ variant, url }: WorkPreviewProps) {
  const label =
    variant === "upmark"
      ? "Preview of upmarkmedia.in — a marketing agency website"
      : variant === "winit"
        ? "Preview of winitmedia.com — an influencer marketing company website"
        : "Preview of prince.acaditya10.tech — a heritage pickle brand e-commerce site";

  return (
    <div className={styles.frame} role="img" aria-label={label}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.url}>{url}</span>
        <span className={styles.cap}>LIVE</span>
      </div>

      <div className={styles.body}>
        {variant === "upmark" ? <Upmark /> : variant === "winit" ? <Winit /> : <Prince />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Upmark Media — bold uppercase agency editorial                       */
/* ------------------------------------------------------------------ */

function Upmark() {
  return (
    <div className={styles.upmark}>
      <div className={styles.upNav}>
        <span className={styles.upWord}>UPMARK</span>
        <span className={styles.upLinks} aria-hidden="true">
          Work&ensp;Services&ensp;About&ensp;Contact
        </span>
      </div>
      <div className={styles.upHero}>
        <p className={styles.upTag}>MARKETING AGENCY</p>
        <h4 className={styles.upTitle}>
          Integrated
          <br />
          Marketing That
          <br />
          Moves Markets
        </h4>
        <p className={styles.upSub}>
          Strategy. Creative. Media. Built for brands that mean business.
        </p>
        <div className={styles.upStats}>
          <span className={styles.upStat}>
            <b>50+</b> BRANDS
          </span>
          <span className={styles.upStat}>
            <b>120%</b> AVG. GROWTH
          </span>
          <span className={styles.upStat}>
            <b>6</b> MARKETS
          </span>
        </div>
      </div>
      <div className={styles.upCards} aria-hidden="true">
        <span className={styles.upCard}>
          <span className={styles.upCardTitle}>Brand Strategy</span>
          <span className={styles.upCardBody} />
        </span>
        <span className={styles.upCard}>
          <span className={styles.upCardTitle}>Digital Campaigns</span>
          <span className={styles.upCardBody} />
        </span>
        <span className={styles.upCard}>
          <span className={styles.upCardTitle}>Performance</span>
          <span className={styles.upCardBody} />
        </span>
      </div>
      <div className={styles.upMarquee} aria-hidden="true">
        STRATEGY&ensp;·&ensp;CREATIVE&ensp;·&ensp;MEDIA&ensp;·&ensp;CAMPAIGNS&ensp;·&ensp;BRAND&ensp;·&ensp;PERFORMANCE
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Winit Media — centred statement, social grid                         */
/* ------------------------------------------------------------------ */

function Winit() {
  return (
    <div className={styles.winit}>
      <div className={styles.winNav}>
        <span className={styles.winWord}>WINIT MEDIA</span>
        <span className={styles.winPill}>Connect Now</span>
      </div>
      <div className={styles.winHero}>
        <div className={styles.winRing} aria-hidden="true" />
        <p className={styles.winTag}>INFLUENCER MARKETING</p>
        <h4 className={styles.winTitle}>
          Shaping
          <br />
          Success
          <br />
          Stories
        </h4>
        <p className={styles.winSub}>
          Connecting brands with the creators and audiences that matter.
        </p>
        <span className={styles.winBtn}>Connect Now ↗</span>
      </div>
      <div className={styles.winStats} aria-hidden="true">
        <span className={styles.winStatItem}>
          <b>200+</b> CREATORS
        </span>
        <span className={styles.winStatItem}>
          <b>50M+</b> REACH
        </span>
        <span className={styles.winStatItem}>
          <b>80+</b> BRANDS
        </span>
      </div>
      <div className={styles.winGrid}>
        <span className={styles.winTile}>@creator</span>
        <span className={styles.winTile}>@creator</span>
        <span className={styles.winTile}>@creator</span>
        <span className={styles.winTile}>@creator</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Prince Achar — light, warm, heritage e-commerce                     */
/* ------------------------------------------------------------------ */

function Prince() {
  return (
    <div className={styles.prince}>
      <div className={styles.prNav}>
        <span className={styles.prWord}>PRINCE ACHAR</span>
        <span className={styles.prSub}>DELHI · EST. 1980</span>
      </div>
      <div className={styles.prHero}>
        <p className={styles.prTag}>HANDCRAFTED WITH LOVE</p>
        <h4 className={styles.prTitle}>
          A taste of Delhi,
          <br />
          passed down
          <br />
          generations.
        </h4>
        <div className={styles.prCta}>
          <span className={styles.prBtn}>Explore Now</span>
          <span className={styles.prLink}>Shop All Pickles ↗</span>
        </div>
      </div>
      <div className={styles.prBanner}>FREE DELIVERY ON ORDERS ABOVE ₹500</div>
      <div className={styles.prJars}>
        <span className={styles.prJar}>
          <span className={styles.prJarGlyph} aria-hidden="true" />
          <b>MANGO PICKLE</b>
          <i>₹349</i>
        </span>
        <span className={styles.prJar}>
          <span className={styles.prJarGlyph} aria-hidden="true" />
          <b>MIXED PICKLE</b>
          <i>₹449</i>
        </span>
        <span className={styles.prJar}>
          <span className={styles.prJarGlyph} aria-hidden="true" />
          <b>LIME PICKLE</b>
          <i>₹329</i>
        </span>
      </div>
      <div className={styles.prReview} aria-hidden="true">
        <span className={styles.prReviewText}>&ldquo;Best pickle I&apos;ve ever had. Authentic Delhi taste.&rdquo;</span>
        <span className={styles.prReviewAuthor}>— Priya S., Mumbai</span>
      </div>
    </div>
  );
}
