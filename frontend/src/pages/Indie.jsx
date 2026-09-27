import { useState, useEffect } from 'react'
import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import PageTransition from '../components/PageTransition'
import { PixelPatternBg, PixelCross } from '../components/BrandDecorations'
import { getIndieGames } from '../utils/api'
import { indieGames as mockIndie } from '../data/mockData'
import { Stagger, StaggerItem } from '../components/motion/Reveal'

export default function Indie() {
  const [indies, setIndies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getIndieGames()
        setIndies(data.length ? data : mockIndie)
      } catch (err) {
        console.error('Failed to load indie games', err)
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

  const featuredIndie = indies[0]
  const otherIndies = indies.slice(1)

  return (
    <PageTransition className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Header */}
      <section id="indie-header" className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface p-8 sm:p-12 text-center">
        <PixelPatternBg />
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-lg border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-xs font-mono font-semibold text-brand-accent tracking-wide">
            <span>INDEPENDENT STUDIOS RADAR</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-text">
            Indie Game Showcase
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-brand-muted leading-relaxed">
            Discover standout releases, innovative mechanics, and community favorites crafted by independent development studios worldwide.
          </p>
        </div>
      </section>

      {featuredIndie && (
        <section id="indie-featured" className="animate-fade-up">
          <SectionHeader
            title="Editor's Pick"
            subtitle="The standout independent experience you cannot miss."
            accent="blue"
          />
          <div className="mt-6">
            <GameCard {...featuredIndie} variant="featured" tag="EDITOR'S CHOICE" tagColor="blue" />
          </div>
        </section>
      )}

      <section id="indie-grid">
        <SectionHeader
          title="More Indie Gems"
          subtitle="Top recommended indie titles to add to your collection."
          accent="accent"
        />
        {otherIndies.length ? (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
            {otherIndies.map((game) => (
              <StaggerItem key={game.id} className="h-full">
                <GameCard {...game} tagColor="accent" />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-surface-700 bg-brand-surface p-12 text-center">
            <p className="font-display text-lg font-bold text-brand-text">No indie titles right now</p>
            <p className="mt-1 text-sm text-brand-muted">Check back soon — the radar never sleeps.</p>
          </div>
        )}
      </section>
    </PageTransition>
  )
}
