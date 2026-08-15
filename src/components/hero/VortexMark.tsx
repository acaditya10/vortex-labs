"use client";

import { useId, useMemo } from "react";

/**
 * VORTEX brand mark — a converging spiral orbit with a single
 * Vortex Orange point at the point of convergence.
 * Works at any size: navbar, favicon, loader, future brand mark.
 */
export function VortexMark({
  size = 20,
  accent = "#FF6A3D",
  className,
}: {
  size?: number;
  accent?: string;
  className?: string;
}) {
  const uid = useId();

  const path = useMemo(() => {
    const cx = 12;
    const cy = 12;
    const rMax = 8.4;
    const thetaMax = 1.55 * Math.PI * 2;
    const steps = 72;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r = rMax * (1 - Math.pow(t, 0.82));
      const th = thetaMax * t;
      pts.push(`${(cx + Math.cos(th) * r).toFixed(3)} ${(cy + Math.sin(th) * r).toFixed(3)}`);
    }
    return `M ${pts.join(" L ")}`;
  }, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath={`url(#${uid})`}>
        <path
          d={path}
          stroke="currentColor"
          strokeWidth="1.55"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <circle cx="11.95" cy="11.99" r="1.35" fill={accent} />
      </g>
      <defs>
        <clipPath id={uid}>
          <rect x="1.5" y="1.5" width="21" height="21" rx="2" />
        </clipPath>
      </defs>
    </svg>
  );
}
