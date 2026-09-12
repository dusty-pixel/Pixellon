import { useState, useEffect } from 'react'
import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import PageTransition from '../components/PageTransition'
import { getIndieGames } from '../utils/api'

export default function Indie() {
 const [indies, setIndies] = useState([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 async function loadData() {
 try {
 const data = await getIndieGames()
 setIndies(data)
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
 <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-700 border-t-pixel-blue"></div>
 </PageTransition>
 )
 }

 // Use the highest rated indie as the featured game
 const featuredIndie = indies[0]
 const otherIndies = indies.slice(1)

 return (
 <PageTransition className="mx-auto max-w-7xl px-6 py-10 space-y-16">
 <section id="indie-header" className="animate-fade-up text-center max-w-3xl mx-auto mb-16">
 <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
 Indie Showcase
 </h1>
 <p className="mt-4 text-lg text-text-secondary">
 Discover the most creative, innovative, and highly-rated independent games from smaller studios pushing boundaries.
 </p>
 </section>

 {featuredIndie && (
 <section id="indie-featured" className="animate-fade-up">
 <SectionHeader
 title="Editor's Pick"
 subtitle="The standout indie experience you cannot miss."
 accent="emerald"
 />
 <div className="mt-6">
 <GameCard {...featuredIndie} variant="featured" tag="Editor's Pick" tagColor="emerald" />
 </div>
 </section>
 )}

 <section id="indie-grid">
 <SectionHeader
 title="More Indie Gems"
 subtitle="Highly-rated indie titles to explore."
 accent="cyan"
 />
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 {otherIndies.map((game) => (
 <GameCard key={game.id} {...game} />
 ))}
 </div>
 </section>
 </PageTransition>
 )
}
