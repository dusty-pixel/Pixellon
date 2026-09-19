import { Star } from 'lucide-react'

const REVIEW_SCORES = [
  {
    title: 'Final Fantasy VII Rebirth',
    score: '9.5',
    verdict: 'Masterpiece',
    platform: 'PS5',
    color: 'text-emerald-400 border-emerald-400/40 bg-emerald-500/10',
  },
  {
    title: "Dragon's Dogma 2",
    score: '9.0',
    verdict: 'Amazing',
    platform: 'PC / PS5',
    color: 'text-brand-accent border-brand-accent/40 bg-brand-primary/10',
  },
  {
    title: 'Rise of the Ronin',
    score: '8.8',
    verdict: 'Great',
    platform: 'PS5',
    color: 'text-teal-400 border-teal-400/40 bg-teal-500/10',
  },
  {
    title: 'Hades II',
    score: '8.5',
    verdict: 'Great',
    platform: 'PC',
    color: 'text-cyan-400 border-cyan-400/40 bg-cyan-500/10',
  },
]

export default function SidebarReviewScores() {
  return (
    <div className="rounded-2xl border border-surface-700 bg-brand-surface p-5 shadow-xl transition-all hover:border-brand-primary/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-400 fill-amber-400/20" />
          <h3 className="font-display text-sm font-bold text-brand-text">
            IGN & Critic Scores
          </h3>
        </div>
        <span className="text-[10px] font-mono text-brand-muted">VERIFIED</span>
      </div>

      {/* Dials Grid */}
      <div className="grid grid-cols-2 gap-3">
        {REVIEW_SCORES.map((rev) => (
          <div
            key={rev.title}
            className="flex flex-col items-center justify-center rounded-xl border border-surface-700 bg-surface-900 p-3 text-center transition-all hover:border-brand-accent/40"
          >
            {/* Score Ring */}
            <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-mono text-sm font-extrabold shadow-sm ${rev.color}`}>
              {rev.score}
            </div>

            {/* Title */}
            <h4 className="mt-2 font-display text-[11px] font-bold text-brand-text line-clamp-1">
              {rev.title}
            </h4>

            {/* Platform & Verdict */}
            <div className="mt-0.5 flex items-center gap-1 text-[9px] font-mono text-brand-muted">
              <span>{rev.platform}</span>
              <span>•</span>
              <span className="text-brand-text font-medium">{rev.verdict}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
