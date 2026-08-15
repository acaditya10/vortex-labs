"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { VortexScene } from "./VortexScene";
import { useResponsiveConfig } from "./useResponsiveConfig";

/**
 * Mounts the WebGL canvas only after first paint, and only when WebGL is
 * actually available. Text renders (and remains readable) regardless.
 * Accepts optional hover state to drive vortex pulse effects.
 */
export function VortexCanvas({ hover }: { hover?: boolean }) {
  const { config, ready } = useResponsiveConfig();
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!ready || !config || !mounted) {
    return <div ref={canvasRef} aria-hidden="true" />;
  }

  return (
    <div
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: "100%", height: "100%" }}
    >
      <Canvas
        dpr={config.dpr}
        flat
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ fov: 42, near: 0.1, far: 300, position: [0, 0, config.cameraDistance] }}
        style={{ width: "100%", height: "100%" }}
      >
        <VortexScene config={config} hover={hover} />
      </Canvas>
    </div>
  );
}
