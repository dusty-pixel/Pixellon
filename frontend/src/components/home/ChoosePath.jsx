import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeader from '../SectionHeader'
import { SectionReveal } from '../motion/Reveal'
import { DURATION, EASE } from '../../motion/tokens'
import { trendingGames } from '../../data/mockData'

const PATHS = [
  { id: 'play', num: '01', word: 'PLAY', desc: 'Game library • free vault • vault files', to: '/free-games', kind: 'games' },
  { id: 'discover', num: '02', word: 'DISCOVER', desc: 'News radar • review vault • release signals', to: '/vault', kind: 'nodes' },
  { id: 'community', num: '03', word: 'COMMUNITY', desc: 'Streams • tournaments • player lobby', to: '/streams', kind: 'players' },
  { id: 'build', num: '04', word: 'BUILD', desc: 'Indie spotlights • creator worlds', to: '/indie', kind: 'voxels' },
]

const AVATARS = ['Nova', 'Pixel', 'Rook', 'Byte'].map(
  (s) => `https://api.dicebear.com/7.x/pixel-art/svg?seed=${s}`,
)

/** Game-menu path select with ghost typography + live previews. */
export default function ChoosePath() {
  const [active, setActive] = useState(PATHS[0])

  return (
    <section id="path">
      <SectionHeader index="01" title="Choose Your Path" subtitle="Four doors. One arena. Pick where the run starts." />
      <SectionReveal>
        <div className="grid gap-6 lg:grid-cols-12">
          {/* menu rows */}
          <div className="lg:col-span-7">
            {PATHS.map((p) => (
              <Link
                key={p.id}
                to={p.to}
                onMouseEnter={() => setActive(p)}
                onFocus={() => setActive(p)}
                className={`group relative block overflow-hidden border-b border-surface-700 py-4 transition-colors sm:py-5 ${
                  active.id === p.id ? 'border-brand-primary/50' : ''
                }`}
              >
                {/* ghost echo */}
                <span aria-hidden className="ghost-word pointer-events-none absolute -top-2 left-0 font-display text-5xl font-extrabold tracking-tight opacity-70 sm:text-6xl">
                  {p.word}
                </span>
                <span className="relative flex items-baseline gap-4">
                  <span className="font-pixel text-sm text-brand-primary">{p.num}</span>
                  <span
                    className={`font-display text-4xl font-extrabold tracking-tight transition-all duration-300 sm:text-5xl ${
                      active.id === p.id ? 'translate-x-2 text-brand-text' : 'text-brand-muted'
                    }`}
                  >
                    {p.word}
                  </span>
                  <span className={`ml-auto hidden font-mono text-xs text-brand-muted sm:block ${active.id === p.id ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                    {p.desc} →
                  </span>
                </span>
              </Link>
            ))}
          </div>

          {/* preview cabinet */}
          <div className="relative min-h-56 overflow-hidden rounded-2xl border border-surface-700 bg-surface-900 lg:col-span-5">
            <div className="led-dots pointer-events-none absolute inset-0 opacity-40" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: DURATION.normal, ease: EASE.out }}
                className="relative flex h-full min-h-56 items-center justify-center p-6"
              >
                {active.kind === 'games' && (
                  <div className="grid w-full grid-cols-3 gap-3">
                    {trendingGames.slice(0, 3).map((g) => (
                      <div key={g.id} className="overflow-hidden rounded-lg border border-surface-700">
                        <img src={g.image} alt={g.title} className="aspect-[3/4] w-full object-cover" loading="lazy" />
                        <p className="truncate bg-brand-surface px-2 py-1.5 font-mono text-[10px] text-brand-text">{g.title}</p>
                      </div>
                    ))}
                  </div>
                )}
                {active.kind === 'nodes' && (
                  <svg viewBox="0 0 200 120" className="w-full max-w-55" aria-hidden>
                    {[[100, 60, 30, 30], [100, 60, 165, 35], [100, 60, 45, 95], [100, 60, 160, 92]].map(([x1, y1, x2, y2], i) => (
                      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--theme-accent, #00D2FF)" strokeOpacity="0.4" />
                    ))}
                    {[[100, 60], [30, 30], [165, 35], [45, 95], [160, 92]].map(([cx, cy], i) => (
                      <circle key={i} cx={cx} cy={cy} r={i === 0 ? 9 : 5} fill="none" stroke="var(--theme-accent, #00D2FF)" strokeWidth="1.5" className="node-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    ))}
                  </svg>
                )}
                {active.kind === 'players' && (
                  <div className="flex items-center gap-4">
                    {AVATARS.map((a, i) => (
                      <div key={a} className="flex flex-col items-center gap-1.5">
                        <div className="relative">
                          <img src={a} alt="Player avatar" className="h-12 w-12 rounded-lg border border-brand-primary/40 bg-brand-surface" loading="lazy" />
                          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-900 bg-emerald-400" />
                        </div>
                        <span className="font-pixel text-[10px] text-brand-muted">P{i + 1}</span>
                      </div>
                    ))}
                  </div>
                )}
                {active.kind === 'voxels' && (
                  <div className="grid grid-cols-4 gap-2" aria-hidden>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="h-8 w-8 rounded-[3px] border border-brand-primary/40 bg-brand-primary/20"
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.25 }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <p className="relative border-t border-surface-700 px-4 py-2 text-center font-pixel text-xs tracking-[0.25em] text-brand-accent">
              INSERT COIN ▸ {active.word}
            </p>
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}
