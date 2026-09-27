import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { SPRING, DURATION } from '../../motion/tokens'
import { usePointer } from '../../motion/MotionProvider'
import { sound } from '../../motion/sound'

/**
 * Magnetic button — drifts toward the cursor within a small radius,
 * compresses on press, springs back on release. Optional pixel burst on click.
 */
export default function MagneticButton({
  to,
  href,
  onClick,
  children,
  className = '',
  strength = 0.28,
  burst = true,
  soundName = 'click',
  ...rest
}) {
  const ref = useRef(null)
  const { interactive } = usePointer()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, SPRING.button)
  const sy = useSpring(my, SPRING.button)
  const [burstKey, setBurstKey] = useState(0)

  const handleMove = (e) => {
    if (!interactive || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) * strength)
    my.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }
  const handleClick = (e) => {
    sound.play(soundName)
    if (burst) setBurstKey((k) => k + 1)
    onClick?.(e)
  }

  const Tag = to ? Link : href ? 'a' : 'button'
  const tagProps = to ? { to } : href ? { href } : { type: 'button' }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: interactive ? sx : 0, y: interactive ? sy : 0, display: 'inline-block' }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: DURATION.fast }}
      className="relative inline-block"
    >
      <Tag
        {...tagProps}
        {...rest}
        onClick={handleClick}
        className={`relative inline-flex items-center justify-center overflow-visible ${className}`}
      >
        {children}
        {burst && burstKey > 0 && <Burst key={burstKey} />}
      </Tag>
    </motion.span>
  )
}

/** Tiny pixel-square burst emitted on click. */
function Burst() {
  const bits = [0, 1, 2, 3, 4, 5, 6, 7]
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {bits.map((i) => {
        const angle = (i / bits.length) * Math.PI * 2
        return (
          <motion.span
            key={i}
            className="absolute h-1 w-1 bg-brand-accent"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * 26,
              y: Math.sin(angle) * 26,
              opacity: 0,
              scale: 0.4,
            }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          />
        )
      })}
    </span>
  )
}
