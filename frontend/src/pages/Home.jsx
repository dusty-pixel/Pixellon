import { Suspense, lazy, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import PageTransition from '../components/PageTransition'
import { PixellonIcon } from '../components/PixellonLogo'
import { PixelPatternBg } from '../components/BrandDecorations'
import MagneticButton from '../components/motion/MagneticButton'
import { StaggerWord, Stagger, StaggerItem, CountUp, SectionReveal } from '../components/motion/Reveal'
import { getTrendingGames, getHighlyRatedGames, getUpcomingGames } from '../utils/api'
import { trendingGames as mockTrending, recentReviews as mockReviews, upcomingReleases as mockUpcoming } from '../data/mockData'
import PortalSidebar from '../components/sidebar/PortalSidebar'
import ChoosePath from '../components/home/ChoosePath'
import DiscoverNet from '../components/home/DiscoverNet'
import CommunityLobby from '../components/home/CommunityLobby'
import BuildSection from '../components/home/BuildSection'
import EndOfLevel from '../components/home/EndOfLevel'
import { useXP, useDiscovery } from '../gamification/XPProvider'
import { VoxelDivider, ParallaxRise } from '../components/motion/Scroll3D'
import { usePointer } from '../motion/MotionProvider'

const ArenaScene = lazy(() => import('../components/webgl/ArenaScene'))

export default function Home() {
  const [trendingGames, setTrendingGames] = useState([])
  const [recentReviews, setRecentReviews] = useState([])
  const [upcomingReleases, setUpcomingReleases] = useState([])
  const [loading, setLoading] = useState(true)
  const { awardXP } = useXP()
  const { reduced, motionMode } = usePointer()
  const showWebGL = !reduced && motionMode === 'full'

  const discoverLibrary = useDiscovery('game-library', 'GAME LIBRARY', 20)
  const discoverReviews = useDiscovery('review-vault', 'REVIEW VAULT', 10)
  const discoverRadar = useDiscovery('release-radar', 'RELEASE RADAR', 10)
  const discoverGateway = useDiscovery('the-gateway', 'THE GATEWAY', 10)

  useEffect(() => {
    async function loadData() {
      try {
        const [trending, reviews, upcoming] = await Promise.all([
          getTrendingGames(),
          getHighlyRatedGames(),
          getUpcomingGames(),
        ])
        setTrendingGames(trending.length ? trending : mockTrending)
        setRecentReviews(reviews.length ? reviews : mockReviews)
        setUpcomingReleases(upcoming.length ? upcoming : mockUpcoming)
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
    <PageTransition className="relative mx-auto max-w-[1600px] 2xl:max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-10">
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* ── Main Portal Column (70%) ─────────────────────────────── */}
        <div className="xl:col-span-8 2xl:col-span-9 space-y-16">
          {/* ── Arena Hero ─────────────────────────────────────────── */}
          <section id="hero" className="relative">
            <div className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface shadow-sm">
              {/* WebGL universe behind content */}
              {showWebGL ? (
                <Suspense fallback={null}>
                  <ArenaScene />
                </Suspense>
              ) : (
                <div aria-hidden className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-24 left-1/3 h-72 w-[480px] rounded-full bg-brand-primary/15 blur-[100px]" />
                  <div className="absolute bottom-0 right-0 h-56 w-72 rounded-full bg-brand-accent/10 blur-[90px]" />
                </div>
              )}
              {/* readability gradient */}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--theme-surface)] via-[var(--theme-surface)]/72 to-transparent" />

              <div className="relative z-10 grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:p-12">
                {/* Left Content */}
                <div className="space-y-5 lg:col-span-7">
                  <div className="neon-sign inline-flex items-center gap-2 px-3 py-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute h-full w-full animate-ping rounded-[2px] bg-brand-accent opacity-70" />
                      <span className="h-1.5 w-1.5 rounded-[2px] bg-brand-accent" />
                    </span>
                    <span className="neon-sign-text font-pixel text-sm tracking-[0.25em]">PIXELLON</span>
                  </div>

                  <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-brand-text sm:text-5xl lg:text-6xl">
                    <StaggerWord text="PLAY." className="block" delay={0.1} />
                    <StaggerWord text="SHARE." className="block text-brand-muted" delay={0.32} as="span" />
                    <StaggerWord text="BELONG." className="block text-brand-primary" delay={0.54} as="span" />
                  </h1>

                  <p className="max-w-xl font-sans text-sm leading-relaxed text-brand-muted sm:text-base">
                    Track verified free giveaways, live esports tournaments, breaking game updates, and community vault guides all in one place.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <MagneticButton
                      to="/vault"
                      id="hero-cta-vault"
                      onClick={() => awardXP(5, 'Path chosen')}
                      className="rounded-lg bg-brand-primary px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-brand-primary/90"
                    >
                      Browse Game Vault →
                    </MagneticButton>
                    <MagneticButton
                      to="/free-games"
                      id="hero-cta-free-games"
                      strength={0.2}
                      className="rounded-lg border border-surface-700 bg-surface-900 px-5 py-2.5 font-sans text-sm font-semibold text-brand-text transition-colors duration-150 hover:border-brand-accent/50 hover:bg-surface-800"
                    >
                      Free Games Vault
                    </MagneticButton>
                  </div>
                </div>

                {/* Right Brand Stats Card */}
                <ParallaxRise className="flex justify-center lg:col-span-5" amount={30} tilt={2}>
                  <div className="w-full max-w-sm rounded-2xl border border-surface-700 bg-surface-900/85 p-6 shadow-md backdrop-blur-sm">
                    <div className="mb-5 flex items-center justify-between border-b border-surface-700 pb-3">
                      <div className="flex items-center gap-2">
                        <PixellonIcon size={18} />
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-text">
                          LIVE RADAR STATS
                        </span>
                      </div>
                      <span className="rounded border border-brand-primary/20 bg-brand-primary/10 px-2 py-0.5 font-mono text-[10px] text-brand-accent">ONLINE</span>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between rounded-lg border border-surface-700 bg-brand-surface p-2.5">
                        <span className="text-brand-muted">Catalog Games</span>
                        <span className="font-bold text-brand-text"><CountUp to={1840} suffix="+" /> Titles</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-surface-700 bg-brand-surface p-2.5">
                        <span className="text-brand-muted">Active Giveaways</span>
                        <span className="font-bold text-brand-accent">100% OFF Steam/Epic</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-surface-700 bg-brand-surface p-2.5">
                        <span className="text-brand-muted">Tournament Feeds</span>
                        <span className="font-bold text-brand-accent">Real-Time Sync</span>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-surface-700 pt-3 text-center">
                      <span className="font-mono text-[11px] text-brand-muted">Independent • Real-Time • No Paywalls</span>
                    </div>
                  </div>
                </ParallaxRise>
              </div>
            </div>
          </section>

          {/* ── Choose Your Path ──────────────────────────────────── */}
          <ChoosePath />

          {/* ── Trending Games ────────────────────────────────────── */}
          <section id="trending-games" ref={discoverLibrary}>
            <SectionHeader
              index="02"
              title="What Everyone's Playing"
              subtitle="Trending titles currently dominating the leaderboards and community chats."
              accent="blue"
            />
            <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3">
              {trendingGames.map((game) => (
                <StaggerItem key={game.id} className="h-full">
                  <GameCard {...game} variant="featured" tag="TRENDING" tagColor="blue" />
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          {/* ── Discovery Grid ────────────────────────────────────── */}
          <VoxelDivider />
          <DiscoverNet />

          {/* ── Community Lobby ───────────────────────────────────── */}
          <CommunityLobby />

          {/* ── Build Bay ─────────────────────────────────────────── */}
          <VoxelDivider flip />
          <BuildSection />

          {/* ── Recent Reviews (Top Picks) ────────────────────────── */}
          <section id="recent-reviews" ref={discoverReviews}>
            <SectionHeader
              index="06"
              title="Top Rated Reviews"
              subtitle="Critically acclaimed titles tested and rated by the community."
              accent="accent"
            />
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4" stagger={0.06}>
              {recentReviews.map((game) => (
                <StaggerItem key={game.id} className="h-full">
                  <GameCard
                    {...game}
                    tag={game.rating >= 9 ? 'Masterpiece' : 'Great'}
                    tagColor={game.rating >= 9 ? 'emerald' : 'blue'}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          {/* ── Upcoming Releases ─────────────────────────────────── */}
          <section id="upcoming-preview" ref={discoverRadar}>
            <SectionHeader
              index="07"
              title="On Our Radar"
              subtitle="Confirmed upcoming releases saving up wishlist slots."
              accent="cyan"
            />
            <Stagger className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
              {upcomingReleases.slice(0, 6).map((release) => (
                <StaggerItem key={release.id}>
                  <div
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
                </StaggerItem>
              ))}
            </Stagger>
            <div className="mt-5 text-center">
              <Link
                to="/calendar"
                id="view-full-calendar"
                className="arena-link inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-accent transition-colors hover:text-brand-accent2"
              >
                <span>View Full Calendar</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </section>

          {/* ── Gateway CTA Banner ────────────────────────────────── */}
          <section id="gateway-cta" ref={discoverGateway}>
            <SectionReveal>
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
                  <MagneticButton
                    to="/gateway"
                    id="gateway-banner-cta"
                    className="mt-5 rounded-xl bg-brand-accent px-5 py-2.5 font-sans text-xs sm:text-sm font-bold text-slate-950 shadow-[0_0_16px_rgba(96,165,250,0.4)]"
                  >
                    Enter The Gateway →
                  </MagneticButton>
                </div>
              </div>
            </SectionReveal>
          </section>

          {/* ── End of Level ──────────────────────────────────────── */}
          <VoxelDivider />
          <EndOfLevel />
        </div>

        {/* ── Sticky Interactive Sidebar (30%) ─────────────────────── */}
        <div className="xl:col-span-4 2xl:col-span-3 xl:sticky xl:top-20 space-y-6">
          <PortalSidebar />
        </div>
      </div>
    </PageTransition>
  )
}
