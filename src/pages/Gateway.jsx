import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import { gatewayCollections, beginnerGuides } from '../data/mockData'

const COLLECTION_COLORS = {
  emerald: { border: 'border-accent-emerald/20', bg: 'bg-accent-emerald/5', text: 'text-accent-emerald' },
  violet: { border: 'border-accent-violet/20', bg: 'bg-accent-violet/5', text: 'text-accent-violet' },
  cyan: { border: 'border-accent-cyan/20', bg: 'bg-accent-cyan/5', text: 'text-accent-cyan' },
  amber: { border: 'border-accent-amber/20', bg: 'bg-accent-amber/5', text: 'text-accent-amber' },
}

export default function Gateway() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-16">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section id="gateway-hero" className="animate-fade-up">
        <div className="relative overflow-hidden rounded-2xl border border-accent-cyan/20 bg-surface-800/30">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/5 via-transparent to-accent-violet/5" />
          <div className="relative px-8 py-16 sm:px-12 sm:py-20 text-center">
            <span className="mb-3 inline-flex items-center rounded-full bg-accent-cyan/10 px-4 py-1.5 text-xs font-semibold text-accent-cyan">
              🌟 Designed for Newcomers
            </span>
            <h1 className="mx-auto font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl max-w-3xl">
              Welcome to the
              <span className="gradient-text-cyan"> Gateway</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
              Never played a game? Not sure where to start? We've curated the perfect collections and guides to ease you into the world of gaming — no experience required.
            </p>
          </div>
        </div>
      </section>

      {/* ── Quick Stats ───────────────────────────────────────── */}
      <section id="gateway-stats">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Curated Collections', value: '4', icon: '📚' },
            { label: 'Recommended Games', value: '12+', icon: '🎮' },
            { label: 'Beginner Guides', value: '4', icon: '📖' },
            { label: 'Avg. Read Time', value: '5 min', icon: '⏱️' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-surface-700/40 bg-surface-800/30 px-5 py-6 text-center transition-all hover:border-surface-600"
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="mt-2 font-display text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Curated Collections ───────────────────────────────── */}
      {gatewayCollections.map((collection) => {
        const colors = COLLECTION_COLORS[collection.color] || COLLECTION_COLORS.violet
        return (
          <section key={collection.id} id={`collection-${collection.id}`}>
            <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 sm:p-8`}>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{collection.emoji}</span>
                  <h2 className={`font-display text-2xl font-bold ${colors.text}`}>
                    {collection.title}
                  </h2>
                </div>
                <p className="ml-10 text-sm text-text-secondary">{collection.description}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {collection.games.map((game) => (
                  <GameCard
                    key={game.id}
                    {...game}
                    tagColor={collection.color}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* ── Beginner Guides ───────────────────────────────────── */}
      <section id="beginner-guides">
        <SectionHeader
          title="Beginner Guides"
          subtitle="Everything you need to know, explained simply."
          accent="cyan"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {beginnerGuides.map((guide) => (
            <article
              key={guide.id}
              id={`guide-${guide.id}`}
              className="group flex gap-4 rounded-xl border border-surface-700/40 bg-surface-800/30 p-5 transition-all duration-200 hover:border-accent-cyan/30 hover:bg-surface-800/50 cursor-pointer"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent-cyan/10 text-xl transition-transform group-hover:scale-110">
                {guide.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                    {guide.title}
                  </h4>
                  <span className="flex-shrink-0 rounded-full bg-surface-700/50 px-2 py-0.5 text-[10px] text-text-muted">
                    {guide.readTime}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{guide.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Getting Started CTA ───────────────────────────────── */}
      <section id="gateway-getting-started">
        <div className="rounded-2xl border border-surface-700/40 bg-surface-800/30 px-8 py-14 text-center">
          <h3 className="font-display text-2xl font-bold text-text-primary">
            Ready to Jump In?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
            Pick any game from our curated lists above and start playing. There's no wrong choice — every game here was hand-picked for newcomers.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="/reviews"
              id="gateway-to-reviews"
              className="rounded-xl bg-accent-violet px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-violet/85 active:scale-95"
            >
              Browse All Reviews
            </a>
            <a
              href="/indie"
              id="gateway-to-indie"
              className="rounded-xl border border-surface-600 bg-surface-800/50 px-6 py-3 text-sm font-semibold text-text-primary transition-all hover:border-accent-emerald/40 hover:text-accent-emerald"
            >
              Discover Indie Gems
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
