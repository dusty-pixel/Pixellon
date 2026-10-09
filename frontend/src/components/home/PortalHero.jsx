import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, BookOpen, Gift, Newspaper, Trophy, Play } from 'lucide-react'
import { PixelPatternBg, PixelCross } from '../BrandDecorations'
import { StaggerWord } from '../motion/Reveal'
import { DURATION, EASE } from '../../motion/tokens'
import { usePointer } from '../../motion/MotionProvider'

const PILLARS = [
  {
    id: 'discover',
    num: '01',
    title: 'DISCOVER',
    desc: 'Indie radar · free drops · deals vault',
    to: '/free-games',
    icon: Gift,
  },
  {
    id: 'learn',
    num: '02',
    title: 'LEARN',
    desc: 'Vault wiki · news · honest reviews',
    to: '/vault',
    icon: BookOpen,
  },
  {
    id: 'compete',
    num: '03',
    title: 'COMPETE',
    desc: 'Esports hub · live streams',
    to: '/esports',
    icon: Trophy,
  },
]

const STATS = [
  { value: '12K+', label: 'Vault entries' },
  { value: '100% OFF', label: 'Free drops tracked' },
  { value: '40+', label: 'Indie spotlights' },
  { value: 'LIVE', label: 'Esports + streams' },
]

export default function PortalHero({ onSearch }) {
  const [query, setQuery] = useState('')
  const { reduced } = usePointer()

  const submit = (e) => {
    e?.preventDefault()
    if (onSearch) onSearch(query.trim())
  }

  // Load-in stagger (hero is above the fold — animate on mount, not scroll)
  const parent = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASE.out } },
  }
  // Spread onto motion elements — no-ops when reduced motion is preferred
  const rise = reduced ? {} : { variants: parent, initial: 'hidden', animate: 'show' }
  const riseItem = reduced ? {} : { variants: item }
  const press = reduced ? {} : { whileHover: { x: 5 }, whileTap: { scale: 0.985 } }

  return (
    <section id="portal-hero" className="relative w-full mx-auto max-w-[1720px] px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
      <div className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface">
        <PixelPatternBg />
        {/* soft accent wash — portal, not game art */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(600px 280px at 15% 0%, rgba(0,210,255,0.12), transparent 60%), radial-gradient(500px 260px at 90% 100%, rgba(139,92,246,0.10), transparent 60%)',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10">
          {/* Left: portal intro */}
          <motion.div className="lg:col-span-7 flex flex-col justify-center" {...rise}>
            <motion.div {...riseItem}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-brand-primary/40 bg-brand-primary/10 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse" />
                Pixellon Portal
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-muted">
                Play · Share · Belong
              </span>
            </div>
            </motion.div>

            <motion.div {...riseItem}>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-text leading-[0.95]">
              Welcome to
              <br />
              <StaggerWord text="Pixellon." className="text-brand-accent" />
            </h1>
            </motion.div>

            <motion.div {...riseItem}>
            <p className="mt-4 max-w-xl text-sm sm:text-base text-brand-muted leading-relaxed">
              Small pixels, big possibilities — one arena for every player: free game
              drops, indie radar, the Vault wiki, honest reviews, live streams and
              esports. Start anywhere, belong everywhere.
            </p>
            </motion.div>

            {/* Search */}
            <motion.div {...riseItem}>
            <form onSubmit={submit} className="mt-6 flex w-full max-w-xl items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search games, lore, deals…"
                  aria-label="Search Pixellon"
                  className="w-full rounded-xl bg-surface-900 border border-surface-700 pl-10 pr-4 py-3 text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                />
              </div>
              <button type="submit" className="btn-primary shrink-0 px-5 py-3 text-sm">
                Search
              </button>
            </form>
            </motion.div>

            {/* CTAs */}
            <motion.div {...riseItem}>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <Link to="/vault" className="btn-primary px-4 py-2 text-xs sm:text-sm">
                <BookOpen className="h-4 w-4" />
                Explore the Vault
              </Link>
              <Link to="/free-games" className="btn-surface px-4 py-2 text-xs sm:text-sm">
                <Gift className="h-4 w-4 text-emerald-400" />
                Claim free games
              </Link>
              <Link to="/gateway" className="btn-ghost px-4 py-2 text-xs sm:text-sm border border-surface-700 rounded-lg">
                <Play className="h-4 w-4" />
                New here? Enter Gateway →
              </Link>
            </div>
            </motion.div>

            {/* Stats */}
            <motion.dl {...riseItem} className="mt-6 grid max-w-xl grid-cols-2 sm:grid-cols-4 gap-3">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl border border-surface-700 bg-surface-900/60 px-3 py-2.5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-base sm:text-lg font-bold text-brand-text">{s.value}</dd>
                  <dd className="font-mono text-[10px] uppercase tracking-wider text-brand-muted">{s.label}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* Right: three doors */}
          <motion.div className="lg:col-span-5 flex flex-col justify-center gap-3" {...rise}>
            <motion.div {...riseItem}>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-brand-muted">
              <PixelCross size={12} />
              <span>Choose your path</span>
            </div>
            </motion.div>
            {PILLARS.map((p) => (
              <motion.div key={p.id} {...riseItem} {...press}>
              <Link
                to={p.to}
                className="group flex items-center gap-4 rounded-xl border border-surface-700 bg-surface-900/70 px-4 py-4 transition-colors hover:border-brand-primary/60 hover:bg-surface-900"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-brand-primary/30 bg-brand-primary/10 text-brand-accent">
                  <p.icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] font-bold text-brand-primary">{p.num}</span>
                    <span className="font-display text-xl font-extrabold tracking-tight text-brand-text group-hover:text-brand-accent transition-colors">
                      {p.title}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-brand-muted">{p.desc}</span>
                </span>
                <span className="font-mono text-brand-muted transition-transform group-hover:translate-x-1 group-hover:text-brand-accent">
                  →
                </span>
              </Link>
              </motion.div>
            ))}
            <motion.div {...riseItem} {...press}>
            <Link
              to="/news"
              className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-surface-700 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-brand-muted transition-colors hover:border-brand-accent/50 hover:text-brand-text"
            >
              <Newspaper className="h-3.5 w-3.5" />
              Latest news radar →
            </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
