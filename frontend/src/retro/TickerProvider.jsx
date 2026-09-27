import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getGamingNews } from '../utils/api'

/**
 * Retro LED ticker bus. Any system can post a message:
 *   sayTicker('+20 XP // NEW GAME DISCOVERED', { sticky: false })
 * Event messages interrupt the idle loop for a few seconds,
 * then the ticker resumes ambient rotation.
 */
export function sayTicker(text, opts = {}) {
  window.dispatchEvent(new CustomEvent('pixellon:ticker', { detail: { text, ...opts } }))
}

const TickerContext = createContext({ say: sayTicker })

const IDLE = [
  'WELCOME TO PIXELLON • PLAY • SHARE • BELONG •',
  'PIXELLON // WORLD ONLINE • ALL SYSTEMS NOMINAL •',
  'TIP // CLICK THE PIXELLON LOGO 5X FOR A SECRET •',
  'TIP // THE BLUE CAT ONLY APPEARS FOR PATIENT PLAYERS •',
]

const ROUTE_MSGS = {
  '/': 'AREA: HOME BASE // THE ARENA HEART',
  '/vault': 'AREA: PLAY // SELECT YOUR GAME',
  '/free-games': 'AREA: PLAY // FREE GAMES VAULT OPEN',
  '/news': 'AREA: DISCOVER // SIGNAL INCOMING',
  '/streams': 'AREA: COMMUNITY // PLAYERS ONLINE',
  '/esports': 'AREA: COMMUNITY // TOURNAMENT FLOOR',
  '/indie': 'AREA: BUILD // CREATE THE NEXT WORLD',
  '/deals': 'AREA: DISCOVER // SUPPLY DEPOT',
  '/reviews': 'AREA: DISCOVER // REVIEW VAULT',
  '/calendar': 'AREA: DISCOVER // RELEASE RADAR',
  '/gateway': 'AREA: HOME BASE // NEW PLAYER GATE',
  '/profile': 'AREA: HOME BASE // PLAYER CARD',
  '/signin': 'AREA: HOME BASE // IDENTIFY YOURSELF',
}

export function TickerProvider({ children }) {
  const location = useLocation()
  const [eventMsg, setEventMsg] = useState(null)
  const [idleIdx, setIdleIdx] = useState(0)
  const [breaking, setBreaking] = useState([])
  const timer = useRef(0)

  const say = useCallback((text, opts = {}) => sayTicker(text, opts), [])

  // Pull breaking headlines once per session for the idle rotation.
  useEffect(() => {
    let alive = true
    getGamingNews()
      .then((items) => {
        if (!alive) return
        const heads = (items || [])
          .slice(0, 4)
          .map((it) => String(it?.title || '').replace(/<[^>]*>/g, '').trim())
          .filter(Boolean)
          .map((t) => `BREAKING // ${t.toUpperCase().slice(0, 110)}`)
        if (heads.length) setBreaking(heads)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const rotation = useMemo(() => [...breaking, ...IDLE], [breaking])

  useEffect(() => {
    const onMsg = (e) => {
      setEventMsg(e.detail.text)
      window.clearTimeout(timer.current)
      // Event stays ~4.5s (or 8s when sticky), then idle resumes.
      timer.current = window.setTimeout(() => setEventMsg(null), e.detail.sticky ? 8000 : 4500)
    }
    window.addEventListener('pixellon:ticker', onMsg)
    return () => {
      window.removeEventListener('pixellon:ticker', onMsg)
      window.clearTimeout(timer.current)
    }
  }, [])

  useEffect(() => {
    if (eventMsg) return
    const t = setInterval(() => setIdleIdx((i) => (i + 1) % rotation.length), 7000)
    return () => clearInterval(t)
  }, [eventMsg, rotation.length])

  // Announce area changes.
  const path = location.pathname
  useEffect(() => {
    const base = ROUTE_MSGS[path] || (/^\/vault\//.test(path) ? 'AREA: PLAY // GAME FILE OPEN' : null)
    if (base) say(base)
  }, [path, say])

  const value = useMemo(
    () => ({ say, message: eventMsg || rotation[idleIdx % rotation.length], alert: Boolean(eventMsg) }),
    [say, eventMsg, idleIdx, rotation],
  )

  return <TickerContext.Provider value={value}>{children}</TickerContext.Provider>
}

export function useTicker() {
  return useContext(TickerContext)
}
