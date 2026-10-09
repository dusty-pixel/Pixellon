import { useState } from 'react'
import SectionHeader from '../SectionHeader'
import { SectionReveal } from '../motion/Reveal'
import { useDiscovery } from '../../gamification/XPProvider'

const NODES = [
  { id: 'WORLD 01', x: 60, y: 40, players: 42, activity: 'HIGH', note: 'Speedrun relays nightly' },
  { id: 'WORLD 02', x: 170, y: 28, players: 128, activity: 'SURGE', note: 'Tournament floor live' },
  { id: 'WORLD 03', x: 280, y: 55, players: 17, activity: 'COZY', note: 'Cozy builders welcome' },
  { id: 'WORLD 04', x: 110, y: 130, players: 64, activity: 'HIGH', note: 'Retro cabinet row' },
  { id: 'WORLD 05', x: 230, y: 140, players: 9, activity: 'QUIET', note: 'Solo dev hideout' },
  { id: 'HUB ◎', x: 170, y: 88, players: 260, activity: 'ONLINE', note: 'Central arena relay', hub: true },
]

const LINKS = [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [0, 3], [1, 2]]

/** Futuristic discovery grid: hover a node to inspect the world. */
export default function DiscoverNet() {
  const [sel, setSel] = useState(NODES[5])
  const discover = useDiscovery('discovery-grid', 'DISCOVERY GRID', 10)

  return (
    <section id="discover" ref={discover}>
      <SectionHeader index="03" title="Discovery Grid" subtitle="Six live worlds on the relay. Hover a node to inspect it." />
      <SectionReveal>
        <div className="grid gap-4 overflow-hidden rounded-2xl border border-surface-700 bg-surface-900 p-4 sm:p-6 lg:grid-cols-12">
          <svg viewBox="0 0 340 180" className="w-full lg:col-span-8" role="img" aria-label="Network of discoverable game worlds">
            <defs>
              <pattern id="gridp" width="17" height="17" patternUnits="userSpaceOnUse">
                <path d="M17 0H0V17" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="340" height="180" fill="url(#gridp)" rx="8" />
            {LINKS.map(([a, b], i) => (
              <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke="var(--theme-accent, #00D2FF)" strokeOpacity="0.25" />
            ))}
            {NODES.map((n) => (
              <g
                key={n.id}
                onMouseEnter={() => setSel(n)}
                onFocus={() => setSel(n)}
                tabIndex={0}
                className="cursor-pointer"
                role="button"
                aria-label={`Inspect ${n.id}`}
              >
                <circle cx={n.x} cy={n.y} r={n.hub ? 22 : 15} fill="transparent" />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.hub ? 11 : 7}
                  fill={sel.id === n.id ? 'var(--theme-accent, #00D2FF)' : 'transparent'}
                  stroke="var(--theme-accent, #00D2FF)"
                  strokeWidth="1.5"
                  className=""
                />
                <text x={n.x} y={n.y + (n.hub ? 26 : 20)} textAnchor="middle" fill="var(--theme-muted, #94A3B8)" fontSize="8" fontFamily="monospace">
                  {n.id}
                </text>
              </g>
            ))}
          </svg>

          {/* HUD readout */}
          <div className="rounded-xl border border-brand-primary/30 bg-brand-surface p-4 font-mono text-xs lg:col-span-4" aria-live="polite">
            <p className="font-pixel text-sm tracking-[0.25em] text-brand-accent">◉ AREA FOUND</p>
            <p className="mt-2 font-display text-xl font-bold text-brand-text">{sel.id}</p>
            <dl className="mt-3 space-y-1.5">
              {[
                ['STATUS', 'ONLINE', 'text-emerald-400'],
                ['PLAYERS', String(sel.players), 'text-brand-text'],
                ['ACTIVITY', sel.activity, 'text-brand-accent'],
              ].map(([k, v, c]) => (
                <div key={k} className="flex justify-between border-b border-surface-700 pb-1.5">
                  <dt className="text-brand-muted">{k}</dt>
                  <dd className={`font-bold ${c}`}>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-brand-muted">{sel.note}</p>
          </div>
        </div>
      </SectionReveal>
    </section>
  )
}
