/**
 * GLSL for the VORTEX particle field & singularity core.
 *
 * Clean luxury palette: Pure signature Vortex Orange (#FF6A3D) & Crisp Warm White (#F4F1EA).
 * Deep Midnight Blue accent for richer depth perception & cosmic context.
 * Autonomous, fluid procedural orbits without mouse distortion.
 */

export const FIELD_VERTEX = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntro;          // 0 -> 1 materialization ramp
  uniform float uOpacity;        // global intensity
  uniform float uSpin;
  uniform float uRadius;         // outer radius of the field, world units
  uniform float uSpeedMul;       // 0 under prefers-reduced-motion
  uniform float uLineWidth;      // half stroke width in NDC units
  uniform float uHoverPulse;     // 0..1 energy pulse from CTAs

  attribute float aSeed;
  attribute vec3  aParams;       // x = base radius (0..1), y = birth angle, z = alpha/size
  attribute float aTrailA;       // trail lag of segment endpoint A (0..1)
  attribute float aTrailB;       // trail lag of segment endpoint B (0..1)
  attribute float aEnd;          // 0 at endpoint A, 1 at endpoint B
  attribute float aSide;         // -1 / +1 across the stroke width
  attribute float aTrailLen;     // trail duration in seconds (per particle)
  attribute vec3  aColor;
  attribute float aSpeed;
  attribute float aThickness;
  attribute float aOrange;       // 1 for restrained Vortex Orange particles
  attribute float aEmber;        // 1 for escaping ember sparks

  varying vec3  vColor;
  varying float vAlpha;
  varying float vEdge;
  varying float vPulse;

  const float TAU = 6.2831853;
  const float LOOP_SECONDS = 36.0;

  // Strict Orange & Crisp White color model (No yellow/gold)
  vec3 getCleanColor(float isOrange, float ember, float pulseVal, float rr) {
    vec3 cWarmWhite = vec3(0.965, 0.955, 0.935); // #F4F1EA
    vec3 cVortex    = vec3(1.00, 0.416, 0.239);  // #FF6A3D
    vec3 cDiamond   = vec3(1.00, 1.00, 1.00);    // Core diamond luminosity

    // Reserve the saturated accent for the inner field; outer ribbons remain
    // predominantly warm white so the orange reads as a focal material.
    float orangeMix = max(ember, isOrange * (1.0 - smoothstep(0.45, 0.78, rr)));
    vec3 col = mix(cWarmWhite, cVortex, orangeMix);

    // Diamond white luminosity at the core singularity
    float innerGlow = 1.0 - smoothstep(0.0, 0.32, rr);
    col = mix(col, cDiamond, innerGlow * 0.38 + pulseVal * 0.35);
    return col;
  }

  vec3 orbitSample(float tt, out float fadeIn, out float fadeOut, out float pulseAmp) {
    float seedA = aSeed * 77.7;
    float ph = fract((tt + seedA) / LOOP_SECONDS);

    fadeIn  = smoothstep(0.0, 0.08, ph);
    fadeOut = 1.0 - smoothstep(0.88, 1.0, ph);

    float R0 = mix(0.36, 1.0, aParams.x) * uRadius;
    
    // Interactive pulse wave propagating radially outwards
    float pulseWave = sin(clamp((1.0 - ph) * 8.0 - tt * 4.0, 0.0, 6.2831853));
    pulseAmp = max(0.0, pulseWave) * uHoverPulse;

    // Gentle global breathing + pulse expansion
    float breathe = 1.0 + 0.025 * sin(TAU * tt / LOOP_SECONDS) + pulseAmp * 0.06;
    float R = R0 * exp(-3.1 * ph) * breathe;
    float outerSpread = smoothstep(0.10, 0.82, clamp(R / uRadius, 0.0, 1.0));
    R *= 1.0 + (fract(aSeed * 19.73) - 0.5) * 0.40 * outerSpread;

    // The wind is derived from radius, so particles sharing an arm retain a
    // single readable spiral as they approach the singularity.
    float radial = clamp(R / uRadius, 0.0, 1.0);
    float armWind = 13.0 * (1.0 - sqrt(radial));
    // Break the outer arms into a more natural field; the scatter vanishes
    // during the final approach so the vortex still resolves at its centre.
    float armScatter = (fract(aSeed * 37.41) - 0.5)
      * 2.70
      * smoothstep(0.08, 0.72, radial);
    float ang = aParams.y
      + armWind
      + armScatter
      + TAU * tt / LOOP_SECONDS;

    vec3 pos;
    pos.x = cos(ang) * R * 1.07;
    pos.z = sin(ang) * R * 0.91;

    // Flatten the final approach so the arms resolve into a clean centre.
    float wave = sin(ang * 3.0 - TAU * 2.0 * tt / LOOP_SECONDS + seedA) * mix(0.018, 0.085, radial);
    float depth = fract(aSeed * 91.7) - 0.5;
    float depthScale = mix(0.14, 0.76, smoothstep(0.10, 0.80, radial));
    pos.y = (depth * depthScale + wave) * uRadius * 0.055;

    return pos;
  }

  // Escaping ember sparks with aerodynamic drift
  vec3 emberSample(float tt, out float fade) {
    float seedA = aSeed * 77.7;
    float phase = fract((tt + seedA * 3.7) / LOOP_SECONDS);
    float duty = 0.34;
    if (phase >= duty) { fade = 0.0; return vec3(0.0); }
    float p = phase / duty;

    float R0 = aParams.x * uRadius;
    float ang0 = aParams.y;
    float R = R0 * (1.0 + 0.28 * p);
    float ang = ang0 + 0.65 * p + TAU * tt / LOOP_SECONDS;

    vec3 pos;
    pos.x = cos(ang) * R;
    pos.z = sin(ang) * R;
    pos.y = mix(0.25, mix(2.2, 3.4, fract(aSeed * 3.7)), p);

    float fl = 0.82 + 0.18 * sin(TAU * 4.0 * tt / LOOP_SECONDS + seedA);
    float fi = smoothstep(0.0, 0.14, p);
    float fo = 1.0 - smoothstep(0.52, 0.92, p);
    fade = fi * fo * fl;
    return pos;
  }

  float alphaAt(vec3 pos, float trail, float fadeIn, float fadeOut, float pulseAmp) {
    float rr = length(pos.xz) / uRadius;
    float edgeFade   = smoothstep(1.08, 0.86, rr);
    // Let the trails fall into a deliberate dark event horizon rather than
    // stacking every additive ribbon on the same few central pixels.
    float horizonFade = smoothstep(0.06, 0.16, rr);
    float trailFade  = pow(1.0 - trail, 1.25);

    float alpha = clamp(0.18 + aParams.z * 0.26, 0.0, 1.0);
    alpha *= fadeIn * fadeOut * edgeFade * horizonFade;
    alpha *= mix(0.60, 1.0, trailFade);

    // Keep the inner orbit leg quieter so the dedicated core flare remains
    // the singular focal point.
    float innerDamp = mix(0.55, 1.0, smoothstep(0.18, 0.55, rr));
    float outer = smoothstep(0.30, 1.0, rr);
    float midFocus = 0.70 + 0.45 * exp(-pow((rr - 0.48) / 0.25, 2.0));
    float outerQuiet = 1.0 - 0.55 * smoothstep(0.68, 1.0, rr);
    alpha *= innerDamp;
    alpha *= midFocus * outerQuiet;
    alpha *= 1.0 - 0.18 * outer;
    alpha *= mix(1.0, 1.25, aOrange);
    alpha *= (1.0 + pulseAmp * 0.8);
    alpha *= uOpacity * uIntro;
    return clamp(alpha, 0.0, 1.0);
  }

  void main() {
    float t = uTime * uSpeedMul;

    float fiA, foA, fiB, foB;
    float pAmpA = 0.0, pAmpB = 0.0;
    vec3 posA;
    vec3 posB;

    if (aEmber > 0.5) {
      posA = emberSample(t - aTrailA * aTrailLen, fiA);
      posB = emberSample(t - aTrailB * aTrailLen, fiB);
      foA = 1.0;
      foB = 1.0;
    } else {
      posA = orbitSample(t - aTrailA * aTrailLen, fiA, foA, pAmpA);
      posB = orbitSample(t - aTrailB * aTrailLen, fiB, foB, pAmpB);
    }

    vec4 clipA = projectionMatrix * (modelViewMatrix * vec4(posA, 1.0));
    vec4 clipB = projectionMatrix * (modelViewMatrix * vec4(posB, 1.0));
    vec2 ndcA = clipA.xy / clipA.w;
    vec2 ndcB = clipB.xy / clipB.w;

    vec2 dir  = ndcB - ndcA;
    vec2 perp = length(dir) > 1e-6 ? normalize(vec2(-dir.y, dir.x)) : vec2(1.0, 0.0);

    vec3 mid = mix(posA, posB, aEnd);
    float rrMid = length(mid.xz) / uRadius;
    float widthMul = aEmber > 0.5
      ? 0.55
      : 1.0 + 0.55 * (1.0 - smoothstep(0.0, 0.55, rrMid));

    float w = mix(clipA.w, clipB.w, aEnd);
    float z = mix(clipA.z, clipB.z, aEnd);
    vec2 xy = mix(ndcA, ndcB, aEnd) + perp * aSide * uLineWidth * widthMul;
    gl_Position = vec4(xy * w, z, w);

    vEdge = aSide;
    float pAmp = mix(pAmpA, pAmpB, aEnd);
    vPulse = pAmp;

    vec3 baseCol = getCleanColor(aOrange, aEmber, pAmp, rrMid);

    if (aEmber > 0.5) {
      float trail = mix(aTrailA, aTrailB, aEnd);
      float fade = mix(fiA, fiB, aEnd);
      vAlpha = clamp(fade * pow(1.0 - trail, 1.2) * 0.95 * uOpacity * uIntro, 0.0, 1.0);
      vColor = baseCol;
    } else {
      float alphaA = alphaAt(posA, aTrailA, fiA, foA, pAmpA);
      float alphaB = alphaAt(posB, aTrailB, fiB, foB, pAmpB);
      vAlpha = mix(alphaA, alphaB, aEnd);
      vColor = baseCol;
    }
  }
