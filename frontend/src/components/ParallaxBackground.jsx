import { useEffect, useRef } from 'react'

/**
 * Fixed multi-layer parallax background for the homepage.
 * - Back layer (grid + soft orbs) drifts slowest, front pixel layer fastest.
 * - Scroll drives vertical drift, mouse adds subtle depth offset.
 * - rAF + lerp keeps it smooth; disabled for prefers-reduced-motion.
 */
export default function ParallaxBackground() {
  const backRef = useRef(null)
  const midRef = useRef(null)
  const frontRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const target = { scroll: window.scrollY, mx: 0, my: 0 }
    const current = { scroll: window.scrollY, mx: 0, my: 0 }
    let raf = 0
    let running = true

    const onScroll = () => {
      target.scroll = window.scrollY
    }
    const onMouse = (e) => {
      target.mx = e.clientX / window.innerWidth - 0.5
      target.my = e.clientY / window.innerHeight - 0.5
    }

    const tick = () => {
      if (!running) return
      current.scroll += (target.scroll - current.scroll) * 0.08
      current.mx += (target.mx - current.mx) * 0.06
      current.my += (target.my - current.my) * 0.06

      const s = current.scroll
      const mx = current.mx
      const my = current.my

      // Each layer extends past the viewport so edges never show during drift.
      if (backRef.current) {
        backRef.current.style.transform =
          `translate3d(${(-mx * 18).toFixed(2)}px, ${(-s * 0.06 - my * 18).toFixed(2)}px, 0)`
      }
      if (midRef.current) {
        midRef.current.style.transform =
          `translate3d(${(-mx * 38).toFixed(2)}px, ${(-s * 0.12 - my * 38).toFixed(2)}px, 0)`
      }
      if (frontRef.current) {
        frontRef.current.style.transform =
          `translate3d(${(-mx * 70).toFixed(2)}px, ${(-s * 0.22 - my * 70).toFixed(2)}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* ── Back layer: oversized grid + ambient glow ── */}
      <div ref={backRef} className="absolute -inset-[12%] will-change-transform">
        <div className="absolute inset-0 [background-image:var(--theme-bg-pattern)] [background-size:30px_30px] opacity-70" />
        <div className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand-primary/15 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-[380px] w-[380px] rounded-full bg-brand-accent/10 blur-[110px]" />
        <div className="absolute bottom-0 -right-40 h-[420px] w-[420px] rounded-full bg-brand-accent2/10 blur-[110px]" />
      </div>

      {/* ── Mid layer: faint concentric rings + large soft pixels ── */}
      <div ref={midRef} className="absolute -inset-[12%] will-change-transform">
        <div className="absolute top-[12%] right-[8%] h-56 w-56 rounded-full border border-brand-primary/20" />
        <div className="absolute top-[16%] right-[11%] h-36 w-36 rounded-full border border-brand-accent/15" />
        <div className="absolute bottom-[18%] left-[6%] h-64 w-64 rounded-full border border-brand-accent/10" />
        <div className="absolute top-[38%] left-[12%] h-5 w-5 bg-brand-primary/25 animate-float" />
        <div className="absolute top-[30%] right-[22%] h-4 w-4 bg-brand-accent/25 animate-float" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-[28%] right-[14%] h-6 w-6 bg-brand-accent2/20 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* ── Front layer: small crisp pixels, fastest drift ── */}
      <div ref={frontRef} className="absolute -inset-[12%] will-change-transform">
        <div className="absolute top-[22%] left-[20%] h-3 w-3 bg-brand-accent/40 animate-float" />
        <div className="absolute top-[55%] left-[8%] h-2.5 w-2.5 bg-brand-primary/40 animate-float" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-[70%] right-[28%] h-3 w-3 bg-brand-accent2/35 animate-float" style={{ animationDelay: '1.6s' }} />
        <div className="absolute top-[42%] right-[6%] h-2 w-2 bg-brand-accent3/30 animate-float" style={{ animationDelay: '2.4s' }} />
        <div className="absolute bottom-[12%] left-[38%] h-2.5 w-2.5 bg-brand-accent/30 animate-float" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* ── Vignette so content stays readable over the motion ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--theme-bg)] opacity-60" />
    </div>
  )
}
