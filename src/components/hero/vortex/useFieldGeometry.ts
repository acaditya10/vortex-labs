import { useMemo } from "react";
import * as THREE from "three";

/**
 * Spiral palette — two hues only: warm white and Vortex Orange, alternating
 * line by line so the converging swirl reads as interleaved orange/white
 * spiral arms. No other hues.
 */
const WARM_WHITE: [number, number, number] = [0.956, 0.945, 0.917]; // #F4F1EA
const ACCENT: [number, number, number] = [1.0, 0.416, 0.239]; // #FF6A3D
const ARM_COUNT = 7;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Disc field — rendered as wide, soft-edged strokes. Each logical particle is
 * one ribbon: consecutive trail samples (k, k+1) become the two ends of a
 * quad. Six vertices per quad (two triangles) carry the trail lag of each end
 * (`aTrailA`/`aTrailB`) plus which corner of the ribbon they are (`aEnd`,
 * `aSide`), so the vertex shader resolves both endpoints from the same
 * procedural orbit and expands the stroke in screen space.
 */
function buildLines(
  count: number,
  samples: number,
  emberCount: number,
  seedValue: number
): THREE.BufferGeometry {
  const segments = Math.max(samples - 1, 1);
  const V = count * segments * 6;

  const aSeed = new Float32Array(V);
  const aParams = new Float32Array(V * 3);
  const aTrailA = new Float32Array(V);
  const aTrailB = new Float32Array(V);
  const aEnd = new Float32Array(V);
  const aSide = new Float32Array(V);
  const aTrailLen = new Float32Array(V);
  const aColor = new Float32Array(V * 3);
  const aSpeed = new Float32Array(V);
  const aThickness = new Float32Array(V);
  const aOrange = new Float32Array(V);
  const aEmber = new Float32Array(V);

  const rand = mulberry32(seedValue);

  // Quad corners for the segment A -> B, as [endpoint, width-side]:
  // triangle 1 = (A-, B-, A+), triangle 2 = (A+, B-, B+).
  const CORNERS: [number, number][] = [
    [0, -1],
    [1, -1],
    [0, 1],
    [0, 1],
    [1, -1],
    [1, 1],
  ];

  for (let i = 0; i < count; i++) {
    const s = rand();
    // Cluster each particle around one of a few shared arms. The small local
    // variation keeps the field organic without dissolving it into static.
    const arm = i % ARM_COUNT;
    const theta0 = (arm / ARM_COUNT) * Math.PI * 2 + (rand() - 0.5) * 0.42;
    const sizeBase = 0.7 + Math.pow(rand(), 1.6) * 2.0;
    const R0 = 0.05 + 0.95 * Math.pow(rand(), 1.35);
    const speed = 0.8 + rand() * 0.4;
    const thickness = 0.12 + rand() * 0.4;
    const trailLen = 1.0 + Math.pow(rand(), 1.8) * 1.5;
    const isEmber = i < emberCount;
    const emberR0 = isEmber ? 0.25 + rand() * 0.5 : 0;
    const emberSize = isEmber ? 1.5 + rand() * 0.6 : 0;

    // Alternate orange and white line by line — interleaved swirl arms.
    const isOrange = i % 2 === 1;
    const col = isOrange ? ACCENT : WARM_WHITE;

    for (let k = 0; k < segments; k++) {
      const ta = k / segments;
      const tb = (k + 1) / segments;
      const base = (i * segments + k) * 6;
      for (let c = 0; c < 6; c++) {
        const idx = base + c;
        aSeed[idx] = s;
        aParams[idx * 3] = isEmber ? emberR0 : R0;
        aParams[idx * 3 + 1] = theta0;
        aParams[idx * 3 + 2] = isEmber ? emberSize : sizeBase;
        aTrailA[idx] = ta;
        aTrailB[idx] = tb;
        aEnd[idx] = CORNERS[c][0];
        aSide[idx] = CORNERS[c][1];
        aTrailLen[idx] = isEmber ? 0.7 + rand() * 0.4 : trailLen;
        aSpeed[idx] = isEmber ? 0.7 + rand() * 0.3 : speed;
        aThickness[idx] = thickness;
        aOrange[idx] = isEmber ? 1 : isOrange ? 1 : 0;
        aEmber[idx] = isEmber ? 1 : 0;
        const rgb = isEmber ? ACCENT : col;
        aColor[idx * 3] = rgb[0];
        aColor[idx * 3 + 1] = rgb[1];
        aColor[idx * 3 + 2] = rgb[2];
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  // `position` drives the draw vertex count in three.js; the shader
  // computes all positions procedurally, so this is a zero-filled dummy.
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(V * 3), 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));
  geometry.setAttribute("aParams", new THREE.BufferAttribute(aParams, 3));
  geometry.setAttribute("aTrailA", new THREE.BufferAttribute(aTrailA, 1));
  geometry.setAttribute("aTrailB", new THREE.BufferAttribute(aTrailB, 1));
  geometry.setAttribute("aEnd", new THREE.BufferAttribute(aEnd, 1));
  geometry.setAttribute("aSide", new THREE.BufferAttribute(aSide, 1));
  geometry.setAttribute("aTrailLen", new THREE.BufferAttribute(aTrailLen, 1));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(aColor, 3));
  geometry.setAttribute("aSpeed", new THREE.BufferAttribute(aSpeed, 1));
  geometry.setAttribute("aThickness", new THREE.BufferAttribute(aThickness, 1));
  geometry.setAttribute("aOrange", new THREE.BufferAttribute(aOrange, 1));
  geometry.setAttribute("aEmber", new THREE.BufferAttribute(aEmber, 1));

  // Positions are procedural (computed in the shader), so mark the object
  // as unbounded to prevent frustum culling from hiding it.
  geometry.boundingSphere = new THREE.Sphere(
    new THREE.Vector3(0, 0, 0),
    Number.MAX_SAFE_INTEGER
  );

  return geometry;
}

