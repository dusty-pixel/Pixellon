import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Play,
  CheckCircle2,
  Calendar,
  Clock,
  Trash2,
  Flame,
  Gamepad2,
  Trophy,
} from 'lucide-react'
import TeamLogo from './TeamLogo'

export default function MatchDetailsModal({
  match,
  isOpen,
  onClose,
  onSimulateRound,
  onUpdateScore,
  onDeleteMatch,
}) {
  const [editingScore, setEditingScore] = useState(false)
  const [customScore1, setCustomScore1] = useState(
    match ? match.liveData?.team1Rounds ?? match.results?.[0]?.score ?? 0 : 0
  )
  const [customScore2, setCustomScore2] = useState(
    match ? match.liveData?.team2Rounds ?? match.results?.[1]?.score ?? 0 : 0
  )

  if (!isOpen || !match) return null

  const team1 = match.opponents[0]?.opponent
  const team2 = match.opponents[1]?.opponent
  const mapScore1 = match.results?.[0]?.score ?? 0
  const mapScore2 = match.results?.[1]?.score ?? 0
  const live = match.liveData || {}
  const isRunning = match.status === 'running'
  const isFinished = match.status === 'finished'

  const handleSaveScore = () => {
    onUpdateScore(match.id, parseInt(customScore1, 10), parseInt(customScore2, 10))
    setEditingScore(false)
  }

  const formatMatchTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#1E2638] bg-[#151A24] shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1E2638] bg-[#0B0F17] px-6 py-4">
            <div className="flex items-center gap-3">
              {match.league?.image_url ? (
                <img
                  src={match.league.image_url}
                  alt={match.league.name}
                  className="h-7 w-7 object-contain"
                />
              ) : (
                <Gamepad2 className="h-6 w-6 text-brand-accent" />
              )}
              <div>
                <p className="text-xs font-mono font-bold text-brand-text">
                  {match.league?.name || 'Esports League'}
                </p>
                <p className="text-[11px] font-mono text-brand-muted">
                  {match.serie?.full_name} • {match.videogame?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isRunning && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-[11px] font-mono font-bold text-red-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  LIVE MATCH
                </span>
              )}
              {isFinished && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-mono font-bold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  MATCH COMPLETE
                </span>
              )}
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-brand-muted hover:bg-[#1E2638] hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Match Arena Scoreboard */}
            <div
              className="relative overflow-hidden rounded-3xl border border-[#1E2638] p-6 sm:p-8 shadow-2xl"
              style={{
                background: `
                  radial-gradient(ellipse 70% 60% at 10% 50%, ${team1?.color || '#38BDF8'}25 0%, transparent 65%),
                  radial-gradient(ellipse 70% 60% at 90% 50%, ${team2?.color || '#F43F5E'}25 0%, transparent 65%),
                  #0C101A
                `,
              }}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Team 1 */}
                <div className="flex flex-1 flex-col items-center text-center gap-2">
                  <TeamLogo
                    src={team1?.image_url}
                    name={team1?.name}
                    acronym={team1?.acronym}
                    color={team1?.color}
                    size="xl"
                  />
                  <h3 className="font-display text-base sm:text-lg font-extrabold text-brand-text">
                    {team1?.name}
                  </h3>
                  <span className="text-xs font-mono text-brand-muted">{team1?.acronym}</span>
                </div>

                {/* Score Center */}
                <div className="flex flex-col items-center justify-center px-4">
                  <div className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-brand-text flex items-center gap-3">
                    <span
                      className={
                        mapScore1 > mapScore2
                          ? 'text-brand-accent'
                          : mapScore1 === mapScore2
                          ? 'text-brand-text'
                          : 'text-brand-muted'
                      }
                    >
                      {mapScore1}
                    </span>
                    <span className="text-brand-muted font-normal text-2xl">:</span>
                    <span
                      className={
                        mapScore2 > mapScore1
                          ? 'text-brand-accent'
                          : mapScore1 === mapScore2
                          ? 'text-brand-text'
                          : 'text-brand-muted'
                      }
                    >
                      {mapScore2}
                    </span>
                  </div>

                  <span className="mt-1 text-[11px] font-mono uppercase tracking-widest text-brand-muted">
                    Series Map Score
                  </span>

                  {/* Active Round Score if Live */}
                  {isRunning && (
                    <div className="mt-3 flex flex-col items-center rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400">
                        {live.currentMap || 'Active Map'}
                      </span>
                      <div className="font-mono text-lg font-black text-brand-text">
                        {live.team1Rounds ?? 0} — {live.team2Rounds ?? 0}
                      </div>
                      <span className="text-[10px] font-mono text-brand-muted">
                        {live.roundStatus || 'In Progress'}
                      </span>
                    </div>
                  )}

                  {isFinished && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                      <Trophy className="h-3.5 w-3.5" />
                      {mapScore1 > mapScore2 ? team1?.name : team2?.name} Won
                    </div>
                  )}
                </div>

                {/* Team 2 */}
                <div className="flex flex-1 flex-col items-center text-center gap-2">
                  <TeamLogo
                    src={team2?.image_url}
                    name={team2?.name}
                    acronym={team2?.acronym}
                    color={team2?.color}
                    size="xl"
                  />
                  <h3 className="font-display text-base sm:text-lg font-extrabold text-brand-text">
                    {team2?.name}
                  </h3>
                  <span className="text-xs font-mono text-brand-muted">{team2?.acronym}</span>
                </div>
              </div>

              {/* Match Meta Footer */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#1E2638] pt-4 text-xs font-mono text-brand-muted">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-brand-accent" />
                  <span>{formatMatchTime(match.begin_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-brand-accent" />
                  <span>Best of {match.number_of_games || 3} Series</span>
                </div>
              </div>
            </div>

            {/* Real-time Simulator Controls */}
            {isRunning && (
              <div className="rounded-xl border border-brand-primary/30 bg-[#0B0F17] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-accent flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-400" />
                    Live Round Simulator
                  </h4>
                  <p className="text-xs font-mono text-brand-muted mt-0.5">
                    Trigger live action, advance rounds, or adjust active scores in real time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSimulateRound(match.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-brand-primary hover:bg-blue-600 px-3.5 py-2 text-xs font-mono font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Simulate Next Round
                  </button>

                  <button
                    onClick={() => setEditingScore(!editingScore)}
                    className="rounded-lg border border-[#1E2638] bg-[#151A24] px-3 py-2 text-xs font-mono font-semibold text-brand-muted hover:text-white hover:border-[#2C3549] transition-colors"
                  >
                    {editingScore ? 'Cancel Edit' : 'Edit Score'}
                  </button>
                </div>
              </div>
            )}

            {/* Quick Score Editing Controls */}
            {editingScore && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                <span className="text-xs font-mono font-bold text-amber-400">
                  Direct Score Adjustment (Rounds / Kills)
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-mono text-brand-muted">
                      {team1?.acronym} Rounds
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={customScore1}
                      onChange={(e) => setCustomScore1(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#0B0F17] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-mono text-brand-muted">
                      {team2?.acronym} Rounds
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={customScore2}
                      onChange={(e) => setCustomScore2(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#0B0F17] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSaveScore}
                    className="mt-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-mono font-bold text-white transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {/* Map Breakdown Schedule */}
            {live.maps && live.maps.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-accent">
                  Map Schedule & Breakdown
                </h4>
                <div className="grid gap-2">
                  {live.maps.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-xs font-mono ${
                        m.status === 'live'
                          ? 'border-red-500/40 bg-red-500/10'
                          : m.status === 'finished'
                          ? 'border-[#1E2638] bg-[#0B0F17]'
                          : 'border-dashed border-[#1E2638] bg-[#0B0F17]/50 text-brand-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-brand-text">{m.name}</span>
                        {m.status === 'live' && (
                          <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                            LIVE
                          </span>
                        )}
                        {m.status === 'finished' && m.winner && (
                          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            {m.winner} Won
                          </span>
                        )}
                      </div>

                      <div className="font-mono font-bold">
                        {m.status === 'pending' ? (
                          <span className="text-brand-muted">TBD</span>
                        ) : (
                          <span className="text-brand-text">
                            {m.score1} - {m.score2}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Event Ticker Feed */}
            {live.recentEvents && live.recentEvents.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-accent">
                  Live Match Events & Highlights
                </h4>
                <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4 space-y-2 font-mono text-xs">
                  {live.recentEvents.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-brand-text/90">
                      <span className="text-brand-accent font-bold">•</span>
                      <span className="leading-relaxed">{event}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delete button for custom matches */}
            {match.isCustom && (
              <div className="flex justify-end pt-2 border-t border-[#1E2638]">
                <button
                  onClick={() => {
                    if (window.confirm('Delete this custom match?')) {
                      onDeleteMatch(match.id)
                      onClose()
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Custom Match
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
