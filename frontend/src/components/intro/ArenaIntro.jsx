import { Component, Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PixellonIcon } from '../PixellonLogo'
import { DURATION, EASE } from '../../motion/tokens'
import { usePointer } from '../../motion/MotionProvider'
import { sound } from '../../motion/sound'

const GalaxyFall = lazy(() => import('../webgl/GalaxyFall'))

export const ARENA_KEY = 'pixellon_arena_entered'

const BOOT_LINES = ['CHARTING GALAXY', 'LOCKING VAULT COORDS', 'DESCENDING']

/** If WebGL fails, land directly instead of trapping the user. */
class FallBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onEnter()
  }
  render() {
    if (this.state.failed) return null
    return this.props.children
  }
}

/**
 * Galaxy-fall entry: brief boot readout over a plunging star tunnel,
 * then straight onto the landing page. ~2.6s, skippable, once per session.
 */
export default function ArenaIntro({ onEnter }) {
  const { reduced } = usePointer()
  const [lines, setLines] = useState(0)
  const [overlayGone, setOverlayGone] = useState(false)

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onEnter, 500)
      return () => clearTimeout(t)
    }
    sound.play('portal')
    const timers = [
      setTimeout(() => setLines(1), 250),
      setTimeout(() => setLines(2), 500),
      setTimeout(() => setLines(3), 750),
      setTimeout(() => setOverlayGone(true), 1500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [reduced, onEnter])

  const enter = () => {
    sessionStorage.setItem(ARENA_KEY, '1')
    onEnter()
  }

  // GalaxyFall calls this at the end of the dive.
  const landed = () => enter()

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-[#05070b]"
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.35, ease: EASE.inOut }}
      role="dialog"
      aria-label="Entering the Pixellon galaxy"
      onClick={enter}
    >
      {!reduced && (
        <FallBoundary onEnter={enter}>
          <Suspense fallback={null}>
            <GalaxyFall onLanded={landed} />
          </Suspense>
        </FallBoundary>
      )}

      {/* boot readout — clears mid-fall for an unobstructed dive */}
      <AnimatePresence>
        {!overlayGone && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.normal }}
          >
            <div className="scanlines pointer-events-none absolute inset-0" />
            <div className="relative px-8 text-center">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: DURATION.slow, ease: EASE.out }}
                className="neon-sign mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-brand-primary/10"
              >
                <PixellonIcon size={26} />
              </motion.div>
              <p className="neon-sign-text font-display text-2xl font-extrabold tracking-[0.3em] text-white sm:text-3xl">
                PIXELLON
              </p>
              <div className="mx-auto mt-5 min-h-16 text-left font-pixel text-sm tracking-[0.2em]">
                {BOOT_LINES.slice(0, lines).map((line) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="py-0.5 text-brand-accent"
                  >
                    ▸ {line}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-pixel text-xs tracking-[0.35em] text-brand-muted">
        CLICK TO SKIP
      </p>
    </motion.div>
  )
}