`;

export const FIELD_FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec3  vColor;
  varying float vAlpha;
  varying float vEdge;
  varying float vPulse;

  void main() {
    float soft = sqrt(max(1.0 - vEdge * vEdge, 0.0));
    float a = vAlpha * soft;
    if (a < 0.003) discard;

    vec3 outCol = vColor + vec3(0.06, 0.04, 0.02) * (1.0 - abs(vEdge));
    gl_FragColor = vec4(outCol, a);
  }
`;

export const DOT_VERTEX = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntro;
  uniform float uOpacity;
  uniform float uRadius;
  uniform float uSpin;
  uniform float uPixelRatio;
  uniform float uSpeedMul;
  uniform float uHoverPulse;

  attribute float aSeed;
  attribute vec3  aParams;       // x = base radius, y = birth angle, z = size
  attribute vec3  aColor;
  attribute float aSpeed;
  attribute float aThickness;
  attribute float aOrange;

  varying vec3  vColor;
  varying float vAlpha;

  const float TAU = 6.2831853;
  const float LOOP_SECONDS = 36.0;

  vec3 orbitSample(float tt, out float fadeIn, out float fadeOut, out float pulseAmp) {
    float seedA = aSeed * 77.7;
    float ph = fract((tt + seedA) / LOOP_SECONDS);

    fadeIn  = smoothstep(0.0, 0.08, ph);
    fadeOut = 1.0 - smoothstep(0.88, 1.0, ph);

    float R0 = mix(0.36, 1.0, aParams.x) * uRadius;
    float pulseWave = sin(clamp((1.0 - ph) * 8.0 - tt * 4.0, 0.0, 6.2831853));
    pulseAmp = max(0.0, pulseWave) * uHoverPulse;

    float breathe = 1.0 + 0.025 * sin(TAU * tt / LOOP_SECONDS) + pulseAmp * 0.06;
    float R = R0 * exp(-3.1 * ph) * breathe;
    float outerSpread = smoothstep(0.10, 0.82, clamp(R / uRadius, 0.0, 1.0));
    R *= 1.0 + (fract(aSeed * 19.73) - 0.5) * 0.40 * outerSpread;

    float radial = clamp(R / uRadius, 0.0, 1.0);
    float armWind = 13.0 * (1.0 - sqrt(radial));
    float armScatter = (fract(aSeed * 37.41) - 0.5)
      * 3.00
      * smoothstep(0.08, 0.72, radial);
    float ang = aParams.y
      + armWind
      + armScatter
      + TAU * tt / LOOP_SECONDS;

    vec3 pos;
    pos.x = cos(ang) * R * 1.07;
    pos.z = sin(ang) * R * 0.91;

    float wave = sin(ang * 3.0 - TAU * 2.0 * tt / LOOP_SECONDS + seedA) * mix(0.018, 0.085, radial);
    float depth = fract(aSeed * 91.7) - 0.5;
    float depthScale = mix(0.14, 0.76, smoothstep(0.10, 0.80, radial));
    pos.y = (depth * depthScale + wave) * uRadius * 0.055;

    return pos;
  }

  void main() {
    float t = uTime * uSpeedMul;
    float fi, fo, pAmp;
    vec3 pos = orbitSample(t, fi, fo, pAmp);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.8 + aParams.z * 1.3 + pAmp * 1.2) * uPixelRatio;

    float rr = length(pos.xz) / uRadius;
    float edgeFade   = smoothstep(1.08, 0.86, rr);
    // Sparks disappear sooner than ribbons, keeping the event horizon crisp.
    float horizonFade = smoothstep(0.10, 0.20, rr);
    float outer = smoothstep(0.30, 1.0, rr);
    float midFocus = 0.70 + 0.45 * exp(-pow((rr - 0.48) / 0.25, 2.0));
    float outerQuiet = 1.0 - 0.62 * smoothstep(0.68, 1.0, rr);

    float alpha = clamp(0.26 + aParams.z * 0.26, 0.0, 1.0);
    alpha *= fi * fo * edgeFade * horizonFade;
    alpha *= mix(0.40, 1.0, smoothstep(0.24, 0.62, rr)) * midFocus * outerQuiet;
    alpha *= 1.0 - 0.20 * outer;
    alpha *= mix(1.0, 1.25, aOrange);
    alpha *= (1.0 + pAmp * 0.8);
    alpha *= uOpacity * uIntro;

    float orangeMix = aOrange * (1.0 - smoothstep(0.45, 0.78, rr));
    vec3 col = mix(vec3(0.965, 0.955, 0.935), vec3(1.0, 0.416, 0.239), orangeMix);
    col = mix(col, vec3(1.0, 1.0, 1.0), smoothstep(0.35, 0.0, rr) * 0.4 + pAmp * 0.4);

    vColor = col;
    vAlpha = clamp(alpha, 0.0, 1.0);
  }
