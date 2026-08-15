"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { CORE_FRAGMENT, CORE_VERTEX } from "./shaders";
import type { LayerUniforms } from "./uniforms";

export function VortexCore({ uniforms }: { uniforms: LayerUniforms }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([0, 0, 0], 3)
    );
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1);
    return g;
  }, []);

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        args={[
          {
            vertexShader: CORE_VERTEX,
            fragmentShader: CORE_FRAGMENT,
            uniforms,
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            toneMapped: false,
          },
        ]}
      />
    </points>
  );
}
