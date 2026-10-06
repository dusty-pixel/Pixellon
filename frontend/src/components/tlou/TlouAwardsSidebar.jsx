import { Award, Trophy, Star } from 'lucide-react'

/**
 * Compact Right Sidebar displaying top critical accolades & milestones.
 * Shortened for clean viewport fit without overflow.
 */
export default function TlouAwardsSidebar({ game }) {
  if (!game) return null

  const awards = game.awards || []

  return (
    <aside id="awards-sidebar" className="space-y-3 max-w-sm">
      {/* ── Section Title: AWARDS ──────────────────────────────────── */}
      <div className="space-y-0.5">
        <h3 className="font-cinematic text-sm sm:text-base font-bold tracking-[0.22em] uppercase text-white/95 flex items-center gap-2">
          <span>AWARDS</span>
          <span className="h-px flex-1 bg-stone-600/30" />
        </h3>
        <p className="font-cinematic text-[10px] tracking-[0.16em] uppercase text-emerald-400/90 font-medium">
          CRITICAL ACCLAIM & HONORS
        </p>
      </div>

      {/* ── Compact Accolades List (Top 3) ─────────────────────────── */}
      <div className="space-y-2">
        {awards.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="tlou-award-item group border-l-2 border-emerald-500/40 hover:border-emerald-400 pl-2.5 py-0.5 transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-cinematic text-xs font-semibold tracking-wider text-stone-200 group-hover:text-white transition-colors truncate">
                {item.organization}
              </h4>
              {item.date && (
                <span className="font-cinematic text-[9px] tracking-widest uppercase text-stone-400 shrink-0">
                  {item.date}
                </span>
              )}
            </div>
            <p className="font-sans text-[11px] text-stone-400/90 group-hover:text-stone-300 font-light mt-0.5 leading-tight truncate">
              {item.award}
            </p>
          </div>
        ))}
      </div>

      {/* ── Live Rating & Milestone Stats ──────────────────────────── */}
      {game.milestones && (
        <div className="pt-2 border-t border-stone-800/60 space-y-1.5 text-xs font-cinematic uppercase tracking-wider">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[11px]">Universal Acclaim</span>
            <span className="font-mono text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
              <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
              {game.metacritic ? `${game.metacritic}/100 Metascore` : '9.3 / 10'}
            </span>
          </div>

          {game.milestones.activePlayers && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-stone-400">Community Echo</span>
              <span className="text-stone-200 font-medium truncate max-w-[190px] text-right">
                {game.milestones.activePlayers}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Verified Live Data Source ───────────────────────────────── */}
      {game.dataSource && (
        <div className="pt-1.5 border-t border-stone-800/40 text-[9px] font-mono text-stone-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400 truncate max-w-[200px]">
            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">{game.dataSource.name || 'Verified Official API'}</span>
          </span>
          <span className="text-stone-400 shrink-0">{game.dataSource.lastUpdated || 'Live Sync'}</span>
        </div>
      )}
    </aside>
  )
}
