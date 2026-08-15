"use client";

import { useMemo } from "react";
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
} from "./shaders";
import { useFieldGeometry } from "./useFieldGeometry";
import type { VortexConfig } from "./useResponsiveConfig";
import type { LayerUniforms } from "./uniforms";
import { VortexDepth } from "./VortexDepth";

export function VortexField({
  uniforms,
  config,
}: {
  uniforms: { disc: LayerUniforms; core: LayerUniforms };
  config: VortexConfig;
}) {
  const geometry = useFieldGeometry({
    discCount: config.discCount,
    discTrails: config.discTrails,
    emberCount: config.emberCount,
    dotCount: config.dotCount,
  });

  const planeGeo = useMemo(() => new THREE.PlaneGeometry(config.radius * 2.4, config.radius * 2.4), [config.radius]);
  const glowGeo = useMemo(() => new THREE.PlaneGeometry(config.radius * 0.95, config.radius * 0.95), [config.radius]);
  const depthCounts =
    config.breakpoint === "desktop"
      ? { far: 58, near: 18 }
      : config.breakpoint === "tablet"
        ? { far: 42, near: 12 }
        : { far: 20, near: 5 };

  return (
    <>
      {/* Far dust gives the vortex a quiet volume behind the main bands. */}
      <VortexDepth uniforms={uniforms.disc} radius={config.radius} count={depthCounts.far} layer="far" />

      {/* Subtle accretion plane backplate */}
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

      {/* Swirling ribbons */}
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

      {/* Soft dot sparks riding the same spiral */}
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

      {/* A few close fragments add parallax without crowding the field. */}
      <VortexDepth uniforms={uniforms.disc} radius={config.radius} count={depthCounts.near} layer="near" />

      {/* Selective bloom: only the singularity receives a luminous flare. */}
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
    </>
  );
}
