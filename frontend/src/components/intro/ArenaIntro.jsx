import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PixellonIcon } from '../PixellonLogo'
import MagneticButton from '../motion/MagneticButton'
import { DURATION, EASE } from '../../motion/tokens'
import { sound } from '../../motion/sound'

export const ARENA_KEY = 'pixellon_arena_entered'

const BOOT_LINES = ['LOADING WORLDS', 'LOADING PLAYERS', 'SYNCING NETWORK', 'PREPARING ARENA']

/**
 * Game-startup intro. Fast by design: boots in ~1.4s, ENTER ARENA
 * appears as soon as ready. Shown once per session.
 */
export default function ArenaIntro({ onEnter }) {
  const [progress, setProgress] = useState(0)
  const [lines, setLines] = useState(0)
  const [glitched, setGlitched] = useState(false)
  const ready = progress >= 100

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(t)
          return 100
        }
        return Math.min(100, p + 4 + Math.random() * 9)
      })
    }, 70)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (progress > 18 * (lines + 1) && lines < BOOT_LINES.length) {
      const t = setTimeout(() => setLines((l) => l + 1), 120)
      return () => clearTimeout(t)
    }
    if (progress >= 55 && !glitched) {
      // brief CRT glitch as the sign powers on
      setGlitched(true)
    }
  }, [progress, lines, glitched])

  const enter = () => {
    sound.play('portal')
    sessionStorage.setItem(ARENA_KEY, '1')
    onEnter()
  }

  return (
    <motion.div
      className="arena-intro fixed inset-0 z-[200] flex items-center justify-center bg-[#070B12]"
      exit={{ opacity: 0, scale: 1.12, filter: 'brightness(2.2)' }}
      transition={{ duration: DURATION.cinematic, ease: EASE.inOut }}
      role="dialog"
      aria-label="Entering the Pixellon arena"
    >
      {/* scanlines + noise + vignette */}
      <div aria-hidden className="scanlines pointer-events-none absolute inset-0" />
      <div aria-hidden className="crt-noise pointer-events-none absolute inset-0" style={{ opacity: 0.09 }} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55))]" />

      <div className={`relative w-full max-w-md px-8 text-center ${glitched && !ready ? 'glitch-burst' : ''}`}>
        <p className="mb-4 font-pixel text-xs tracking-[0.5em] text-brand-muted">PIXELLON SYSTEM // BOOTING…</p>
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: DURATION.slow, ease: EASE.out }}
          className="neon-sign mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-brand-primary/10"
        >
          <PixellonIcon size={30} />
        </motion.div>

        <h1 className="neon-sign-text font-display text-4xl font-extrabold tracking-[0.28em] text-white sm:text-5xl">
          {'PIXELLON'.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05, duration: DURATION.normal, ease: EASE.out }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>
        <p className="mt-3 font-display text-sm font-bold tracking-[0.35em] text-brand-accent">
          PLAY. SHARE. BELONG.
        </p>

        <div className="mx-auto mt-7 min-h-20 text-left font-mono text-xs">
          {BOOT_LINES.slice(0, lines).map((line, i) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 py-0.5 text-brand-muted"
            >
              <span className="text-emerald-400">▸</span> {line}
              {i === lines - 1 && !ready && <span className="blink text-brand-accent">▌</span>}
            </motion.p>
          ))}
          {ready && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 py-0.5 font-bold text-emerald-400">
              <span>▸</span> WORLD ONLINE
            </motion.p>
          )}
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-accent2"
            animate={{ width: `${Math.floor(progress)}%` }}
            transition={{ ease: 'easeOut', duration: 0.15 }}
          />
        </div>
        <p className="mt-2 font-mono text-[11px] text-brand-muted">{Math.floor(progress)}%</p>

        <div className="mt-6 min-h-12">
          <AnimatePresence>
            {ready && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <MagneticButton
                  onClick={enter}
                  className="rounded-lg bg-brand-primary px-8 py-3 font-display text-sm font-bold tracking-[0.2em] text-white shadow-[0_0_28px_rgba(2,132,199,0.5)]"
                >
                  ENTER ARENA →
                </MagneticButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
