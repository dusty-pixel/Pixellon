import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/**
 * Global pointer / motion provider.
 * Single mousemove listener feeds sprung motion values consumed by
 * cursor, cards, buttons, lighting and the WebGL scene.
 * Also owns device capability + FULL/LOW motion preference.
 */
const PointerContext = createContext(null)

const MOTION_KEY = 'pixellon_motion'

function detectCapabilities() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return { fine, coarse, reduced }
}

export function MotionProvider({ children }) {
  const rawX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0)
  const rawY = useMotionValue(0)
  const rawNX = useMotionValue(0)
  const rawNY = useMotionValue(0)
  const velX = useMotionValue(0)
  const velY = useMotionValue(0)

  const x = useSpring(rawX, { stiffness: 260, damping: 28, mass: 0.5 })
  const y = useSpring(rawY, { stiffness: 260, damping: 28, mass: 0.5 })
  const nx = useSpring(rawNX, { stiffness: 90, damping: 18, mass: 0.8 })
  const ny = useSpring(rawNY, { stiffness: 90, damping: 18, mass: 0.8 })

  const [caps] = useState(detectCapabilities)
  const [motionMode, setMotionModeState] = useState(() => {
    const saved = localStorage.getItem(MOTION_KEY)
    if (saved === 'full' || saved === 'low') return saved
    return caps.reduced ? 'low' : 'full'
  })

  const setMotionMode = useCallback((mode) => {
    setMotionModeState(mode)
    localStorage.setItem(MOTION_KEY, mode)
  }, [])

  // Motion is fully enabled only on capable devices in FULL mode.
  const interactive = caps.fine && !caps.coarse && motionMode === 'full' && !caps.reduced

  useEffect(() => {
    let lastX = window.innerWidth / 2
    let lastY = 0
    let lastT = performance.now()
    let raf = 0
    let pending = null

    const apply = () => {
      raf = 0
      if (!pending) return
      const { clientX, clientY } = pending
      pending = null
      const now = performance.now()
      const dt = Math.max(now - lastT, 1)
      velX.set(((clientX - lastX) / dt) * 16)
      velY.set(((clientY - lastY) / dt) * 16)
      lastX = clientX
      lastY = clientY
      lastT = now
      rawX.set(clientX)
      rawY.set(clientY)
      rawNX.set(clientX / window.innerWidth - 0.5)
      rawNY.set(clientY / window.innerHeight - 0.5)
    }

    const onMove = (e) => {
      pending = e
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [rawX, rawY, rawNX, rawNY, velX, velY])

  const value = useMemo(
    () => ({ x, y, nx, ny, velX, velY, interactive, motionMode, setMotionMode, ...caps }),
    [x, y, nx, ny, velX, velY, interactive, motionMode, setMotionMode, caps],
  )

  return <PointerContext.Provider value={value}>{children}</PointerContext.Provider>
}

export function usePointer() {
  const ctx = useContext(PointerContext)
  if (!ctx) throw new Error('usePointer must be used within MotionProvider')
  return ctx
}