`;

export const DOT_FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float soft = smoothstep(0.5, 0.0, d);
    float a = vAlpha * soft;
    if (a < 0.003) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

export const PLANE_VERTEX = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const PLANE_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uIntro;
  uniform float uSpeedMul;

  varying vec2 vUv;

  const float TAU = 6.2831853;
  const float LOOP_SECONDS = 36.0;

  void main() {
    vec2 c = vUv - 0.5;
    float r = length(c) * 2.0;
    float t = uTime * uSpeedMul;
    float d = 1.0 - smoothstep(0.0, 1.0, r);
    float angle = atan(c.y, c.x);
    float spiralMist = 0.56 + 0.44 * sin(angle * 6.0 - r * 15.0 - TAU * t / LOOP_SECONDS);
    float diffuse = exp(-r * r * 2.8) * smoothstep(0.08, 0.30, r);
    float haze = diffuse * spiralMist * 0.030;
    float a = (d * d * 0.006 + haze) * uOpacity * uIntro;
    if (a < 0.001) discard;
    vec3 hazeColor = mix(vec3(1.0, 0.416, 0.239), vec3(0.96, 0.95, 0.92), 0.62 + 0.20 * spiralMist);
    gl_FragColor = vec4(hazeColor, a);
  }
`;

export const GLOW_VERTEX = PLANE_VERTEX;

