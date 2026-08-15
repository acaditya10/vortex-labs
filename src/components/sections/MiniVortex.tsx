"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  DOT_FRAGMENT,
  DOT_VERTEX,
  FIELD_FRAGMENT,
  FIELD_VERTEX,
  GLOW_FRAGMENT,
  GLOW_VERTEX,
  PLANE_FRAGMENT,
  PLANE_VERTEX,
} from "@/components/hero/vortex/shaders";
import { useFieldGeometry } from "@/components/hero/vortex/useFieldGeometry";
import type { LayerUniforms } from "@/components/hero/vortex/uniforms";

const LOOP = 36;
const RADIUS = 5;
const CAMERA_Z = 10;

function makeUniforms(): LayerUniforms {
  return {
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uOpacity: { value: 0.6 },
    uPixelRatio: { value: 1 },
    uSpin: { value: 0.04 },
    uRadius: { value: RADIUS },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uMouseVel: { value: new THREE.Vector2(0, 0) },
    uMouseStrength: { value: 0 },
    uHoverPulse: { value: 0 },
    uLineWidth: { value: 0.006 },
    uSpeedMul: { value: 1 },
  };
}

function Scene() {
  const group = useRef<THREE.Group>(null!);
  const { viewport } = useThree();
  const time = useRef(0);
  const intro = useRef(0);

  const uniforms = useMemo(() => ({ disc: makeUniforms(), core: makeUniforms() }), []);

  const geometry = useFieldGeometry({
    discCount: 80,
    discTrails: 3,
    emberCount: 2,
    dotCount: 40,
  });

  const planeGeo = useMemo(() => new THREE.PlaneGeometry(RADIUS * 2.4, RADIUS * 2.4), []);
  const glowGeo = useMemo(() => new THREE.PlaneGeometry(RADIUS * 0.95, RADIUS * 0.95), []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const elapsed = (time.current += delta);
    const t = elapsed % LOOP;

    intro.current += (1 - intro.current) * Math.min(1, delta * 1.2);
    const eased = intro.current * intro.current * (3 - 2 * intro.current);

    for (const u of Object.values(uniforms)) {
      u.uTime.value = t;
      u.uIntro.value = eased;
      u.uPixelRatio.value = Math.min(viewport.dpr, 1.5);
      u.uLineWidth.value = 0.006;
    }

    const g = group.current;
    g.rotation.set(0.88, 0.18, -0.24);

    const c1 = 1.0;
    const back = 1 + c1 * Math.pow(eased - 1, 3) + (c1 + 1) * Math.pow(eased - 1, 2);
    const s = 0.94 + 0.06 * back;
    g.scale.set(s, s, s);
  });

  return (
    <group ref={group}>
      {/* Accretion plane */}
      <mesh geometry={planeGeo} frustumCulled={false}>
        <shaderMaterial
          args={[
            {
              vertexShader: PLANE_VERTEX,
              fragmentShader: PLANE_FRAGMENT,
              uniforms: uniforms.disc,
              transparent: true,
              depthWrite: false,
              depthTest: false,
              blending: THREE.AdditiveBlending,
              toneMapped: false,
            },
          ]}
        />
      </mesh>

      {/* Ribbons */}
      <mesh geometry={geometry.disc} frustumCulled={false}>
        <shaderMaterial
          args={[
            {
              vertexShader: FIELD_VERTEX,
              fragmentShader: FIELD_FRAGMENT,
              uniforms: uniforms.disc,
              transparent: true,
              depthWrite: false,
              depthTest: true,
              blending: THREE.AdditiveBlending,
              toneMapped: false,
            },
          ]}
        />
      </mesh>

      {/* Dots */}
      <points geometry={geometry.dots} frustumCulled={false}>
        <shaderMaterial
          args={[
            {
              vertexShader: DOT_VERTEX,
              fragmentShader: DOT_FRAGMENT,
              uniforms: uniforms.disc,
              transparent: true,
              depthWrite: false,
              depthTest: true,
              blending: THREE.AdditiveBlending,
              toneMapped: false,
            },
          ]}
        />
      </points>

      {/* Glow */}
      <mesh geometry={glowGeo} frustumCulled={false}>
        <shaderMaterial
          args={[
            {
              vertexShader: GLOW_VERTEX,
              fragmentShader: GLOW_FRAGMENT,
              uniforms: uniforms.core,
              transparent: true,
              depthWrite: false,
              depthTest: false,
              blending: THREE.AdditiveBlending,
              toneMapped: false,
            },
          ]}
        />
      </mesh>
    </group>
  );
}

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGL2RenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

export function MiniVortex() {
  const [mounted, setMounted] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOk(supportsWebGL());
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted || !ok) return null;

  return (
    <Canvas
      dpr={[1, 1.5]}
      flat
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      camera={{ fov: 42, near: 0.1, far: 100, position: [0, 0, CAMERA_Z] }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene />
    </Canvas>
  );
}
