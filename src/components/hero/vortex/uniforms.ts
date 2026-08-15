import type * as THREE from "three";

/**
 * Shared uniforms object. Declared with an index signature so it can be
 * passed straight to `shaderMaterial`, while the specific members stay
 * strongly typed for the per-frame update loop.
 */
export interface LayerUniforms {
  [key: string]: { value: number | THREE.Vector2 };
  uTime: { value: number };
  uIntro: { value: number };
  uOpacity: { value: number };
  uPixelRatio: { value: number };
  uSpin: { value: number };
  uRadius: { value: number };
  uMouse: { value: THREE.Vector2 };
  uMouseVel: { value: THREE.Vector2 };
  uMouseStrength: { value: number };
  uHoverPulse: { value: number };
  uLineWidth: { value: number };
  uSpeedMul: { value: number };
}
