import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { CARD_TILT, SPRING } from '../../motion/tokens'
import { usePointer } from '../../motion/MotionProvider'

/**
 * ParallaxCard — tactile hover wrapper with layered depth:
 * container tilts (max ~4deg), image layer shifts more than foreground,
 * specular highlight follows the cursor. Static on touch / reduced motion.
 */
export default function ParallaxCard({ children, className = '', glow = true }) {
  const ref = useRef(null)
  const { interactive } = usePointer()

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const tiltX = useTransform(py, [0, 1], [CARD_TILT.maxRotate, -CARD_TILT.maxRotate])
  const tiltY = useTransform(px, [0, 1], [-CARD_TILT.maxRotate, CARD_TILT.maxRotate])
  const shiftXRaw = useTransform(px, [0, 1], [-CARD_TILT.maxShift, CARD_TILT.maxShift])
  const shiftYRaw = useTransform(py, [0, 1], [-CARD_TILT.maxShift, CARD_TILT.maxShift])
  const rX = useSpring(tiltX, SPRING.card)
  const rY = useSpring(tiltY, SPRING.card)
  const shX = useSpring(shiftXRaw, SPRING.card)
  const shY = useSpring(shiftYRaw, SPRING.card)
  const glareX = useTransform(px, (v) => v * 100)
  const glareY = useTransform(py, (v) => v * 100)
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0,210,255,0.16), transparent 65%)`

  const onMove = (e) => {
    if (!interactive || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set(Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1))
    py.set(Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1))
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={interactive ? { perspective: CARD_TILT.perspective } : undefined}
      className={className}
    >
      <motion.div
        style={
          interactive
            ? { rotateX: rX, rotateY: rY, x: shX, y: shY, transformStyle: 'preserve-3d' }
            : undefined
        }
        className="relative h-full w-full"
      >
        {children}
        {glow && interactive && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
            style={{ background: glare }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
