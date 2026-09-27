import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DURATION, EASE } from '../motion/tokens'
import { sound } from '../motion/sound'
import { sayTicker } from '../retro/TickerProvider'

/**
 * Session-based gamification. No currency, no accounts —
 * small XP rewards for exploring the arena. Session-scoped.
 */
const XPContext = createContext(null)
const XP_KEY = 'pixellon_session_xp'
const SEEN_KEY = 'pixellon_seen_areas'

function loadSeen() {
  return getDiscoveredAreas()
}

export function getDiscoveredAreas() {
  try {
    const v = JSON.parse(sessionStorage.getItem(SEEN_KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function XPProvider({ children }) {
  const [xp, setXp] = useState(() => Number(sessionStorage.getItem(XP_KEY) || 0))
  const [events, setEvents] = useState([])
  const idRef = useRef(0)
  const seenRef = useRef(loadSeen())

  useEffect(() => {
    sessionStorage.setItem(XP_KEY, String(xp))
  }, [xp])

  const pushEvent = useCallback((evt) => {
    const id = ++idRef.current
    setEvents((list) => [...list.slice(-2), { ...evt, id }])
    setTimeout(() => {
      setEvents((list) => list.filter((e) => e.id !== id))
    }, 2800)
  }, [])

  const awardXP = useCallback(
    (amount, label) => {
      setXp((v) => v + amount)
      sound.play('xp')
      sayTicker(`+${amount} XP // ${String(label).toUpperCase()}`)
      pushEvent({ type: 'xp', amount, label })
    },
    [pushEvent],
  )

  const discoverArea = useCallback(
    (areaId, label, amount = 10) => {
      if (seenRef.current.includes(areaId)) return false
      seenRef.current.push(areaId)
      sessionStorage.setItem(SEEN_KEY, JSON.stringify(seenRef.current))
      setXp((v) => v + amount)
      sound.play('discovery')
      sayTicker(`NEW AREA // ${label}`, { sticky: true })
      pushEvent({ type: 'area', amount, label })
      return true
    },
    [pushEvent],
  )

  const value = useMemo(() => {
    const level = Math.floor(xp / 100) + 1
    return { xp, level, progress: (xp % 100) / 100, awardXP, discoverArea }
  }, [xp, awardXP, discoverArea])

  return (
    <XPContext.Provider value={value}>
      {children}
      <ToastStack events={events} />
    </XPContext.Provider>
  )
}

export function useXP() {
  const ctx = useContext(XPContext)
  if (!ctx) throw new Error('useXP must be used within XPProvider')
  return ctx
}

/** Observe once — first viewport entry discovers the area. */
export function useDiscovery(areaId, label, amount) {
  const { discoverArea } = useXP()
  return useCallback(
    (node) => {
      if (!node) return
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              discoverArea(areaId, label, amount)
              io.disconnect()
            }
          })
        },
        { threshold: 0.35 },
      )
      io.observe(node)
      return () => io.disconnect()
    },
    [areaId, label, amount, discoverArea],
  )
}

function ToastStack({ events }) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-20 right-4 z-[90] flex w-64 flex-col gap-2 sm:right-6">
      <AnimatePresence>
        {events.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: 48, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24, scale: 0.95 }}
            transition={{ duration: DURATION.normal, ease: EASE.out }}
            className="rounded-lg border border-brand-primary/40 bg-surface-900/95 px-3.5 py-2.5 shadow-[0_0_20px_rgba(2,132,199,0.25)] backdrop-blur-md"
          >
            {e.type === 'area' ? (
              <>
                <p className="font-pixel text-xs tracking-[0.2em] text-brand-accent">
                  New area discovered
                </p>
                <p className="mt-0.5 font-display text-sm font-bold text-brand-text">{e.label}</p>
              </>
            ) : (
              <p className="font-pixel text-sm text-brand-accent">
                +{e.amount} XP <span className="font-mono text-xs font-medium text-brand-muted">{e.label}</span>
              </p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
