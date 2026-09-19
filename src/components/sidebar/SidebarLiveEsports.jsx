import { Link } from 'react-router-dom'
import { Trophy, ChevronRight } from 'lucide-react'
import { initialEsportsMatches } from '../../data/esportsData'

export default function SidebarLiveEsports() {
  // Find currently running match or first match
  const liveMatch = initialEsportsMatches.find((m) => m.status === 'running') || initialEsportsMatches[0]

  if (!liveMatch) return null

  const isLive = liveMatch.status === 'running'

  return (
    <div className="rounded-2xl border border-surface-700 bg-brand-surface p-5 shadow-xl transition-all hover:border-brand-primary/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-brand-accent" />
          <h3 className="font-display text-sm font-bold text-brand-text">
            Live Esports Arena
          </h3>
        </div>
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            LIVE
          </span>
        ) : (
          <span className="rounded bg-surface-900 px-2 py-0.5 text-[10px] font-mono text-brand-muted border border-surface-700">
            UPCOMING
          </span>
        )}
      </div>

      {/* Tournament info */}
      <div className="text-xs font-mono text-brand-muted mb-3 flex items-center justify-between">
        <span className="truncate max-w-[180px] font-medium text-brand-text">
          {liveMatch.league?.name || 'Pro Global Circuit'}
        </span>
        <span className="rounded bg-surface-900 px-1.5 py-0.5 text-[10px] text-brand-accent border border-surface-700">
          {liveMatch.game}
        </span>
      </div>

      {/* Match Scoreboard */}
      <div className="rounded-xl border border-surface-700 bg-surface-900 p-4">
        <div className="grid grid-cols-5 items-center gap-2 text-center">
          {/* Team 1 */}
          <div className="col-span-2 flex flex-col items-center">
            <div className="relative h-11 w-11 rounded-lg bg-brand-surface p-1.5 border border-surface-700 flex items-center justify-center">
              {liveMatch.team1?.logo ? (
                <img
                  src={liveMatch.team1.logo}
                  alt={liveMatch.team1.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <span className="font-mono text-xs font-bold text-brand-text">
                  {liveMatch.team1?.acronym || 'T1'}
                </span>
              )}
            </div>
            <span className="mt-1.5 font-display text-xs font-bold text-brand-text truncate w-full">
              {liveMatch.team1?.acronym || liveMatch.team1?.name}
            </span>
          </div>

          {/* Score */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 font-mono text-base font-extrabold text-brand-text">
              <span className={liveMatch.team1?.score > liveMatch.team2?.score ? 'text-brand-accent' : ''}>
                {liveMatch.team1?.score ?? 0}
              </span>
              <span className="text-brand-muted text-xs">:</span>
              <span className={liveMatch.team2?.score > liveMatch.team1?.score ? 'text-brand-accent' : ''}>
                {liveMatch.team2?.score ?? 0}
              </span>
            </div>
            {liveMatch.currentRound && (
              <span className="mt-1 rounded bg-brand-surface px-1.5 py-0.5 text-[9px] font-mono text-brand-muted border border-surface-700 whitespace-nowrap">
                {liveMatch.currentRound.team1Score} - {liveMatch.currentRound.team2Score}
              </span>
            )}
          </div>

          {/* Team 2 */}
          <div className="col-span-2 flex flex-col items-center">
            <div className="relative h-11 w-11 rounded-lg bg-brand-surface p-1.5 border border-surface-700 flex items-center justify-center">
              {liveMatch.team2?.logo ? (
                <img
                  src={liveMatch.team2.logo}
                  alt={liveMatch.team2.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                <span className="font-mono text-xs font-bold text-brand-text">
                  {liveMatch.team2?.acronym || 'T2'}
                </span>
              )}
            </div>
            <span className="mt-1.5 font-display text-xs font-bold text-brand-text truncate w-full">
              {liveMatch.team2?.acronym || liveMatch.team2?.name}
            </span>
          </div>
        </div>

        {/* Round Situation / Map */}
        {liveMatch.currentRound?.situation && (
          <div className="mt-3 pt-2.5 border-t border-surface-700 flex items-center justify-between text-[11px] font-mono">
            <span className="text-brand-muted truncate max-w-[140px]">
              Map: {liveMatch.currentMap || 'Inferno'}
            </span>
            <span className="text-amber-400 font-semibold truncate max-w-[120px]">
              {liveMatch.currentRound.situation}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <Link
        to="/esports"
        className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-surface-700 bg-surface-900 py-2 text-xs font-semibold text-brand-accent transition-all hover:bg-brand-primary/10 hover:border-brand-primary/40"
      >
        <span>Open Match Center</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
