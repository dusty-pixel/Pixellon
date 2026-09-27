import { useEffect } from 'react'
import { useMotionValue } from 'framer-motion'

/**
 * Shared page scroll state — ONE window listener total, no matter how
 * many components consume it. Exposes page progress (0→1) + velocity.
 */
const subs = new Set()
let active = false
let rafId = 0
let lastY = 0
let lastT = 0

function tick() {
  rafId = 0
  const y = window.scrollY
  const max = document.documentElement.scrollHeight - window.innerHeight
  const p = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0
  const now = performance.now()
  const dt = Math.max(now - lastT, 1)
  const v = (y - lastY) / dt
  lastY = y
  lastT = now
  subs.forEach((s) => {
    s.progress.set(p)
    s.velocity.set(v)
  })
}

function onScroll() {
  if (!rafId) rafId = requestAnimationFrame(tick)
}

export function useScrollProgress() {
  const progress = useMotionValue(0)
  const velocity = useMotionValue(0)

  useEffect(() => {
    const sub = { progress, velocity }
    subs.add(sub)
    if (!active) {
      active = true
      lastY = window.scrollY
      lastT = performance.now()
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    onScroll()
    return () => {
      subs.delete(sub)
      if (subs.size === 0) {
        active = false
        window.removeEventListener('scroll', onScroll)
        if (rafId) cancelAnimationFrame(rafId)
        rafId = 0
      }
    }
  }, [progress, velocity])

  return { progress, velocity }
}