export const GLOW_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uOpacity;
  uniform float uIntro;
  uniform float uSpeedMul;
  uniform float uHoverPulse;

  varying vec2 vUv;

  const float TAU = 6.2831853;
  const float LOOP_SECONDS = 36.0;

  void main() {
    vec2 c = vUv - 0.5;
    float r = length(c) * 2.0;
    float t = uTime * uSpeedMul;
    float pulse = 0.84 + 0.16 * sin(TAU * t / LOOP_SECONDS) + uHoverPulse * 0.45;
    float ring = exp(-pow(r - 0.24, 2.0) * 95.0);
    float halo = exp(-r * r * 15.0);

    // A narrow accretion ring frames the dark singularity without washing it out.
    vec3 bloomCol = mix(vec3(1.0, 0.416, 0.239), vec3(1.0, 0.96, 0.94), ring * 0.65 + halo * 0.15);
    float a = (ring * 0.16 + halo * 0.018) * pulse * uOpacity * uIntro;
    if (a < 0.002) discard;
    gl_FragColor = vec4(bloomCol, a);
  }
`;

export const DEPTH_VERTEX = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uIntro;
  uniform float uOpacity;
  uniform float uPixelRatio;
  uniform float uSpeedMul;

  attribute float aSeed;
  attribute float aSize;
  attribute float aOpacity;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;

  const float TAU = 6.2831853;
  const float LOOP_SECONDS = 36.0;

  void main() {
    float t = uTime * uSpeedMul;
    float cycles = 1.0 + floor(fract(aSeed * 9.7) * 2.0);
    float phase = TAU * cycles * t / LOOP_SECONDS + aSeed * TAU;
    vec3 point = position;
    point.x += cos(phase) * 0.18;
    point.z += sin(phase) * 0.18;
    point.y += sin(phase * 2.0) * 0.10;

    vec4 mv = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (0.88 + 0.12 * sin(phase)) * uPixelRatio;
    vColor = aColor;
    vAlpha = aOpacity * uOpacity * uIntro;
  }
`;

