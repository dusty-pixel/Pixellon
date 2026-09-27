import { motion } from 'framer-motion'
import { DURATION, EASE } from '../motion/tokens'
import { usePointer } from '../motion/MotionProvider'

const BARS = 6

/**
 * Route transition: content settles in while a pixel-bar curtain
 * lifts away. Total feel ~400ms — never slower than navigation.
 */
export default function PageTransition({ children, className = '' }) {
  const { reduced, motionMode } = usePointer()
  const minimal = reduced || motionMode === 'low'

  if (minimal) {
    return <div className={className}>{children}</div>
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: DURATION.normal, ease: EASE.out }}
        className={className}
      >
        {children}
      </motion.div>
      {/* pixel curtain lift */}
      <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-[95] flex">
        {Array.from({ length: BARS }).map((_, i) => (
          <motion.span
            key={i}
            className="h-full flex-1 bg-[#070B12]"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            style={{ transformOrigin: 'top' }}
            transition={{ duration: 0.32, ease: EASE.inOut, delay: 0.02 + i * 0.035 }}
          />
        ))}
      </motion.div>
    </>
  )
}
