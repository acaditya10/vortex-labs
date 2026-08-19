"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [idx, setIdx] = useState(0);
  const len = site.files.length;

  const advance = useCallback(() => {
    setIdx((prev) => (prev + 1) % len);
  }, [len]);

  useEffect(() => {
    if (len <= 1) return;
    const id = setInterval(advance, CYCLE_MS);
    return () => clearInterval(id);
  }, [advance, len]);

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
        {site.files.map((file, i) => {
          const active = i === idx;
          return (
            <div
              key={file.src}
              className={styles.mediaItem}
              style={{ opacity: active ? 1 : 0, zIndex: active ? 1 : 0 }}
            >
              {file.type === "image" ? (
                <img
                  src={file.src}
                  alt=""
                  className={styles.media}
                  draggable={false}
                />
              ) : (
                <video
                  src={file.src}
                  autoPlay={active}
                  muted
                  loop
                  playsInline
                  preload={active ? "auto" : "none"}
                  className={styles.media}
                />
              )}
            </div>
          );
        })}

        <div className={styles.overlay} aria-hidden="true">
          <span className={styles.overlayTag}>{site.tag}</span>
        </div>
      </div>
    </div>
  );
}
