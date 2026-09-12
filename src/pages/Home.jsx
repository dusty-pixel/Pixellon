import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import PageTransition from '../components/PageTransition'
import { getTrendingGames, getHighlyRatedGames, getUpcomingGames } from '../utils/api'

export default function Home() {
 const [trendingGames, setTrendingGames] = useState([])
 const [recentReviews, setRecentReviews] = useState([])
 const [upcomingReleases, setUpcomingReleases] = useState([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 async function loadData() {
 try {
 const [trending, reviews, upcoming] = await Promise.all([
 getTrendingGames(),
 getHighlyRatedGames(),
 getUpcomingGames(),
 ])
 setTrendingGames(trending)
 setRecentReviews(reviews)
 setUpcomingReleases(upcoming)
 } catch (err) {
 console.error('Failed to load home page data', err)
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
 <PageTransition className="mx-auto max-w-7xl px-6 py-10 space-y-16">
 {/* ── Hero Section ──────────────────────────────────────── */}
 <section id="hero" className="animate-fade-up">
 <div className="relative overflow-hidden rounded-2xl border border-surface-700 bg-surface-800">
 <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-16">
 <div className="max-w-2xl">
 <span className="mb-4 inline-flex items-center rounded-full bg-pixel-blue/10 px-3 py-1 text-xs font-semibold text-pixel-blue">
 ✦ Hey there!
 </span>
 <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
 Let's play something
 <span className="text-pixel-blue"> Good</span>
 </h1>
 <p className="mt-5 text-lg leading-relaxed text-text-secondary max-w-xl">
 We play a lot of games. Like, probably too many. Here's a roundup of what's currently ruining our sleep schedules, along with some reviews and guides to help you find your next obsession.
 </p>
 <div className="mt-8 flex flex-wrap gap-3">
 <Link
 to="/reviews"
 id="hero-cta-reviews"
 className="rounded-2xl border border-surface-700 bg-pixel-blue px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-pixel-blue/85 active:scale-95"
 >
 Read Our Reviews
 </Link>
 <Link
 to="/gateway"
 id="hero-cta-gateway"
 className="rounded-2xl border border-surface-700 bg-surface-800 px-6 py-3 text-sm font-semibold text-text-primary transition-all hover:border-surface-600"
 >
 New to gaming? Start here →
 </Link>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* ── Trending Games ────────────────────────────────────── */}
 <section id="trending-games">
 <SectionHeader
 title="What Everyone's Playing"
 subtitle="The games that are currently blowing up our Discord."
 accent="violet"
 />
 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
 {trendingGames.map((game) => (
 <GameCard key={game.id} {...game} variant="featured" tag="Trending" tagColor="violet" />
 ))}
 </div>
 </section>

 {/* ── Recent Reviews (Highly Rated) ─────────────────────── */}
 <section id="recent-reviews">
 <SectionHeader
 title="Our Top Picks"
 subtitle="The games we literally can't stop talking about."
 accent="amber"
 />
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 {recentReviews.map((game) => (
 <GameCard
 key={game.id}
 {...game}
 tag={game.rating >= 9 ? 'Masterpiece' : 'Great'}
 tagColor={game.rating >= 9 ? 'emerald' : 'amber'}
 />
 ))}
 </div>
 </section>

 {/* ── Upcoming Releases (Preview) ───────────────────────── */}
 <section id="upcoming-preview">
 <SectionHeader
 title="On Our Radar"
 subtitle="The stuff we're currently saving up for."
 accent="cyan"
 />
 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 {upcomingReleases.slice(0, 6).map((release) => (
 <div
 key={release.id}
 className="flex items-center justify-between rounded-2xl border border-surface-700 bg-surface-800 px-5 py-4 transition-all hover:border-surface-500"
 >
 <div className="min-w-0 pr-4">
 <h4 className="text-sm font-semibold text-text-primary truncate">{release.title}</h4>
 <p className="mt-0.5 text-xs text-text-muted truncate">
 {release.genre} · {release.platform?.join(', ')}
 </p>
 </div>
 <div className="text-right shrink-0">
 <span className="block text-sm font-medium text-signal-blue">{release.date}</span>
 <span className="text-[10px] font-semibold uppercase tracking-wider text-signal-blue">
 Confirmed
 </span>
 </div>
 </div>
 ))}
 </div>
 <div className="mt-6 text-center">
 <Link
 to="/calendar"
 id="view-full-calendar"
 className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-signal-blue"
 >
 View Full Calendar
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
 <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
 </svg>
 </Link>
 </div>
 </section>

 {/* ── Gateway CTA Banner ────────────────────────────────── */}
 <section id="gateway-cta">
 <div className="relative overflow-hidden rounded-2xl border border-surface-700 bg-surface-800">
 <div className="relative flex flex-col items-center justify-center px-8 py-14 text-center">
 <span className="mb-2 text-3xl">🎮</span>
 <h3 className="font-display text-2xl font-bold text-text-primary">
 New to all this?
 </h3>
 <p className="mt-3 max-w-md text-sm text-text-secondary">
 Don't sweat it. We put together a list of chill, easy-to-learn games and guides to help you get started without the stress.
 </p>
 <Link
 to="/gateway"
 id="gateway-banner-cta"
 className="mt-6 rounded-2xl border border-surface-700 bg-signal-blue px-6 py-3 text-sm font-semibold text-surface-950 transition-all hover:bg-signal-blue/85 active:scale-95"
 >
 Show me the ropes
 </Link>
 </div>
 </div>
 </section>
 </PageTransition>
 )
}
