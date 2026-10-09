import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import PortalHero from '../components/home/PortalHero'
import SectionHeader from '../components/SectionHeader'
import GameCard from '../components/GameCard'
import ChoosePath from '../components/home/ChoosePath'
import QuickUpdates from '../components/home/QuickUpdates'
import DiscoverNet from '../components/home/DiscoverNet'
import CommunityLobby from '../components/home/CommunityLobby'
import BuildSection from '../components/home/BuildSection'
import HomeFaq from '../components/home/HomeFaq'
import EndOfLevel from '../components/home/EndOfLevel'
import PortalSidebar from '../components/sidebar/PortalSidebar'
import MagneticButton from '../components/motion/MagneticButton'
import { Stagger, StaggerItem, SectionReveal } from '../components/motion/Reveal'
import { VoxelDivider } from '../components/motion/Scroll3D'
import { PixelPatternBg } from '../components/BrandDecorations'
import { getTrendingGames, getHighlyRatedGames, getUpcomingGames, getEsportsMatches, getGamingNews } from '../utils/api'
import { trendingGames as mockTrending, recentReviews as mockReviews, upcomingReleases as mockUpcoming } from '../data/mockData'
import { useDiscovery } from '../gamification/XPProvider'

export default function Home() {
  const navigate = useNavigate()

  // Portal data state
  const [trendingGames, setTrendingGames] = useState(mockTrending)
  const [recentReviews, setRecentReviews] = useState(mockReviews)
  const [upcomingReleases, setUpcomingReleases] = useState(mockUpcoming)
  const [quickMatches, setQuickMatches] = useState([])
  const [quickNews, setQuickNews] = useState([])

  const discoverLibrary = useDiscovery('game-library', 'GAME LIBRARY', 20)
  const discoverReviews = useDiscovery('review-vault', 'REVIEW VAULT', 10)
  const discoverRadar = useDiscovery('release-radar', 'RELEASE RADAR', 10)
  const discoverGateway = useDiscovery('the-gateway', 'THE GATEWAY', 10)

  // Load portal data
  useEffect(() => {
    async function loadData() {
      try {
        const [trending, reviews, upcoming, matches, news] = await Promise.all([
          getTrendingGames(),
          getHighlyRatedGames(),
          getUpcomingGames(),
          getEsportsMatches(),
          getGamingNews(),
        ])

        setTrendingGames(trending.length ? trending : mockTrending)
        setRecentReviews(reviews.length ? reviews : mockReviews)
        setUpcomingReleases(upcoming.length ? upcoming : mockUpcoming)
        setQuickMatches(Array.isArray(matches) ? matches.slice(0, 8) : [])
        setQuickNews(Array.isArray(news) ? news.slice(0, 10) : [])
      } catch (err) {
        console.error('Failed to load home page data', err)
      }
    }
    loadData()
  }, [])

  // Handle live search
  const handleOpenSearch = (query) => {
    navigate(`/vault?search=${encodeURIComponent(query)}`)
  }

  return (
    <PageTransition className="relative w-full overflow-hidden">
      {/* ── 1. Portal landing — Pixellon intro, not a single game ─── */}
      <PortalHero onSearch={handleOpenSearch} />

      {/* ── 2. Quick updates — moving carousels ──────────────────── */}
      <QuickUpdates games={trendingGames} matches={quickMatches} news={quickNews} />

      {/* ── 3. Pixellon Core Portal & Community Layout ─────────────── */}
      <div className="relative z-10 max-w-[1600px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Main Portal Column (70%) */}
          <div className="xl:col-span-8 2xl:col-span-9 space-y-16">
            {/* Choose Your Path */}
            <ChoosePath />

            {/* Trending Games in Vault */}
            <section id="trending-games" ref={discoverLibrary}>
              <SectionHeader
                index="02"
                title="What Everyone's Playing"
                subtitle="Dominating the leaderboards, stream charts, and player communities this week."
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

            {/* Discovery Grid */}
            <VoxelDivider />
            <DiscoverNet />

            {/* Community Lobby */}
            <CommunityLobby />

            {/* Build Bay */}
            <VoxelDivider flip />
            <BuildSection />

            {/* Top Rated Reviews */}
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

            {/* Upcoming Releases */}
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
                    <div className="flex items-center justify-between rounded-xl border border-surface-700 bg-brand-surface px-4 py-3.5 transition-all hover:border-brand-primary/60 hover:shadow-md">
                      <div className="min-w-0 pr-3">
                        <h4 className="text-xs sm:text-sm font-display font-bold text-brand-text truncate">
                          {release.title}
                        </h4>
                        <p className="mt-0.5 text-[11px] text-brand-muted truncate">
                          {release.genre} · {release.platform?.join(', ')}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-xs font-mono font-medium text-brand-accent">
                          {release.date}
                        </span>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </section>

            {/* Gateway CTA Banner */}
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
                      No stress, no gatekeeping. Jump into beginner-friendly titles and jargon-free
                      guides designed for anyone starting out.
                    </p>
                    <MagneticButton
                      to="/gateway"
                      id="gateway-banner-cta"
                      className="mt-5 rounded-xl bg-brand-accent px-5 py-2.5 font-sans text-xs sm:text-sm font-bold text-slate-950"
                    >
                      Enter The Gateway →
                    </MagneticButton>
                  </div>
                </div>
              </SectionReveal>
            </section>

            {/* End of Level */}
            <VoxelDivider />
            <EndOfLevel />

            {/* Quick answers (AEO/GEO) */}
            <HomeFaq />
          </div>

          {/* Sticky Interactive Sidebar (30%) */}
          <div className="xl:col-span-4 2xl:col-span-3 xl:sticky xl:top-20 space-y-6">
            <PortalSidebar />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
