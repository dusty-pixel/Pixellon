import { useEffect, useState } from 'react'
import { motion, useMotionTemplate, useSpring, useTransform } from 'framer-motion'
import { usePointer } from '../../motion/MotionProvider'

/**
 * Pixellon custom cursor: small core + trailing ring.
 * States derived from hovered element: link / button / card / disabled.
 * Renders only on fine-pointer interactive setups; otherwise returns null.
 */
function resolveState(el) {
  if (!el || !el.closest) return 'default'
  if (el.closest('[data-cursor="game"]')) return 'game'
  if (el.closest('[disabled], [aria-disabled="true"]')) return 'disabled'
  if (el.closest('a, [data-cursor="link"]')) return 'link'
  if (el.closest('button, [role="button"], [data-cursor="button"]')) return 'button'
  if (el.closest('[data-cursor="drag"]')) return 'drag'
  return 'default'
}

const RING = {
  default: { scale: 1, opacity: 0.7, border: 'rgba(0,210,255,0.5)' },
  link: { scale: 1.5, opacity: 0.9, border: 'rgba(0,210,255,0.9)' },
  button: { scale: 1.8, opacity: 1, border: 'rgba(0,210,255,1)' },
  game: { scale: 2.1, opacity: 1, border: 'rgba(56,189,248,0.9)' },
  drag: { scale: 1.6, opacity: 0.9, border: 'rgba(148,163,184,0.9)' },
  disabled: { scale: 0.8, opacity: 0.3, border: 'rgba(100,116,139,0.6)' },
}

export default function Cursor() {
  const { x, y, velX, interactive } = usePointer()
  const [state, setState] = useState('default')
  const [pressed, setPressed] = useState(false)

  const rx = useSpring(x, { stiffness: 220, damping: 24, mass: 0.7 })
  const ry = useSpring(y, { stiffness: 220, damping: 24, mass: 0.7 })
  const speed = useTransform([velX], ([v]) => Math.min(Math.abs(v) / 40, 1))
  const stretchX = useTransform(speed, (s) => 1 + s * 0.35)

  useEffect(() => {
    if (!interactive) return
    document.body.classList.add('has-custom-cursor')
    const onOver = (e) => setState(resolveState(e.target))
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [interactive])

  const ringX = useMotionTemplate`${rx}px`
  const ringY = useMotionTemplate`${ry}px`
  const dotX = useMotionTemplate`${x}px`
  const dotY = useMotionTemplate`${y}px`

  if (!interactive) return null
  const cfg = RING[state] || RING.default

  return (
    <>
      {/* core dot — exact pointer position */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5"
        style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}
      >
        <div className="h-full w-full rounded-[2px] bg-brand-accent shadow-[0_0_8px_rgba(0,210,255,0.9)]" />
      </motion.div>
      {/* trailing ring — reacts to state + speed */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="h-full w-full rounded-full border"
          animate={{
            scale: cfg.scale * (pressed ? 0.82 : 1),
            opacity: cfg.opacity,
            borderColor: cfg.border,
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 24 }}
          style={{ scaleX: stretchX }}
        />
      </motion.div>
    </>
  )
}
