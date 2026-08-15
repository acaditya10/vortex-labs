"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { STARS_FRAGMENT, STARS_VERTEX } from "./shaders";
import type { LayerUniforms } from "./uniforms";

export function StarField({
  uniforms,
  count,
  radius,
}: {
  uniforms: LayerUniforms;
  count: number;
  radius: number;
}) {
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const warm = new THREE.Color(0.97, 0.94, 0.88);
    const accent = new THREE.Color(1.0, 0.416, 0.239);

    for (let i = 0; i < count; i++) {
      // Scatter across the whole screen disc, with a slight depth spread.
      const r = Math.sqrt(Math.random()) * radius;
      const th = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(th) * r;
      pos[i * 3 + 1] = Math.sin(th) * r;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3;
      seed[i] = Math.random();
      size[i] = 1.0 + Math.random() * 1.6;
      const c = Math.random() < 0.12 ? accent : warm;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    g.boundingSphere = new THREE.Sphere(
      new THREE.Vector3(0, 0, 0),
      radius * 1.5
    );
    return g;
  }, [count, radius]);

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        args={[
          {
            vertexShader: STARS_VERTEX,
            fragmentShader: STARS_FRAGMENT,
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
