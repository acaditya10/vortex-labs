"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { DEPTH_FRAGMENT, DEPTH_VERTEX } from "./shaders";
import type { LayerUniforms } from "./uniforms";

function mulberry32(seed: number) {
  let value = seed >>> 0;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let result = Math.imul(value ^ (value >>> 15), 1 | value);
    result = (result + Math.imul(result ^ (result >>> 7), 61 | result)) ^ result;
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function VortexDepth({
  uniforms,
  radius,
  count,
  layer,
}: {
  uniforms: LayerUniforms;
  radius: number;
  count: number;
  layer: "far" | "near";
}) {
  const geometry = useMemo(() => {
    const rand = mulberry32(layer === "far" ? 0x1a2b3c4d : 0x5e6f7081);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    const opacities = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const isNear = layer === "near";

    for (let index = 0; index < count; index++) {
      const angle = rand() * Math.PI * 2;
      const distance = radius * (isNear ? 0.42 + rand() * 0.52 : 0.30 + rand() * 0.64);
      const offset = (rand() - 0.5) * radius * (isNear ? 0.16 : 0.28);
      const accent = rand() < (isNear ? 0.18 : 0.08);

      positions[index * 3] = Math.cos(angle) * distance;
      positions[index * 3 + 1] = offset;
      positions[index * 3 + 2] = Math.sin(angle) * distance;
      seeds[index] = rand();
      sizes[index] = isNear ? 1.1 + rand() * 1.4 : 0.7 + rand() * 0.8;
      opacities[index] = isNear ? 0.16 + rand() * 0.14 : 0.05 + rand() * 0.09;
      colors[index * 3] = accent ? 1 : 0.92;
      colors[index * 3 + 1] = accent ? 0.416 : 0.90;
      colors[index * 3 + 2] = accent ? 0.239 : 0.87;
    }

    const output = new THREE.BufferGeometry();
    output.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    output.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    output.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    output.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));
    output.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    output.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius * 1.5);
    return output;
  }, [count, layer, radius]);

  return (
    <points geometry={geometry} frustumCulled={false} renderOrder={layer === "far" ? -1 : 2}>
      <shaderMaterial
        args={[
          {
            vertexShader: DEPTH_VERTEX,
            fragmentShader: DEPTH_FRAGMENT,
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
