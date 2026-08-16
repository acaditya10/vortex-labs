import styles from "./WorkPreview.module.css";

type WorkPreviewProps = {
  variant: "upmark" | "winit" | "prince";
  url: string;
};

const SITES = {
  upmark: {
    label: "Preview of upmarkmedia.in — a marketing agency website",
    title: "UPMARK",
    subtitle: "Integrated Marketing That Moves Markets",
    tag: "MARKETING AGENCY",
    accent: "#2563eb",
  },
  winit: {
    label: "Preview of winitmedia.com — an influencer marketing company website",
    title: "WINIT MEDIA",
    subtitle: "Shaping Success Stories",
    tag: "INFLUENCER MARKETING",
    accent: "#912dbf",
  },
  prince: {
    label: "Preview of prince.acaditya10.tech — a heritage pickle brand e-commerce site",
    title: "PRINCE ACHAR",
    subtitle: "A taste of Delhi, passed down generations.",
    tag: "HERITAGE PICKLES · EST. 1980",
    accent: "#b8860b",
  },
} as const;

export function WorkPreview({ variant, url }: WorkPreviewProps) {
  const site = SITES[variant];

  return (
    <div className={styles.frame} role="img" aria-label={site.label}>
      <div className={styles.bar}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.url}>{url}</span>
        <span className={styles.liveBadge}>LIVE</span>
      </div>

      <div className={styles.iframeWrap}>
        <iframe
          src={url}
          title={site.label}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          className={styles.iframe}
        />
        <div className={styles.iframeOverlay} aria-hidden="true">
          <span className={styles.overlayTag}>{site.tag}</span>
          <h4 className={styles.overlayTitle}>{site.subtitle}</h4>
          <span className={styles.overlayCta}>View Live Site ↗</span>
        </div>
      </div>
    </div>
  );
}