/**
 * Dot layer — soft round sparks that ride the same spiral as the ribbons.
 * One vertex per dot; the shader samples the orbit at the current time.
 */
function buildDots(count: number, seedValue: number): THREE.BufferGeometry {
  const aSeed = new Float32Array(count);
  const aParams = new Float32Array(count * 3);
  const aColor = new Float32Array(count * 3);
  const aSpeed = new Float32Array(count);
  const aThickness = new Float32Array(count);
  const aOrange = new Float32Array(count);

  const rand = mulberry32((seedValue ^ 0x85ebca6b) >>> 0);
  for (let i = 0; i < count; i++) {
    const s = rand();
    const arm = i % ARM_COUNT;
    aSeed[i] = s;
    aParams[i * 3] = 0.05 + 0.95 * Math.pow(rand(), 1.35);
    aParams[i * 3 + 1] =
      (arm / ARM_COUNT) * Math.PI * 2 + (rand() - 0.5) * 0.56;
    aParams[i * 3 + 2] = 0.7 + Math.pow(rand(), 1.6) * 2.0;
    aSpeed[i] = 0.8 + rand() * 0.4;
    aThickness[i] = 0.12 + rand() * 0.4;
    const isOrange = i % 2 === 1;
    const col = isOrange ? ACCENT : WARM_WHITE;
    aColor[i * 3] = col[0];
    aColor[i * 3 + 1] = col[1];
    aColor[i * 3 + 2] = col[2];
    aOrange[i] = isOrange ? 1 : 0;
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 1));
  g.setAttribute("aParams", new THREE.BufferAttribute(aParams, 3));
  g.setAttribute("aColor", new THREE.BufferAttribute(aColor, 3));
  g.setAttribute("aSpeed", new THREE.BufferAttribute(aSpeed, 1));
  g.setAttribute("aThickness", new THREE.BufferAttribute(aThickness, 1));
  g.setAttribute("aOrange", new THREE.BufferAttribute(aOrange, 1));
  g.boundingSphere = new THREE.Sphere(
    new THREE.Vector3(0, 0, 0),
    Number.MAX_SAFE_INTEGER
  );
  return g;
}

export interface FieldGeometry {
  disc: THREE.BufferGeometry;
  dots: THREE.BufferGeometry;
}

export function useFieldGeometry(config: {
  discCount: number;
  discTrails: number;
  emberCount: number;
  dotCount: number;
}): FieldGeometry {
  return useMemo(
    () => ({
      disc: buildLines(
        config.discCount,
        config.discTrails,
        config.emberCount,
        0x9e3779b9
      ),
      dots: buildDots(config.dotCount, 0x1f123bb5),
    }),
    [config.discCount, config.discTrails, config.emberCount, config.dotCount]
  );
}
