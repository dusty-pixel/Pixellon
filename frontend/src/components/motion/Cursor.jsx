import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { usePointer } from '../../motion/MotionProvider'

/**
 * Pixellon reticle cursor: diamond-sight core + slow-orbit dashed ring.
 * States derived from hovered element: link / button / game / drag / disabled.
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
  default: { scale: 1, opacity: 0.75, color: 'rgba(0,210,255,0.55)' },
  link: { scale: 1.45, opacity: 0.95, color: 'rgba(0,210,255,0.9)' },
  button: { scale: 1.7, opacity: 1, color: 'rgba(0,210,255,1)' },
  game: { scale: 2, opacity: 1, color: 'rgba(251,191,36,0.9)' },
  drag: { scale: 1.5, opacity: 0.9, color: 'rgba(148,163,184,0.9)' },
  disabled: { scale: 0.75, opacity: 0.3, color: 'rgba(100,116,139,0.6)' },
}

export default function Cursor() {
  const { x, y, velX, interactive } = usePointer()
  const [state, setState] = useState('default')
  const [pressed, setPressed] = useState(false)

  const rx = useSpring(x, { stiffness: 200, damping: 23, mass: 0.8 })
  const ry = useSpring(y, { stiffness: 200, damping: 23, mass: 0.8 })
  const speed = useTransform([velX], ([v]) => Math.min(Math.abs(v) / 40, 1))
  const stretchX = useTransform(speed, (s) => 1 + s * 0.3)

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

  if (!interactive) return null
  const cfg = RING[state] || RING.default

  return (
    <>
      {/* reticle core — exact pointer position */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100]"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="relative flex h-4 w-4 items-center justify-center"
          animate={{ scale: pressed ? 0.75 : 1, rotate: state === 'game' ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        >
          <span
            className="absolute inset-0 rotate-45 border-2 transition-colors"
            style={{ borderColor: cfg.color }}
          />
          <span className="h-1 w-1 rounded-full bg-white shadow-[0_0_6px_rgba(0,210,255,1)]" />
        </motion.div>
      </motion.div>
      {/* orbit ring — trails behind, reacts to state */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-10 w-10"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%', scaleX: stretchX }}
      >
        <motion.div
          className="cursor-orbit h-full w-full rounded-full"
          animate={{ scale: cfg.scale * (pressed ? 0.85 : 1), opacity: cfg.opacity, borderColor: cfg.color, rotate: 360 }}
          transition={{
            scale: { type: 'spring', stiffness: 320, damping: 24 },
            opacity: { duration: 0.2 },
            borderColor: { duration: 0.2 },
            rotate: { duration: 18, ease: 'linear', repeat: Infinity },
          }}
        />
        {/* cardinal ticks */}
        <motion.span
          className="absolute left-1/2 top-1/2 h-10 w-10"
          style={{ translateX: '-50%', translateY: '-50%' }}
          animate={{ scale: cfg.scale }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        >
          {['top-0 left-1/2 -translate-x-1/2', 'bottom-0 left-1/2 -translate-x-1/2', 'left-0 top-1/2 -translate-y-1/2', 'right-0 top-1/2 -translate-y-1/2'].map((pos) => (
            <span key={pos} className={`absolute ${pos} h-1 w-1 rounded-full bg-white/90`} />
          ))}
        </motion.span>
      </motion.div>
    </>
  )
}
