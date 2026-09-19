import { useState, useEffect } from 'react'
import PageTransition from '../components/PageTransition'
import { PixelCross, PixelPatternBg } from '../components/BrandDecorations'
import { getAllTimeTopGames } from '../utils/api'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAllTimeTopGames()
        setReviews(data)
      } catch (err) {
        console.error('Failed to load reviews', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <PageTransition className="mx-auto max-w-7xl px-6 py-20 flex justify-center items-center min-h-[50vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-700 border-t-brand-primary"></div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* ── Header ────────────────────────────────────────────── */}
      <section id="reviews-header" className="animate-fade-up relative">
        <div className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface p-8 sm:p-10">
          <PixelPatternBg />
          <div className="relative z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <PixelCross size={14} />
              <span className="font-mono text-xs font-semibold text-brand-accent uppercase tracking-wider">
                PIXELLON RATINGS
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-text">
              Hall of Fame Reviews
            </h1>
            <p className="text-sm sm:text-base text-brand-muted max-w-xl">
              The highest-rated games of all time scored by consensus. Pure masterpieces only.
            </p>
          </div>
        </div>
      </section>

      {/* ── Review Cards ──────────────────────────────────────── */}
      <section id="reviews-feed" className="space-y-5">
        {reviews.map((review, index) => (
          <article
            key={review.id}
            id={`review-${review.id}`}
            className="group grid gap-6 overflow-hidden rounded-xl border border-surface-700 bg-brand-surface p-5 transition-all hover:border-brand-primary hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] md:grid-cols-[280px_1fr]"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg md:aspect-auto md:h-full">
              <img
                src={review.image}
                alt={review.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-surface-700 bg-surface-900/90 shadow-md">
                <span className="text-sm font-bold font-mono text-brand-accent">{review.rating ? (review.rating * 10) : 'N/A'}</span>
              </div>
              <div className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-md bg-surface-900/90 border border-surface-700">
                <span className="text-xs font-mono font-bold text-brand-text">#{index + 1}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center py-2">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border border-brand-primary/30 bg-brand-primary/10 text-brand-accent">
                    Masterpiece
                  </span>
                  <span className="text-xs font-mono text-brand-muted">{review.genre}</span>
                  <span className="text-brand-muted">•</span>
                  <span className="text-xs font-medium text-brand-muted">{review.platform?.join(', ')}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-brand-text group-hover:text-brand-accent transition-colors">
                  {review.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-brand-muted font-sans">
                  Released {new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="mt-5">
                  <a
                    href={`https://rawg.io/games/${review.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-brand-accent hover:text-brand-accent2 transition-colors"
                  >
                    <span>View RAWG Data</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </PageTransition>
  )
}
