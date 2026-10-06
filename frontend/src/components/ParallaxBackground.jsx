/**
 * Static ambient background for Pixellon.
 * Clean, subtle grid and soft static ambient glow with zero floating jitter or mouse drift.
 */
export default function ParallaxBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* ── Base grid & ambient glow using fast hardware-accelerated gradients ── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 [background-image:var(--theme-bg-pattern)] [background-size:30px_30px] opacity-70" />
        <div
          className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-60"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0, 210, 255, 0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -left-40 h-[380px] w-[380px] rounded-full opacity-50"
          style={{ background: 'radial-gradient(circle at center, rgba(45, 212, 191, 0.1) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 -right-40 h-[420px] w-[420px] rounded-full opacity-50"
          style={{ background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Vignette for readability ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--theme-bg)] opacity-60" />
    </div>
  )
}
