/**
 * catAnimations — the clip library.
 *
 * A clip is a named, timed animation that writes pose intent over its lifetime.
 * `update(t, api)` runs every frame with t = 0..1 progress:
 *   api.set()   — lerped targets (smooth limbs, head, ears)
 *   api.snap()  — immediate values (blinks: pixel art should not fade)
 *
 * Clips are pose-driven today; when a real sprite sheet lands, add matching frame
 * lists to CatRenderer.setSpriteSheet() and the same names blit instead.
 */
import { pulse, easeInOut, easeOut, chance } from './catRandom.js';

const clip = (name, dur, weight, update, rare = false) => ({ name, dur, weight, update, rare });

/** Gestures the idle brain can pick from. Weight ≈ relative frequency. */
export const GESTURES = [
  clip('blink', 200, 20, (t, api) => api.snap({ eyeOpen: t < 0.55 ? 0 : 1 })),

  clip('doubleBlink', 520, 10, (t, api) => {
    const closed = (t > 0.05 && t < 0.28) || (t > 0.45 && t < 0.68);
    api.snap({ eyeOpen: closed ? 0 : 1 });
  }),

  clip('earTwitch', 460, 12, (t, api) => {
    const p = pulse(t);
    api.set({ earR: p * 0.9, earL: p * 0.3 });
  }),

  clip('tailFlick', 700, 12, (t, api) => {
    api.set({ tailWave: 0.35 + pulse(t) * 0.9, tailUp: 0.25 + pulse(t) * 0.35 });
  }),

  clip('tailWag', 2200, 7, (t, api) => {
    api.set({ tailWave: 0.4 + Math.sin(t * Math.PI) * 0.8, tailUp: 0.45 });
  }),

  clip('headTilt', 1500, 10, (t, api) => {
    const p = pulse(t);
    api.set({ tilt: p * 0.95, earL: p * 0.4, earR: -p * 0.3, headX: p * 0.6 });
  }),

  clip('lookLeft', 1600, 9, (t, api) => {
    const p = pulse(t);
    api.set({ lookX: -p, headX: -p * 2, earL: -p * 0.2, lean: -p * 0.4 });
  }),

  clip('lookRight', 1600, 9, (t, api) => {
    const p = pulse(t);
    api.set({ lookX: p, headX: p * 2, earR: p * 0.2, lean: p * 0.4 });
  }),

  clip('lookUp', 1500, 6, (t, api) => {
    const p = pulse(t);
    api.set({ lookY: -p, headY: -p * 1.6, earL: p * 0.3, earR: p * 0.3 });
  }),

  clip('lookBehind', 1900, 5, (t, api) => {
    const p = pulse(t);
    api.set({ faceAway: p > 0.5 ? 1 : 0, headX: -p * 2.5, tailUp: 0.4, lean: -p * 0.6 });
  }),

  clip('lickPaw', 2600, 8, (t, api) => {
    const hold = Math.min(1, t * 4);
    const lick = Math.sin(t * Math.PI * 6) * 0.5 + 0.5;
    api.set({
      sit: hold,
      pawUp: hold * 0.9,
      pawReach: hold * 0.3,
      headY: hold * (1.4 + lick * 0.8),
      tilt: -0.3 * hold,
    });
    api.snap({ eyeOpen: lick > 0.7 ? 0.5 : 1 });
  }),

  clip('cleanFace', 3000, 6, (t, api) => {
    const hold = Math.min(1, t * 4);
    const swipe = Math.sin(t * Math.PI * 5);
    api.set({
      sit: hold,
      pawUp: hold,
      pawReach: hold * 0.5,
      headY: hold * 1.2,
      tilt: swipe * 0.6,
      earL: -0.2,
    });
    api.snap({ eyeOpen: 0.5 });
  }),

  clip('stretch', 2400, 7, (t, api) => {
    const p = easeInOut(Math.min(1, t * 1.6)) * (1 - Math.max(0, (t - 0.7) / 0.3));
    api.set({ stretch: p, tailUp: 0.2 + p * 0.7, headY: p * 1.5, earL: -p * 0.4, earR: -p * 0.4 });
    api.snap({ eyeOpen: p > 0.5 ? 0.4 : 1 });
  }),

  clip('yawn', 1800, 6, (t, api) => {
    const p = pulse(t);
    api.set({ headY: -p * 1.4, tilt: p * 0.2, earL: -p * 0.5, earR: -p * 0.5 });
    api.snap({ eyeOpen: p > 0.35 ? 0 : 1 });
  }),

  clip('scratchEar', 2100, 5, (t, api) => {
    const hold = Math.min(1, t * 5);
    const shake = Math.sin(t * Math.PI * 12);
    api.set({
      sit: hold,
      pawUp: hold * 1,
      headY: hold * 0.8,
      tilt: -0.5 * hold + shake * 0.25,
      earR: -0.5 + shake * 0.4,
    });
    api.snap({ eyeOpen: 0.5 });
  }),

  clip('crouch', 1700, 7, (t, api) => {
    const p = pulse(t);
    api.set({ crouch: p, earL: -p * 0.5, earR: -p * 0.5, tailWave: 0.5 + p * 0.5, headY: p * 0.6 });
  }),

  clip('tinyHop', 620, 6, (t, api) => {
    const up = Math.sin(t * Math.PI);
    api.set({
      bob: -up * 4,
      squash: t < 0.15 ? 0.8 : t > 0.85 ? 0.6 : -0.5,
      tailUp: 0.3 + up * 0.5,
      earL: up * 0.4,
      earR: up * 0.4,
    });
  }),

  clip('pawAtNothing', 1400, 6, (t, api) => {
    const swipe = Math.sin(t * Math.PI * 3);
    api.set({ pawUp: Math.abs(swipe), pawReach: Math.max(0, swipe), lean: swipe * 0.5, tilt: 0.3 });
  }),

  clip('shakeBody', 900, 5, (t, api) => {
    const shake = Math.sin(t * Math.PI * 14) * (1 - t);
    api.set({ lean: shake, tilt: shake * 0.7, earL: shake, earR: -shake, tailWave: 0.9 });
  }),

  clip('loaf', 4200, 6, (t, api) => {
    const settle = Math.min(1, t * 3) * (1 - Math.max(0, (t - 0.85) / 0.15));
    api.set({ loaf: settle, tailWave: 0.15, tailUp: 0.05, earL: -0.15, earR: -0.15 });
    api.snap({ eyeOpen: settle > 0.6 ? 0.5 : 1 });
  }),

  clip('sniffGround', 1900, 6, (t, api) => {
    const p = pulse(t);
    const sniff = Math.sin(t * Math.PI * 9) * 0.4;
    api.set({ headY: p * (2.2 + sniff), crouch: p * 0.4, lookY: p * 0.8, tailUp: 0.3 + p * 0.3 });
  }),

  /* ── rarities ─────────────────────────────────────────────── */
  clip(
    'tailChase',
    2600,
    2,
    (t, api) => {
      const spin = Math.sin(t * Math.PI * 3);
      api.set({
        faceAway: Math.abs(spin) > 0.75 ? 1 : 0,
        headX: -spin * 2.5,
        lean: -spin,
        tailWave: 1,
        tailUp: 0.6,
        crouch: 0.3,
        pawUp: Math.max(0, spin) * 0.6,
      });
    },
    true,
  ),

  clip(
    'startled',
    1200,
    2,
    (t, api) => {
      const jolt = Math.max(0, 1 - t * 2.2);
      api.set({
        bob: -jolt * 5,
        squash: -jolt,
        earL: -1,
        earR: -1,
        tailUp: 0.2 + jolt * 0.8,
        tailWave: 1,
        crouch: t > 0.5 ? 0.7 : 0,
      });
      api.snap({ eyeOpen: 1 });
    },
    true,
  ),
];

