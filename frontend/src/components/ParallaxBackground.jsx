/**
 * Static ambient background for Pixellon.
 * Clean, subtle grid with no ambient glow.
 */
export default function ParallaxBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* ── Base grid ── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 [background-image:var(--theme-bg-pattern)] [background-size:30px_30px] opacity-70" />
      </div>

      {/* ── Vignette for readability ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--theme-bg)] opacity-60" />
    </div>
  )
}
