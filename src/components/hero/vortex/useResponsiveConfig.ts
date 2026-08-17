"use client";

import { useEffect, useState } from "react";

export type Breakpoint = "desktop" | "tablet" | "mobile";

export interface VortexConfig {
  breakpoint: Breakpoint;
  radius: number;
  /** Camera distance in world units; mobile uses a wider, quieter composition. */
  cameraDistance: number;
  opacity: number;
  spin: number;
  discCount: number;
  discTrails: number;
  /** Number of ember sparks that detach from the field and rise. */
  emberCount: number;
  /** Number of soft dot sparks riding the spiral (the line/dot mix). */
  dotCount: number;
  /** Number of faint background stars. */
  starCount: number;
  /** Stroke width in CSS pixels. */
  lineWidthPx: number;
  /** Normalized 0..1 point on the canvas where the vortex centre sits. */
  focus: { x: number; y: number };
  rotation: [number, number, number];
  dpr: [number, number];
  interactive: boolean;
  reducedMotion: boolean;
}

function detectBreakpoint(width: number): Breakpoint {
  if (width < 768) return "mobile";
  if (width < 1200) return "tablet";
  return "desktop";
}

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGL2RenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

const CONFIGS: Record<Breakpoint, Omit<VortexConfig, "breakpoint" | "reducedMotion" | "interactive">> = {
  desktop: {
    radius: 15,
    cameraDistance: 26,
    opacity: 1,
    spin: 0.05,
    discCount: 420,
    discTrails: 6,
    emberCount: 6,
    dotCount: 220,
    starCount: 110,
    lineWidthPx: 3.0,
    focus: { x: 0.7, y: 0.50 },
    rotation: [0.88, 0.18, -0.24],
    dpr: [1, 1.75],
  },
  tablet: {
    radius: 15,
    cameraDistance: 27,
    opacity: 0.78,
    spin: 0.05,
    discCount: 260,
    discTrails: 5,
    emberCount: 4,
    dotCount: 135,
    starCount: 85,
    lineWidthPx: 2.4,
    focus: { x: 0.82, y: 0.51 },
    rotation: [0.92, 0.14, -0.18],
    dpr: [1, 1.5],
  },
  mobile: {
    radius: 14,
    cameraDistance: 24,
    opacity: 0.85,
    spin: 0.04,
    discCount: 140,
    discTrails: 4,
    emberCount: 3,
    dotCount: 80,
    starCount: 35,
    lineWidthPx: 2.0,
    focus: { x: 0.55, y: 0.42 },
    rotation: [0.9, 0.12, -0.08],
    dpr: [1, 1.4],
  },
};

export function useResponsiveConfig() {
  const [ready, setReady] = useState(false);
  const [breakpoint, setBreakpoint] = useState<Breakpoint | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setBreakpoint(detectBreakpoint(window.innerWidth));
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    setReady(true);

    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setBreakpoint(detectBreakpoint(window.innerWidth));
      });
    };
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    window.addEventListener("resize", onResize);
    motion.addEventListener("change", onMotion);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      motion.removeEventListener("change", onMotion);
    };
  }, []);

  const interactive =
    typeof window !== "undefined" &&
    !window.matchMedia("(pointer: coarse)").matches;

  const config: VortexConfig | null =
    breakpoint && supportsWebGL()
      ? {
          ...CONFIGS[breakpoint],
          breakpoint,
          interactive,
          reducedMotion,
        }
      : null;

  return { config, ready };
}
