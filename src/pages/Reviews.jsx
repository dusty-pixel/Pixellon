import { useState, useEffect } from 'react'
import PageTransition from '../components/PageTransition'
import { getAllTimeTopGames } from '../utils/api'

export default function Reviews() {
 const [reviews, setReviews] = useState([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 async function loadData() {
 try {
 const data = await getAllTimeTopGames()
 // Sort initial data by metacritic rating desc
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
 <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-700 border-t-pixel-blue"></div>
 </PageTransition>
 )
 }

 return (
 <PageTransition className="mx-auto max-w-7xl px-6 py-10 space-y-10">
 {/* ── Header ────────────────────────────────────────────── */}
 <section id="reviews-header" className="animate-fade-up">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary">
 Hall of Fame
 </h1>
 <p className="mt-2 text-base text-text-secondary">
 The highest-rated games of all time, based on Metacritic scores.
 </p>
 </div>
 </div>
 </section>

 {/* ── Review Cards ──────────────────────────────────────── */}
 <section id="reviews-feed" className="space-y-6">
 {reviews.map((review, index) => (
 <article
 key={review.id}
 id={`review-${review.id}`}
 className="group grid gap-6 overflow-hidden rounded-2xl border border-surface-700 shadow-lg bg-surface-800 p-5 transition-all hover:border-surface-600 hover:bg-surface-800 md:grid-cols-[280px_1fr]"
 >
 {/* Image */}
 <div className="relative aspect-[16/10] overflow-hidden rounded-none md:aspect-auto md:h-full">
 <img
 src={review.image}
 alt={review.title}
 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
 loading="lazy"
 />
 <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-surface-700 shadow-lg bg-surface-950 ">
 <span className="text-sm font-bold text-pixel-blue">{review.rating ? (review.rating * 10) : 'N/A'}</span>
 </div>
 <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-950 ">
 <span className="text-sm font-bold text-text-primary">#{index + 1}</span>
 </div>
 </div>

 {/* Content */}
 <div className="flex flex-col justify-center py-4">
 <div>
 <div className="mb-2 flex flex-wrap items-center gap-2">
 <span className="inline-flex items-center rounded-full border border-signal-blue/20 bg-signal-blue/12 px-3 py-0.5 text-xs font-semibold text-signal-blue">
 Masterpiece
 </span>
 <span className="text-xs text-text-muted">{review.genre}</span>
 <span className="text-text-muted">·</span>
 <span className="text-xs text-text-muted">{review.platform.join(', ')}</span>
 </div>
 <h3 className="font-display text-2xl font-bold text-text-primary group-hover:text-pixel-blue transition-colors">
 {review.title}
 </h3>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary">
 Released on {new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
 </p>
 <div className="mt-6">
 <a
 href={`https://rawg.io/games/${review.id}`}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center text-sm font-semibold text-pixel-blue hover:text-signal-blue transition-colors"
 >
 View Details on RAWG <span className="ml-1">→</span>
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
