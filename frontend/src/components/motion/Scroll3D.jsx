/**
 * Lightweight, hardware-accelerated divider and container wrappers.
 */
export function VoxelDivider({ count = 12, className = '' }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-4 overflow-hidden py-4 opacity-40 ${className}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
      <div className="flex items-center gap-3">
        {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
          <span
            key={i}
            className="block h-2 w-2 rounded-[2px] border border-brand-primary/40 bg-brand-primary/20"
          />
        ))}
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
    </div>
  )
}

export function ParallaxRise({ children, className = '' }) {
  return <div className={className}>{children}</div>
}