export const CLIPS = Object.fromEntries(GESTURES.map((g) => [g.name, g]));

/** Extra clips the behavior machine plays directly (not idle-pickable). */
export const BEHAVIOR_CLIPS = {
  /** Look left, then right — used on entry and before walking off. */
  scan: clip('scan', 2400, 0, (t, api) => {
    const dir = Math.sin(t * Math.PI * 2);
    api.set({ lookX: dir, headX: dir * 2, tilt: dir * 0.3, earL: -dir * 0.2, earR: dir * 0.2 });
    if (chance(0.01)) api.snap({ eyeOpen: 0 });
    else api.snap({ eyeOpen: 1 });
  }),

  /** Crouch + wiggle before a pounce. */
  windUp: clip('windUp', 900, 0, (t, api) => {
    api.set({
      crouch: 0.4 + easeOut(t) * 0.6,
      tailWave: 0.6 + t * 0.9,
      tailUp: 0.5,
      earL: 0.6,
      earR: 0.6,
      lean: Math.sin(t * Math.PI * 8) * 0.35,
      headY: 0.8,
    });
  }),

  /** Paw swipe at the end of a pounce. */
  swipe: clip('swipe', 520, 0, (t, api) => {
    const s = Math.sin(t * Math.PI);
    api.set({ pawUp: s * 1.1, pawReach: s, lean: s * 0.8, tilt: 0.4, earL: 0.5, earR: 0.5 });
  }),

  /** Held sleep pose — breathing comes from the renderer. */
  sleeping: clip('sleep', 1e9, 0, (t, api) => {
    api.set({ loaf: 1, sleep: 1, tailWave: 0.08, tailUp: 0, earL: -0.2, earR: -0.2 });
  }),

  /** Held sit pose. */
  sitting: clip('sit', 1e9, 0, (t, api) => {
    api.set({ sit: 1, tailWave: 0.3, tailUp: 0.1 });
  }),

  /** Peeking: only the eyes move, body stays still and low. */
  peekLook: clip('peek', 1e9, 0, (t, api) => {
    api.set({ earL: 0.3, earR: 0.3, crouch: 0.5, tailWave: 0.2, tailUp: 0 });
  }),
};

export default GESTURES;
