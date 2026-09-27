/**
 * Global CRT texture — scanlines + faint grain at extremely low opacity.
 * Static (no animation) so it never distracts or costs frames.
 */
export default function CRTOverlay() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[65]">
      <div className="crt-overlay absolute inset-0" />
      <div className="crt-noise absolute inset-0" />
    </div>
  )
}
