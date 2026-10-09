import { memo } from 'react'

/**
 * Atmospheric nature-integrated forest backdrop inspired by The Last of Us.
 * Features deep forest greens, charcoal shadows, dynamic organic lighting,
 * and a soft vignette overlay with floating ambient spores.
 */
function TlouAtmosphere({ bgImage }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {/* ── Base High-Res Hero Artwork ───────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-100"
        style={{
          backgroundImage: `url("${bgImage || '/images/last_of_us_hero.jpg'}")`,
          backgroundPosition: 'center 38%',
        }}
      />

      {/* ── Deep Forest Greens & Charcoal Vignette Overlay ────────── */}
      <div className="absolute inset-0 tlou-vignette-overlay" />

      {/* ── Subtle Film Grain / Atmospheric Depth ──────────────────── */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

    </div>
  )
}

export default memo(TlouAtmosphere)