export const DEPTH_FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = vAlpha * smoothstep(0.5, 0.0, d);
    if (a < 0.002) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

export const STARS_VERTEX = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform float uIntro;
  uniform float uSpeedMul;

  attribute float aSeed;
  attribute float aSize;
  attribute vec3  aColor;

  varying vec3  vColor;
  varying float vTw;

  const float TAU = 6.2831853;
  const float LOOP_SECONDS = 36.0;

  void main() {
    float t = uTime * uSpeedMul;

    // Subtle vortex-centered orbit: stars slowly circle the singularity
    float vortexOrbit = sin(TAU * t / (LOOP_SECONDS * 3.0) + aSeed * 0.3);
    float orbitRadius = 0.02 * vortexOrbit;
    float orbitAngle = TAU * t / (LOOP_SECONDS * 4.0) + aSeed * 0.7;
    vec3 point = position;
    point.x += cos(orbitAngle) * orbitRadius;
    point.z += sin(orbitAngle) * orbitRadius;

    vec4 mv = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio;

    float cycles = 1.0 + floor(fract(aSeed * 7.0) * 4.0);
    float tw = 0.55 + 0.45 * sin(TAU * cycles * t / LOOP_SECONDS + aSeed * 20.0);
    vTw = tw;
    vColor = aColor;
  }
`;

export const STARS_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uOpacity;
  uniform float uIntro;

  varying vec3  vColor;
  varying float vTw;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.5, 0.0, d);
    float a = vTw * core * uOpacity * uIntro;
    if (a < 0.003) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

/**
 * Singularity Core Flare
 */
export const CORE_VERTEX = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uOpacity;
  uniform float uIntro;
  uniform float uSpeedMul;
  uniform float uHoverPulse;

  varying float vA;
  varying float vPulse;

  const float TAU = 6.2831853;
  const float LOOP_SECONDS = 36.0;

  void main() {
    float t = uTime * uSpeedMul;
    float pulse = 0.85 + 0.15 * sin(TAU * t / LOOP_SECONDS) + uHoverPulse * 0.6;
    vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (4.0 + 1.0 * pulse) * uPixelRatio;
    vA = uOpacity * uIntro * (0.72 + 0.28 * pulse);
    vPulse = pulse;
  }
`;

export const CORE_FRAGMENT = /* glsl */ `
  precision highp float;

  varying float vA;
  varying float vPulse;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float core = smoothstep(0.5, 0.0, d);
    float a = vA * core * core;
    if (a < 0.003) discard;

    // Diamond white-hot core bleeding into signature Vortex Orange
    vec3 col = mix(vec3(1.0, 0.416, 0.239), vec3(1.0, 0.98, 0.95), core * 0.85);
    gl_FragColor = vec4(col, a);
  }
`;
