import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import PageTransition from '../components/PageTransition'
import { PixellonIcon } from '../components/PixellonLogo'
import { PixelCross, PixelPatternBg } from '../components/BrandDecorations'
import { getTrendingGames, getHighlyRatedGames, getUpcomingGames } from '../utils/api'
import PortalSidebar from '../components/sidebar/PortalSidebar'

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
      <PageTransition className="mx-auto max-w-[1600px] 2xl:max-w-[1720px] px-6 py-20 flex justify-center items-center min-h-[50vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-700 border-t-brand-primary"></div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="mx-auto max-w-[1600px] 2xl:max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-10">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* ── Main Portal Column (70%) ─────────────────────────────── */}
        <div className="xl:col-span-8 2xl:col-span-9 space-y-12">
          {/* ── Brand Hero Section ─────────────────────────────────── */}
          <section id="hero" className="animate-fade-up relative">
            <div className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface p-6 sm:p-10 lg:p-12 shadow-sm">
              <PixelPatternBg />

              <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center">
                {/* Left Content */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-3.5 py-1.5 text-xs font-mono font-medium text-brand-accent">
                    <span className="h-2 w-2 rounded-full bg-brand-accent animate-pulse" />
                    <span>Small pixels. Big possibilities.</span>
                  </div>

                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-text leading-[1.15]">
                    Play. Share.{' '}
                    <span className="text-brand-primary">
                      Belong.
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base leading-relaxed text-brand-muted max-w-xl font-sans">
                    The hub built for every player. From daily breaking updates and indie spotlights to deep-dive codex guides and release drops — small pixels, big possibilities.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link
                      to="/codex"
                      id="hero-cta-codex"
                      className="rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-primary/90 shadow-[0_0_20px_rgba(2,132,199,0.35)] active:scale-95 cursor-pointer font-sans"
                    >
                      Explore The Codex →
                    </Link>
                    <Link
                      to="/gateway"
                      id="hero-cta-gateway"
                      className="rounded-xl border border-surface-700 bg-surface-900 px-5 py-2.5 text-sm font-semibold text-brand-text transition-all duration-200 hover:border-brand-accent/50 hover:bg-surface-800 cursor-pointer font-sans shadow-xs"
                    >
                      Starter Zone
                    </Link>
                  </div>
                </div>

                {/* Right Brand 3D / Badge Card */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-sm rounded-2xl border border-surface-700 bg-surface-900 p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-surface-700 pb-3 mb-5">
                      <div className="flex items-center gap-2">
                        <PixelCross size={13} />
                        <span className="font-mono text-xs font-semibold text-brand-accent uppercase tracking-wider">
                          PIXELLON VIBE
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-brand-muted">v1.0</span>
                    </div>

                    <div className="flex flex-col items-center text-center py-2 space-y-3">
                      <div className="relative group">
                        <div className="absolute -inset-1 rounded-2xl bg-brand-primary/30 opacity-60 blur-sm group-hover:opacity-90 transition-opacity" />
                        <PixellonIcon size={64} className="relative shadow-xl" />
                      </div>
                      
                      <div>
                        <h3 className="font-display text-lg font-bold text-brand-text">
                          Built for Every Player
                        </h3>
                        <p className="mt-1 text-xs text-brand-muted">
                          Games • People • Culture • Community
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-surface-700 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="rounded-lg bg-brand-surface border border-surface-700 p-1.5 shadow-xs">
                        <div className="text-brand-accent font-bold">100%</div>
                        <div className="text-[9px] text-brand-muted">Honest</div>
                      </div>
                      <div className="rounded-lg bg-brand-surface border border-surface-700 p-1.5 shadow-xs">
                        <div className="text-brand-accent2 font-bold">Live</div>
                        <div className="text-[9px] text-brand-muted">Streams</div>
                      </div>
                      <div className="rounded-lg bg-brand-surface border border-surface-700 p-1.5 shadow-xs">
                        <div className="text-brand-accent3 font-bold">Free</div>
                        <div className="text-[9px] text-brand-muted">Drops</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Trending Games ────────────────────────────────────── */}
          <section id="trending-games">
            <SectionHeader
              title="What Everyone's Playing"
              subtitle="Trending titles currently dominating the leaderboards and community chats."
              accent="blue"
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
              {trendingGames.map((game) => (
                <GameCard key={game.id} {...game} variant="featured" tag="TRENDING" tagColor="blue" />
              ))}
            </div>
          </section>

          {/* ── Recent Reviews (Top Picks) ────────────────────────── */}
          <section id="recent-reviews">
            <SectionHeader
              title="Top Rated Reviews"
              subtitle="Critically acclaimed titles tested and rated by the community."
              accent="accent"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {recentReviews.map((game) => (
                <GameCard
                  key={game.id}
                  {...game}
                  tag={game.rating >= 9 ? 'Masterpiece' : 'Great'}
                  tagColor={game.rating >= 9 ? 'emerald' : 'blue'}
                />
              ))}
            </div>
          </section>

          {/* ── Upcoming Releases ─────────────────────────────────── */}
          <section id="upcoming-preview">
            <SectionHeader
              title="On Our Radar"
              subtitle="Confirmed upcoming releases saving up wishlist slots."
              accent="cyan"
            />
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingReleases.slice(0, 6).map((release) => (
                <div
                  key={release.id}
                  className="flex items-center justify-between rounded-xl border border-surface-700 bg-brand-surface px-4 py-3.5 transition-all hover:border-brand-primary/60 hover:shadow-md"
                >
                  <div className="min-w-0 pr-3">
                    <h4 className="text-xs sm:text-sm font-display font-bold text-brand-text truncate">{release.title}</h4>
                    <p className="mt-0.5 text-[11px] text-brand-muted truncate">
                      {release.genre} · {release.platform?.join(', ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-xs font-mono font-medium text-brand-accent">{release.date}</span>
                    <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-brand-accent2">
                      Confirmed
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 text-center">
              <Link
                to="/calendar"
                id="view-full-calendar"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-accent transition-colors hover:text-brand-accent2"
              >
                <span>View Full Calendar</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </section>

          {/* ── Gateway CTA Banner ────────────────────────────────── */}
          <section id="gateway-cta">
            <div className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface p-8 sm:p-10 text-center">
              <PixelPatternBg />
              <div className="relative z-10 flex flex-col items-center justify-center max-w-xl mx-auto">
                <span className="mb-2 text-3xl">🎮</span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-text">
                  New to the Gaming World?
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-muted leading-relaxed">
                  No stress, no gatekeeping. Jump into beginner-friendly titles and jargon-free guides designed for anyone starting out.
                </p>
                <Link
                  to="/gateway"
                  id="gateway-banner-cta"
                  className="mt-5 rounded-xl bg-brand-accent px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 transition-all hover:bg-brand-accent2 shadow-[0_0_16px_rgba(96,165,250,0.4)] active:scale-95 cursor-pointer font-sans"
                >
                  Enter The Gateway →
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* ── Sticky Interactive Sidebar (30%) ─────────────────────── */}
        <div className="xl:col-span-4 2xl:col-span-3 xl:sticky xl:top-20 space-y-6">
          <PortalSidebar />
        </div>
      </div>
    </PageTransition>
  )
}
