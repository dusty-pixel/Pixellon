import { useState } from 'react'
import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import { recentReviews } from '../data/mockData'

const SORT_OPTIONS = [
  { value: 'date', label: 'Most Recent' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'rating-asc', label: 'Lowest Rated' },
]

const VERDICT_COLORS = {
  Masterpiece: 'bg-accent-emerald/12 text-accent-emerald border-accent-emerald/20',
  Essential: 'bg-accent-violet/12 text-accent-violet border-accent-violet/20',
  Great: 'bg-accent-cyan/12 text-accent-cyan border-accent-cyan/20',
  Good: 'bg-accent-amber/12 text-accent-amber border-accent-amber/20',
}

export default function Reviews() {
  const [sortBy, setSortBy] = useState('date')

  const sortedReviews = [...recentReviews].sort((a, b) => {
    if (sortBy === 'rating-desc') return b.rating - a.rating
    if (sortBy === 'rating-asc') return a.rating - b.rating
    return new Date(b.reviewDate) - new Date(a.reviewDate)
  })

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
      {/* ── Header ────────────────────────────────────────────── */}
      <section id="reviews-header" className="animate-fade-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary">
              Reviews
            </h1>
            <p className="mt-2 text-base text-text-secondary">
              Honest, in-depth verdicts from the Nexus team.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">Sort by</span>
            <select
              id="reviews-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-surface-600 bg-surface-800 px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-accent-violet/50 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── Review Cards ──────────────────────────────────────── */}
      <section id="reviews-feed" className="space-y-6">
        {sortedReviews.map((review) => (
          <article
            key={review.id}
            id={`review-${review.id}`}
            className="group grid gap-6 overflow-hidden rounded-xl border border-surface-700/40 bg-surface-800/30 p-5 transition-all hover:border-surface-600 hover:bg-surface-800/50 md:grid-cols-[280px_1fr]"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg md:aspect-auto md:h-full">
              <img
                src={review.image}
                alt={review.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-950/70 backdrop-blur-sm">
                <span className="text-sm font-bold text-accent-amber">{review.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${VERDICT_COLORS[review.verdict] || VERDICT_COLORS.Good}`}>
                    {review.verdict}
                  </span>
                  <span className="text-xs text-text-muted">{review.genre}</span>
                  <span className="text-text-muted">·</span>
                  <span className="text-xs text-text-muted">{review.platform.join(', ')}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary group-hover:text-accent-violet transition-colors">
                  {review.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{review.excerpt}</p>
              </div>

              {/* Pros / Cons */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <h5 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-emerald">Pros</h5>
                  <ul className="space-y-1">
                    {review.pros?.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                        <span className="mt-0.5 text-accent-emerald">+</span> {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-accent-rose">Cons</h5>
                  <ul className="space-y-1">
                    {review.cons?.map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-text-secondary">
                        <span className="mt-0.5 text-accent-rose">−</span> {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 text-[11px] text-text-muted">
                Reviewed on {new Date(review.reviewDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
