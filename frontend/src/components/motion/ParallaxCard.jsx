/**
 * ParallaxCard — Clean static card wrapper without distracting tilt or wobble animations.
 */
export default function ParallaxCard({ children, className = '' }) {
  return (
    <div className={`relative h-full w-full ${className}`}>
      {children}
    </div>
  )
}
