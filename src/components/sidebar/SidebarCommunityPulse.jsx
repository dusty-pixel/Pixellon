import { useState, useEffect } from 'react'
import { MessageSquare, Users, CheckCircle2 } from 'lucide-react'

const INITIAL_POLL = {
  question: 'Most Anticipated 2026 Game?',
  options: [
    { id: 'gta6', text: 'Grand Theft Auto VI', votes: 684 },
    { id: 'mh', text: 'Monster Hunter Wilds', votes: 372 },
    { id: 'doom', text: 'DOOM: The Dark Ages', votes: 228 },
    { id: 'witcher', text: 'The Witcher: Polaris', votes: 142 },
  ],
}

export default function SidebarCommunityPulse() {
  const [selectedOption, setSelectedOption] = useState(() => {
    return localStorage.getItem('pixellon_poll_vote') || null
  })
  const [poll, setPoll] = useState(INITIAL_POLL)
  const [hasVoted, setHasVoted] = useState(Boolean(selectedOption))

  const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0)

  const handleVote = (optionId) => {
    if (hasVoted) return

    setSelectedOption(optionId)
    setHasVoted(true)
    localStorage.setItem('pixellon_poll_vote', optionId)

    setPoll((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      ),
    }))
  }

  return (
    <div className="rounded-2xl border border-surface-700 bg-brand-surface p-5 shadow-xl transition-all hover:border-brand-primary/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#5865F2]" />
          <h3 className="font-display text-sm font-bold text-brand-text">
            Community Pulse
          </h3>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>1,420 Online</span>
        </div>
      </div>

      {/* Interactive Poll */}
      <div className="rounded-xl border border-surface-700 bg-surface-900 p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-accent">
            Poll of the Week
          </span>
          <span className="text-[10px] font-mono text-brand-muted">
            {totalVotes.toLocaleString()} votes
          </span>
        </div>

        <h4 className="font-display text-xs font-bold text-brand-text mb-3">
          {poll.question}
        </h4>

        {/* Options */}
        <div className="space-y-2">
          {poll.options.map((opt) => {
            const percentage = Math.round((opt.votes / totalVotes) * 100)
            const isSelected = selectedOption === opt.id

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleVote(opt.id)}
                disabled={hasVoted}
                className={`relative w-full overflow-hidden rounded-lg border p-2.5 text-left transition-all ${
                  hasVoted ? 'cursor-default' : 'cursor-pointer hover:border-brand-accent/50'
                } ${
                  isSelected
                    ? 'border-brand-primary bg-brand-primary/10'
                    : 'border-surface-700 bg-brand-surface/60'
                }`}
              >
                {/* Progress bar fill */}
                {hasVoted && (
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-700 ${
                      isSelected
                        ? 'bg-brand-primary/25 border-r border-brand-primary'
                        : 'bg-white/5'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0 pr-2">
                    {isSelected && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-accent shrink-0" />
                    )}
                    <span className={`truncate font-medium ${isSelected ? 'text-brand-accent font-bold' : 'text-brand-text'}`}>
                      {opt.text}
                    </span>
                  </div>
                  {hasVoted && (
                    <span className="font-mono text-[11px] font-bold text-zinc-300 shrink-0">
                      {percentage}%
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {hasVoted && (
          <p className="mt-2 text-center text-[10px] font-mono text-emerald-400">
            ✓ Vote recorded! Thanks for participating.
          </p>
        )}
      </div>

      {/* Discord Connect CTA */}
      <a
        href="https://discord.gg"
        target="_blank"
        rel="noreferrer"
        className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#5865F2]/40 bg-[#5865F2]/15 py-2 text-xs font-semibold text-[#8a94fd] transition-all hover:bg-[#5865F2] hover:text-white"
      >
        <Users className="h-3.5 w-3.5" />
        <span>Join Discord Community</span>
      </a>
    </div>
  )
}
