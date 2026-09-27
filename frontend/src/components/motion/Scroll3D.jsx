import { useMemo, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePointer } from '../../motion/MotionProvider'

/**
 * Scroll-driven 3D primitives. Pure CSS-3D + motion values (no WebGL),
 * so they stay cheap at any count.
 */

function Cube({ size, spin, spinY, tone }) {
  const s = size / 2
  const face = {
    position: 'absolute',
    inset: 0,
    border: '1px solid rgba(0,210,255,0.35)',
    background: tone,
  }
  return (
    <motion.span
      aria-hidden
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'block',
        transformStyle: 'preserve-3d',
        rotateX: spin,
        rotateY: spinY,
      }}
    >
      <span style={{ ...face, transform: `translateZ(${s}px)` }} />
      <span style={{ ...face, transform: `rotateY(180deg) translateZ(${s}px)`, opacity: 0.7 }} />
      <span style={{ ...face, transform: `rotateY(90deg) translateZ(${s}px)`, opacity: 0.85 }} />
      <span style={{ ...face, transform: `rotateY(-90deg) translateZ(${s}px)`, opacity: 0.85 }} />
      <span style={{ ...face, transform: `rotateX(90deg) translateZ(${s}px)`, opacity: 0.6 }} />
      <span style={{ ...face, transform: `rotateX(-90deg) translateZ(${s}px)`, opacity: 0.6 }} />
    </motion.span>
  )
}

/**
 * A tumbling row of voxel cubes. Scroll the divider through the
 * viewport and the cubes roll — each at its own rate for depth.
 */
export function VoxelDivider({ count = 12, flip = false, className = '' }) {
  const ref = useRef(null)
  const { reduced, motionMode } = usePointer()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const cubes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        size: 14 + ((i * 37) % 3) * 8,
        turns: (flip ? -1 : 1) * (0.6 + ((i * 53) % 5) * 0.35),
        tone: i % 3 === 0 ? 'rgba(2,132,199,0.28)' : i % 3 === 1 ? 'rgba(0,210,255,0.16)' : 'rgba(56,189,248,0.22)',
        rise: ((i * 29) % 7) * 4 - 12,
      })),
    [count, flip],
  )

  if (reduced || motionMode === 'low') {
    return (
      <div aria-hidden className={`flex items-center gap-6 overflow-hidden py-2 opacity-60 ${className}`}>
        {cubes.map((c, i) => (
          <span key={i} className="block rounded-[3px] border border-brand-primary/30 bg-brand-primary/15" style={{ width: c.size, height: c.size }} />
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} aria-hidden className={`flex items-center gap-6 overflow-hidden py-4 ${className}`} style={{ perspective: 600 }}>
      {cubes.map((c, i) => (
        <CubeRow
          key={i}
          cube={c}
          progress={scrollYProgress}
          offset={c.rise}
        />
      ))}
    </div>
  )
}

function CubeRow({ cube, progress, offset }) {
  const deg = useTransform(progress, [0, 1], [0, 360 * cube.turns])
  const degY = useTransform(progress, [0, 1], [0, 180 * cube.turns])
  const y = useTransform(progress, [0, 1], [offset, -offset])
  return (
    <motion.span style={{ y, display: 'block' }}>
      <Cube size={cube.size} spin={deg} spinY={degY} tone={cube.tone} />
    </motion.span>
  )
}

/**
 * Scroll parallax wrapper — content drifts slower/faster than the page
 * with a whisper of perspective tilt. For hero + banner depth.
 */
export function ParallaxRise({ children, className = '', amount = 36, tilt = 0 }) {
  const ref = useRef(null)
  const { reduced, motionMode } = usePointer()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount])
  const rotateX = useTransform(scrollYProgress, [0, 1], [tilt, -tilt])

  if (reduced || motionMode === 'low') return <div className={className}>{children}</div>

  return (
    <motion.div ref={ref} style={{ y, rotateX, transformPerspective: 900 }} className={className}>
      {children}
    </motion.div>
  )
}
