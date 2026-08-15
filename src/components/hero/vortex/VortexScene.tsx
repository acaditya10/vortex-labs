"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { VortexCore } from "./VortexCore";
import { VortexField } from "./VortexField";
import { StarField } from "./StarField";
import type { VortexConfig } from "./useResponsiveConfig";
import type { LayerUniforms } from "./uniforms";

const LOOP_DURATION = 36;

function makeUniforms(config: VortexConfig, hover: boolean): LayerUniforms {
  return {
    uTime: { value: 0 },
    uIntro: { value: config.reducedMotion ? 1 : 0 },
    uOpacity: { value: config.opacity },
    uPixelRatio: { value: 1 },
    uSpin: { value: config.spin },
    uRadius: { value: config.radius },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseVel: { value: new THREE.Vector2(0, 0) },
    uMouseStrength: { value: 0 },
    uHoverPulse: { value: hover ? 1 : 0 },
    uLineWidth: { value: 0.004 },
    uSpeedMul: { value: config.reducedMotion ? 0 : 1 },
  };
}

export function VortexScene({ config, hover }: { config: VortexConfig; hover?: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const { viewport } = useThree();
  const time = useRef(0);
  const intro = useRef(config.reducedMotion ? 1 : 0);
  const camBase = useRef(new THREE.Vector3(0, 0, config.cameraDistance));

  const uniforms = useMemo(
    () => ({
      disc: makeUniforms(config, hover ?? false),
      core: makeUniforms(config, hover ?? false),
      stars: makeUniforms(config, hover ?? false),
    }),
    [config.breakpoint, hover]
  );

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const elapsed = (time.current += delta);
    const t = elapsed % LOOP_DURATION;

    // Materialization ramp: field establishes itself over ~2.5s.
    const goal = config.reducedMotion || elapsed > 0.25 ? 1 : 0;
    intro.current += (goal - intro.current) * Math.min(1, delta * 1.5);
    const eased = intro.current * intro.current * (3 - 2 * intro.current);

    for (const u of Object.values(uniforms)) {
      u.uTime.value = t;
      u.uIntro.value = eased;
      u.uPixelRatio.value = Math.min(viewport.dpr, 2);
      u.uLineWidth.value = config.lineWidthPx / (state.size.height * viewport.dpr);
      // uHoverPulse is already set by the useMemo above; keep it persistent.
    }

    // The field is fixed in place at the configured focus point.
    const ndcX = config.focus.x * 2 - 1;
    const ndcY = 1 - config.focus.y * 2;

    const g = group.current;
    g.position.set(
      (ndcX * viewport.width) / 2,
      (ndcY * viewport.height) / 2,
      0
    );

    g.rotation.set(config.rotation[0], config.rotation[1], config.rotation[2]);

    // Settle with a whisper of overshoot
    const c1 = 1.0;
    const uVal = intro.current;
    const back = 1 + c1 * Math.pow(uVal - 1, 3) + (c1 + 1) * Math.pow(uVal - 1, 2);
    const s = 0.94 + 0.06 * back;
    g.scale.set(s, s, s);

    // Autonomous camera breathing
    if (!config.reducedMotion) {
      const cam = state.camera;
      const loopPhase = (Math.PI * 2 * t) / LOOP_DURATION;
      cam.position.set(
        camBase.current.x + Math.sin(loopPhase) * 0.55,
        camBase.current.y + Math.cos(loopPhase * 2 + 0.6) * 0.4,
        camBase.current.z
      );
      cam.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <StarField
        uniforms={uniforms.stars}
        count={config.starCount}
        radius={config.radius * 1.6}
      />

      <group
        ref={group}
        scale={config.reducedMotion ? 1 : 0.94}
      >
        <VortexField uniforms={uniforms} config={config} />
        <VortexCore uniforms={uniforms.core} />
      </group>
    </>
  );
}
