import SectionHeader from '../SectionHeader'
import { SectionReveal } from '../motion/Reveal'
import { useJsonLd } from '../../utils/seo'

const FAQS = [
  {
    q: 'What is Pixellon?',
    a: 'Pixellon is a free gaming discovery hub. It tracks 100% free PC game giveaways, spotlights indie games, compares game deals, publishes honest reviews, lists release dates, covers live esports and hosts a community game wiki — all in one place.',
  },
  {
    q: 'Where can I find free PC games?',
    a: 'Open the Free Games Vault on Pixellon. It tracks limited-time 100%-off drops across Steam, the Epic Games Store and GOG, updated daily. Connect a Discord webhook to get an alert the moment a new free game appears.',
  },
  {
    q: 'How do I find beginner friendly games?',
    a: 'Visit the Pixellon Gateway. It curates cozy, easy-to-learn games and jargon-free starter guides for new players — no experience needed.',
  },
  {
    q: 'Where can I see live esports scores?',
    a: 'The Pixellon Esports match center shows live scores, schedules and results across CS2, VALORANT, League of Legends, Dota 2, Apex Legends and Rocket League.',
  },
  {
    q: 'Does Pixellon track game deals and prices?',
    a: 'Yes. The Deals Vault compares PC game prices across stores, shows historical cheapest prices and converts to INR, so you always know whether a sale is actually a good deal.',
  },
]

/**
 * Visible Q&A block (AEO) + FAQPage schema (GEO): direct, quotable
 * answers that search and answer engines can cite.
 */
export default function HomeFaq() {
  useJsonLd('pixellon-faq', {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  })

  return (
    <section id="quick-answers">
      <SectionHeader
        index="08"
        title="Quick answers"
        subtitle="Straight answers to common gaming questions — no clickbait."
        accent="cyan"
      />
      <SectionReveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {FAQS.map((f) => (
            <div
              key={f.q}
              className="rounded-xl border border-surface-700 bg-brand-surface p-5"
            >
              <h3 className="font-display text-sm font-bold text-brand-text">{f.q}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">{f.a}</p>
            </div>
          ))}
        </div>
      </SectionReveal>
    </section>
  )
}
