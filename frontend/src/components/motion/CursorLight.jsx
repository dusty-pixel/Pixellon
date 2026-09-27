import { usePointer } from '../../motion/MotionProvider'

/**
 * Subtle global lighting that follows the pointer.
 * Very low intensity radial highlight + faint brand tint.
 */
export default function CursorLight() {
  const { interactive } = usePointer()
  if (!interactive) return null
  return (
    <div
      aria-hidden
      className="cursor-light pointer-events-none fixed inset-0 z-[60]"
    />
  )
}
