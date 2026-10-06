import { motion } from 'framer-motion'
import { DURATION, EASE } from '../motion/tokens'
import { usePointer } from '../motion/MotionProvider'

const BARS = 6

/**
 * Route transition: content settles in while a pixel-bar curtain
 * lifts away. Total feel ~400ms — never slower than navigation.
 */
export default function PageTransition({ children, className = '' }) {
  return <div className={className}>{children}</div>
}
