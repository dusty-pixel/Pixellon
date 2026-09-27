/**
 * Pixellon motion system — centralized tokens.
 * Every animation in the arena references these values so motion
 * stays coherent instead of a collection of arbitrary durations.
 */

export const DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.6,
  cinematic: 0.9,
}

export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  snap: [0.34, 1.3, 0.64, 1],
}

export const SPRING = {
  soft: { type: 'spring', stiffness: 120, damping: 20, mass: 0.6 },
  button: { type: 'spring', stiffness: 400, damping: 22, mass: 0.5 },
  card: { type: 'spring', stiffness: 260, damping: 24, mass: 0.7 },
  camera: { type: 'spring', stiffness: 60, damping: 18, mass: 1 },
}

/** Card tilt limits — tactile, never dramatic. */
export const CARD_TILT = {
  maxRotate: 4, // degrees
  maxShift: 7, // px
  perspective: 900,
}

/** Shared reveal variants for scroll sections. */
export const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASE.out } },
  },
  maskLine: {
    hidden: { y: '110%' },
    show: { opacity: 1, y: '0%', transition: { duration: DURATION.slow, ease: EASE.out } },
  },
  staggerParent: (stagger = 0.07, delay = 0) => ({
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }),
  staggerChild: {
    hidden: { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASE.out } },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 1.05 },
    show: { opacity: 1, scale: 1, transition: { duration: DURATION.slow, ease: EASE.out } },
  },
}
