import { useEffect, useRef, useState } from 'react'

const TICKS = [0, 25, 50, 75, 100]

/**
 * Scroll-distance measurer — fixed right-edge rail with tick marks and a
 * live percentage readout (000–100%). Eases toward the true scroll position
 * via rAF lerp so motion feels like a measuring instrument, not a jump.
 * Rendered in the app shell so it measures every screen.
 */
export default function ScrollMeasure() {
  const [pct, setPct] = useState(0)
  const target = useRef(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      target.current = max > 0 ? el.scrollTop / max : 0
    }
    const tick = () => {
      setPct((prev) => {
        const next = prev + (target.current - prev) * 0.12
        return Math.abs(next - target.current) < 0.0005 ? target.current : next
      })
      raf = requestAnimationFrame(tick)
    }
    onScroll()
    raf = requestAnimationFrame(tick)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const label = `${String(Math.round(pct * 100)).padStart(3, '0')}%`

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-2 top-1/2 z-40 flex -translate-y-1/2 flex-col items-end gap-2 sm:right-3"
    >
      <span className="font-mono text-[11px] font-bold tabular-nums text-brand-accent">
        {label}
      </span>
      <div className="relative h-40 w-px bg-surface-700">
        <div
          className="absolute left-0 top-0 w-px bg-brand-accent"
          style={{ height: `${pct * 100}%` }}
        />
        {TICKS.map((t) => (
          <span
            key={t}
            className="absolute right-0 h-px w-2 bg-surface-600"
            style={{ top: `${t}%` }}
          />
        ))}
      </div>
    </div>
  )
}
