import { useEffect, useRef } from 'react'
import { useXP } from '../gamification/XPProvider'
import { sayTicker } from '../retro/TickerProvider'

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright']

/**
 * Session Easter eggs:
 * - click the Pixellon logo 5x → developer mode + cat summon
 * - Konami sequence → secret XP drop + cat summon
 */
export function useEasterEggs() {
  const { awardXP } = useXP()
  const clicks = useRef([])
  const keys = useRef([])
  const unlocked = useRef({ dev: false, konami: false })

  useEffect(() => {
    const summonCat = () => window.dispatchEvent(new Event('pixellon:summon-cat'))

    const onClick = (e) => {
      const logo = e.target.closest?.('[data-easter="logo"]')
      if (!logo) return
      const now = Date.now()
      clicks.current = [...clicks.current.filter((t) => now - t < 2500), now]
      if (clicks.current.length >= 5 && !unlocked.current.dev) {
        unlocked.current.dev = true
        clicks.current = []
        sayTicker('DEVELOPER MODE ACTIVE', { sticky: true })
        awardXP(50, 'Developer mode unlocked')
        summonCat()
      }
    }

    const onKey = (e) => {
      keys.current = [...keys.current, e.key.toLowerCase()].slice(-KONAMI.length)
      if (!unlocked.current.konami && keys.current.join(',') === KONAMI.join(',')) {
        unlocked.current.konami = true
        sayTicker('SECRET DETECTED...', { sticky: true })
        awardXP(50, 'Konami code cracked')
        summonCat()
      }
    }

    window.addEventListener('click', onClick)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKey)
    }
  }, [awardXP])
}
