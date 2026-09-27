import { useEffect, useRef } from 'react'
import MagneticButton from '../motion/MagneticButton'
import { MaskHeading, SectionReveal, CountUp } from '../motion/Reveal'
import { useXP, getDiscoveredAreas } from '../../gamification/XPProvider'
import { sayTicker } from '../../retro/TickerProvider'

/** Level-complete footer block: session report + next run. */
export default function EndOfLevel() {
  const { xp } = useXP()
  const ref = useRef(null)
  const announced = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting && !announced.current) {
          announced.current = true
          sayTicker('SESSION COMPLETE // THANKS FOR PLAYING', { sticky: true })
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const areas = getDiscoveredAreas().length

  return (
    <section id="edge" ref={ref} className="relative overflow-hidden rounded-2xl border border-brand-primary/30 bg-surface-900 p-8 text-center sm:p-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(2,132,199,0.12),transparent_65%)]" />
      <SectionReveal className="relative">
        <p className="font-pixel text-xs tracking-[0.4em] text-brand-accent">■ LEVEL COMPLETE ■</p>
        <MaskHeading className="mx-auto mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight tracking-tight text-brand-text sm:text-4xl">
          YOU REACHED THE EDGE OF PIXELLON.
        </MaskHeading>
        <p className="mt-2 font-display text-lg font-bold text-brand-muted sm:text-xl">
          BUT THE WORLD IS STILL GROWING.
        </p>

        <div className="mx-auto mt-7 grid max-w-lg grid-cols-3 gap-3 font-mono text-xs">
          {[
            { k: 'XP EARNED', v: <CountUp to={xp} /> },
            { k: 'AREAS FOUND', v: <CountUp to={areas} /> },
            { k: 'STATUS', v: <span className="text-emerald-400">ONLINE</span> },
          ].map((s) => (
            <div key={s.k} className="rounded-xl border border-surface-700 bg-brand-surface px-2 py-3">
              <p className="text-lg font-bold text-brand-text">{s.v}</p>
              <p className="mt-1 text-[10px] tracking-[0.2em] text-brand-muted">{s.k}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <MagneticButton
            to="/signin"
            className="rounded-lg bg-brand-primary px-6 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-primary/90"
          >
            Join Pixellon →
          </MagneticButton>
          <MagneticButton
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            strength={0.2}
            className="rounded-lg border border-surface-700 bg-surface-900 px-6 py-2.5 font-sans text-sm font-semibold text-brand-text transition-colors hover:border-brand-accent/50"
          >
            Explore Again ↑
          </MagneticButton>
        </div>
      </SectionReveal>
    </section>
  )
}
