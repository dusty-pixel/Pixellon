import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import { indieGames } from '../data/mockData'

export default function Indie() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-12">
      {/* ── Header ────────────────────────────────────────────── */}
      <section id="indie-header" className="animate-fade-up">
        <div className="relative overflow-hidden rounded-2xl border border-accent-emerald/20 bg-surface-800/30">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-emerald/5 via-transparent to-accent-violet/5" />
          <div className="relative px-8 py-14 sm:px-12">
            <span className="mb-4 inline-flex items-center rounded-full bg-accent-emerald/10 px-3 py-1 text-xs font-semibold text-accent-emerald">
              ◆ Independent Studios
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
              Indie Spotlights
            </h1>
            <p className="mt-4 max-w-xl text-base text-text-secondary leading-relaxed">
              The boldest ideas in gaming come from indie studios. These are the hidden gems, innovative mechanics, and artistic visions that push the medium forward.
            </p>
          </div>
        </div>
      </section>

      {/* ── Featured Indie ────────────────────────────────────── */}
      <section id="featured-indie">
        <SectionHeader
          title="Featured This Month"
          subtitle="Hand-picked by the Nexus editors."
          accent="emerald"
        />
        {indieGames.length > 0 && (
          <GameCard {...indieGames[0]} variant="featured" />
        )}
      </section>

      {/* ── All Indies ────────────────────────────────────────── */}
      <section id="all-indies">
        <SectionHeader
          title="All Indie Spotlights"
          subtitle="Browse the full collection of indie games we love."
          accent="violet"
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {indieGames.slice(1).map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      </section>
    </div>
  )
}
