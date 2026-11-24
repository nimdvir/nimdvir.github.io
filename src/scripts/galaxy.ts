/*
 * Galaxy background — adapted from React Bits "Galaxy" (https://www.reactbits.dev/backgrounds/galaxy)
 * Copyright (c) 2026 David Haz. MIT + Commons Clause License Condition v1.0.
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, and distribute the Software as part of an application, website,
 * or product, subject to the following conditions: The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software. Commons Clause Restriction: you may use this
 * Software, including for any commercial purpose, so long as you do not sell, sublicense, or redistribute the
 * components themselves, whether alone, in a bundle, or as a ported version.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 *
 * Dima Publishing changes: plain TypeScript instead of React, a warm `uTint` so stars read as champagne gold,
 * a transparent light mode for the paper pages, window-level pointer tracking, and rendering that pauses
 * off-screen, in background tabs and for visitors who prefer reduced motion.
 */
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform float uLightMode;
uniform vec3 uTint;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }
float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}
float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}
vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;
      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));
      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
      float star = Star(gv - offset - pad, flareSize);
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      col += star * size * base;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uAutoCenterRepulsion > 0.0) {
    float centerDist = length(uv);
    vec2 repulsion = normalize(uv) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    uv += mouseNorm * 0.1 * uMouseActiveFactor;
  }

  float a = uTime * uRotationSpeed;
  uv = mat2(cos(a), -sin(a), sin(a), cos(a)) * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }
  col *= uTint;

  if (uLightMode > 0.5) {
    // Ink-on-paper: dark gold specks with alpha, so the page color shows through.
    float energy = max(max(col.r, col.g), col.b);
    float coverage = clamp(smoothstep(0.0, 0.42, energy) * 0.92, 0.0, 0.92);
    gl_FragColor = vec4(clamp(col * 0.48, 0.0, 0.82), coverage);
  } else {
    float alpha = smoothstep(0.0, 0.3, length(col));
    gl_FragColor = vec4(col, min(alpha, 1.0));
  }
}
`;

type Options = {
  density: number;
  glowIntensity: number;
  saturation: number;
  hueShift: number;
  twinkleIntensity: number;
  rotationSpeed: number;
  starSpeed: number;
  speed: number;
  repulsionStrength: number;
  mouse: boolean;
  light: boolean;
  tint: [number, number, number];
  fps: number;
};

const defaults: Options = {
  density: 1,
  glowIntensity: 0.3,
  saturation: 0,
  hueShift: 140,
  twinkleIntensity: 0.3,
  rotationSpeed: 0.1,
  starSpeed: 0.5,
  speed: 1,
  repulsionStrength: 2,
  mouse: true,
  light: false,
  tint: [1, 1, 1],
  fps: 60,
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover)').matches;

function mount(el: HTMLElement) {
  const o: Options = { ...defaults, ...JSON.parse(el.dataset.galaxy || '{}') };

  let renderer: Renderer;
  try {
    renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(window.devicePixelRatio, 1.5) });
  } catch {
    return; // No WebGL: the section keeps its plain background.
  }
  const gl = renderer.gl;
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const program = new Program(gl, {
    vertex,
    fragment,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new Color(1, 1, 1) },
      uFocal: { value: new Float32Array([0.5, 0.5]) },
      uRotation: { value: new Float32Array([1, 0]) },
      uStarSpeed: { value: o.starSpeed },
      uDensity: { value: o.density },
      uHueShift: { value: o.hueShift },
      uSpeed: { value: o.speed },
      uMouse: { value: new Float32Array([0.5, 0.5]) },
      uGlowIntensity: { value: o.glowIntensity },
      uSaturation: { value: o.saturation },
      uMouseRepulsion: { value: true },
      uTwinkleIntensity: { value: o.twinkleIntensity },
      uRotationSpeed: { value: o.rotationSpeed },
      uRepulsionStrength: { value: o.repulsionStrength },
      uMouseActiveFactor: { value: 0 },
      uAutoCenterRepulsion: { value: 0 },
      uLightMode: { value: o.light ? 1 : 0 },
      uTint: { value: new Float32Array(o.tint) },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
  gl.canvas.setAttribute('aria-hidden', 'true');
  el.appendChild(gl.canvas);

  const resize = () => {
    renderer.setSize(el.offsetWidth, el.offsetHeight);
    program.uniforms.uResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
  };
  new ResizeObserver(resize).observe(el);
  resize();

  // Pointer: track on the window so content above the canvas doesn't block it.
  const target = { x: 0.5, y: 0.5, active: 0 };
  const smooth = { x: 0.5, y: 0.5, active: 0 };
  if (o.mouse && canHover && !reduceMotion) {
    window.addEventListener(
      'pointermove',
      (e) => {
        const r = el.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        target.active = inside ? 1 : 0;
        if (inside) {
          target.x = (e.clientX - r.left) / r.width;
          target.y = 1 - (e.clientY - r.top) / r.height;
        }
      },
      { passive: true },
    );
  }

  // Start at a random moment so every section shows a different sky.
  const t0 = performance.now() - Math.random() * 20000;
  const frameGap = 1000 / o.fps;
  let raf = 0;
  let last = 0;
  let visible = false;

  const draw = (now: number) => {
    const t = (now - t0) * 0.001;
    program.uniforms.uTime.value = t;
    program.uniforms.uStarSpeed.value = (t * o.starSpeed) / 10;
    smooth.x += (target.x - smooth.x) * 0.05;
    smooth.y += (target.y - smooth.y) * 0.05;
    smooth.active += (target.active - smooth.active) * 0.05;
    program.uniforms.uMouse.value[0] = smooth.x;
    program.uniforms.uMouse.value[1] = smooth.y;
    program.uniforms.uMouseActiveFactor.value = smooth.active;
    renderer.render({ scene: mesh });
  };

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (now - last < frameGap) return;
    last = now;
    draw(now);
  };
  const start = () => {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  if (reduceMotion) {
    draw(performance.now());
    return;
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? start() : stop();
  }).observe(el);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  el.classList.add('is-live');
}

document.querySelectorAll<HTMLElement>('[data-galaxy]').forEach(mount);
