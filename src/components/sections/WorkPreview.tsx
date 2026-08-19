"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WorkPreview.module.css";

type WorkPreviewProps = {
  variant: "upmark" | "winit" | "prince";
  url: string;
};

const MEDIA = {
  upmark: {
    label: "Preview of upmarkmedia.in — a marketing agency website",
    tag: "MARKETING AGENCY",
    files: [
      { type: "image" as const, src: "/work/um1.webp" },
      { type: "video" as const, src: "/work/um2.webm" },
      { type: "video" as const, src: "/work/um3.webm" },
    ],
  },
  winit: {
    label: "Preview of winitmedia.com — an influencer marketing company website",
    tag: "INFLUENCER MARKETING",
    files: [
      { type: "image" as const, src: "/work/wm1.webp" },
      { type: "video" as const, src: "/work/wm2.webm" },
      { type: "video" as const, src: "/work/wm3.webm" },
      { type: "image" as const, src: "/work/wm4.webp" },
    ],
  },
  prince: {
    label: "Preview of prince.acaditya10.tech — a heritage pickle brand e-commerce site",
    tag: "HERITAGE PICKLES",
    files: [
      { type: "image" as const, src: "/work/pa1.webp" },
      { type: "image" as const, src: "/work/pa2.webp" },
    ],
  },
} as const;

const CYCLE_MS = 5000;

export function WorkPreview({ variant, url }: WorkPreviewProps) {
  const site = MEDIA[variant];
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % site.files.length);
    }, CYCLE_MS);
    return () => clearInterval(timerRef.current!);
  }, [site.files.length]);

  const item = site.files[current];

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

      <div className={styles.mediaWrap}>
        {site.files.map((file, i) => (
          <div
            key={file.src}
            className={`${styles.mediaItem} ${i === current ? styles.mediaActive : ""}`}
          >
            {file.type === "image" ? (
              <img
                src={file.src}
                alt={site.label}
                loading={i === 0 ? "eager" : "lazy"}
                className={styles.media}
                draggable={false}
              />
            ) : (
              <video
                src={file.src}
                autoPlay
                muted
                loop
                playsInline
                preload={i === 0 ? "auto" : "none"}
                className={styles.media}
                aria-label={site.label}
              />
            )}
          </div>
        ))}

        <div className={styles.overlay} aria-hidden="true">
          <span className={styles.overlayTag}>{site.tag}</span>
        </div>
      </div>
    </div>
  );
}
