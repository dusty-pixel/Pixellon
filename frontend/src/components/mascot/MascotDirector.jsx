import { useEffect, useState } from 'react'
import PixelCat from '../PixelCat/PixelCat'
import { usePointer } from '../../motion/MotionProvider'
import { sayTicker } from '../../retro/TickerProvider'

/**
 * Blue pixel cat companion — summon-only.
 * Appears exclusively via the 'pixellon:summon-cat' event
 * (easter eggs), never wanders in on its own.
 */
export default function MascotDirector() {
  const { reduced } = usePointer()
  const [present, setPresent] = useState(false)

  useEffect(() => {
    if (reduced) return
    let hideT = 0
    let alive = true

    const summon = () => {
      if (!alive) return
      window.clearTimeout(hideT)
      setPresent(true)
      sayTicker('PIXEL CAT DETECTED...')
      hideT = window.setTimeout(() => {
        if (!alive) return
        setPresent(false)
      }, 22000)
    }

    window.addEventListener('pixellon:summon-cat', summon)
    return () => {
      alive = false
      window.clearTimeout(hideT)
      window.removeEventListener('pixellon:summon-cat', summon)
    }
  }, [reduced])

  if (!present) return null
  return <PixelCat />
}
