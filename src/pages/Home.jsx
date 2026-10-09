import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import { trendingGames, recentReviews, upcomingReleases } from '../data/mockData'

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">
      {/* ── Hero Section ──────────────────────────────────────── */}
      <section id="hero" className="animate-fade-up">
        <div className="relative overflow-hidden rounded-2xl border border-surface-700/40 bg-surface-800/30">
          <div className="relative px-8 py-16 sm:px-12 sm:py-20 lg:px-16">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center rounded-full bg-accent-violet/10 px-3 py-1 text-xs font-semibold text-accent-violet">
                ✦ Welcome to Nexus
              </span>
              <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                Your Portal to the
                <span className="text-accent-violet"> Gaming Universe</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-text-secondary max-w-xl">
                Discover trending titles, explore indie gems, read in-depth reviews, and never miss a release. Whether you're a veteran or just starting out — Nexus has you covered.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/reviews"
                  id="hero-cta-reviews"
                  className="rounded-xl bg-accent-violet px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-violet/85 active:scale-95"
                >
                  Read Reviews
                </a>
                <a
                  href="/gateway"
                  id="hero-cta-gateway"
                  className="rounded-xl border border-surface-600 bg-surface-800/50 px-6 py-3 text-sm font-semibold text-text-primary transition-all hover:border-accent-cyan/40 hover:text-accent-cyan"
                >
                  New to Gaming? Start Here →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trending Games ────────────────────────────────────── */}
      <section id="trending-games">
        <SectionHeader
          title="Trending Now"
          subtitle="The games everyone is talking about this week."
          accent="violet"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trendingGames.map((game) => (
            <GameCard key={game.id} {...game} variant="featured" />
          ))}
        </div>
      </section>

      {/* ── Recent Reviews ────────────────────────────────────── */}
      <section id="recent-reviews">
        <SectionHeader
          title="Latest Reviews"
          subtitle="In-depth verdicts from the Nexus team."
          accent="amber"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recentReviews.map((review) => (
            <GameCard
              key={review.id}
              {...review}
              tag={review.verdict}
              tagColor={review.rating >= 9 ? 'emerald' : 'amber'}
            />
          ))}
        </div>
      </section>

      {/* ── Upcoming Releases (Preview) ───────────────────────── */}
      <section id="upcoming-preview">
        <SectionHeader
          title="Coming Soon"
          subtitle="Mark your calendars — these are on the horizon."
          accent="cyan"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingReleases.slice(0, 6).map((release) => (
            <div
              key={release.id}
              className="flex items-center justify-between rounded-xl border border-surface-700/40 bg-surface-800/30 px-5 py-4 transition-all hover:border-surface-600 hover:bg-surface-800/50"
            >
              <div>
                <h4 className="text-sm font-semibold text-text-primary">{release.title}</h4>
                <p className="mt-0.5 text-xs text-text-muted">
                  {release.genre} · {release.platform.join(', ')}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-sm font-medium text-accent-cyan">{release.date}</span>
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                  release.status === 'confirmed' ? 'text-accent-emerald' : 'text-accent-amber'
                }`}>
                  {release.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a
            href="/calendar"
            id="view-full-calendar"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-accent-cyan"
          >
            View Full Calendar
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </section>

      {/* ── Gateway CTA Banner ────────────────────────────────── */}
      <section id="gateway-cta">
        <div className="relative overflow-hidden rounded-2xl border border-surface-700/40 bg-surface-800/30">
          <div className="relative flex flex-col items-center justify-center px-8 py-14 text-center">
            <span className="mb-2 text-3xl">🎮</span>
            <h3 className="font-display text-2xl font-bold text-text-primary">
              Never Played a Game Before?
            </h3>
            <p className="mt-3 max-w-md text-sm text-text-secondary">
              Our Gateway is designed just for you. Curated starter packs, jargon-free guides, and cozy recommendations.
            </p>
            <a
              href="/gateway"
              id="gateway-banner-cta"
              className="mt-6 rounded-xl bg-accent-cyan px-6 py-3 text-sm font-semibold text-surface-950 transition-all hover:bg-accent-cyan/85 active:scale-95"
            >
              Enter the Gateway
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
