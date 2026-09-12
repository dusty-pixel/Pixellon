/** Randomness helpers — keeps Math.random() out of the behavior code. */

export const randomBetween = (min, max) => min + Math.random() * (max - min);

export const randomInt = (min, max) => Math.floor(randomBetween(min, max + 1));

/** chance(0.2) → true 20% of the time. */
export const chance = (p) => Math.random() < p;

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const randomSign = () => (Math.random() < 0.5 ? -1 : 1);

/** randomDelay(1000, 4000) → ms, for timers. */
export const randomDelay = (min, max) => Math.round(randomBetween(min, max));

/**
 * weightedRandom({ walk: 30, sit: 10 }) → key, or
 * weightedRandom([{ name, weight }]) → the item.
 */
export function weightedRandom(source) {
  const entries = Array.isArray(source)
    ? source.map((item) => [item, item.weight ?? 1])
    : Object.entries(source);
  let total = 0;
  for (const [, weight] of entries) total += weight;
  let roll = Math.random() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

export const lerp = (a, b, t) => a + (b - a) * t;

/** Frame-rate independent lerp: `t` is the per-60fps-frame factor. */
export const damp = (a, b, t, dt) => lerp(a, b, 1 - Math.pow(1 - t, dt * 60));

export const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);

export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export const easeIn = (t) => t * t;

/** 0 → 1 → 0 */
export const pulse = (t) => Math.sin(Math.PI * clamp(t, 0, 1));
