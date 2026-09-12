import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import GameCard from '../components/GameCard'
import SectionHeader from '../components/SectionHeader'
import PageTransition from '../components/PageTransition'
import { gatewayCollections, beginnerGuides } from '../data/mockData'
import { getTrendingGames, getHighlyRatedGames } from '../utils/api'

const COLLECTION_COLORS = {
 emerald: { border: 'border-signal-blue/20', bg: 'bg-signal-blue/5', text: 'text-signal-blue' },
 violet: { border: 'border-pixel-blue/20', bg: 'bg-pixel-blue/5', text: 'text-pixel-blue' },
 cyan: { border: 'border-signal-blue/20', bg: 'bg-signal-blue/5', text: 'text-signal-blue' },
 amber: { border: 'border-pixel-blue/20', bg: 'bg-pixel-blue/5', text: 'text-pixel-blue' },
}

export default function Gateway() {
 const [apiGames, setApiGames] = useState([])
 const [loading, setLoading] = useState(true)
 const navigate = useNavigate()

 useEffect(() => {
 async function fetchApiData() {
 setLoading(true)
 try {
 // Fetch a mix of trending and highly rated games to give good suggestions
 const [trending, highlyRated] = await Promise.all([
 getTrendingGames(),
 getHighlyRatedGames()
 ])
 
 // Combine and deduplicate
 const combined = [...trending, ...highlyRated]
 const unique = Array.from(new Map(combined.map(item => [item.id, item])).values())
 
 // Take a random selection of 3 games
 const shuffled = unique.sort(() => 0.5 - Math.random())
 setApiGames(shuffled.slice(0, 3))
 } catch (err) {
 console.error("Failed to load gateway API games", err)
 } finally {
 setLoading(false)
 }
 }
 fetchApiData()
 }, [])

 return (
 <PageTransition className="mx-auto max-w-7xl px-6 py-10 space-y-16">
 {/* ── Hero ──────────────────────────────────────────────── */}
 <section id="gateway-hero" className="animate-fade-up">
 <div className="relative overflow-hidden rounded-2xl border border-surface-700 bg-surface-800">
 <div className="relative px-8 py-16 sm:px-12 sm:py-20 text-center">
 <span className="mb-3 inline-flex items-center rounded-full bg-signal-blue/10 px-4 py-1.5 text-xs font-semibold text-signal-blue">
 🌟 No experience needed
 </span>
 <h1 className="mx-auto font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl max-w-3xl">
 Welcome to the
 <span className="text-signal-blue"> Starter Zone</span>
 </h1>
 <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
 Gaming can be intimidating, we get it. We've put together a few hand-picked lists of games that are actually easy to pick up, plus some guides to explain all the weird jargon.
 </p>
 </div>
 </div>
 </section>

 {/* ── Quick Stats ───────────────────────────────────────── */}
 <section id="gateway-stats">
 <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
 {[
 { label: 'Starter Lists', value: '4', icon: '📚' },
 { label: 'Games We Love', value: '12+', icon: '🎮' },
 { label: 'Quick Guides', value: '4', icon: '📖' },
 { label: 'Time to Read', value: '5 min', icon: '⏱️' },
 ].map((stat) => (
 <div
 key={stat.label}
 className="rounded-2xl border border-surface-700 bg-surface-800 px-5 py-6 text-center transition-all hover:border-surface-600"
 >
 <span className="text-2xl">{stat.icon}</span>
 <p className="mt-2 font-display text-2xl font-bold text-text-primary">{stat.value}</p>
 <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
 </div>
 ))}
 </div>
 </section>

 {/* ── Dynamic API Suggestions ───────────────────────────── */}
 <section id="api-suggestions">
 <SectionHeader
 title="Trending Right Now"
 subtitle="What everyone else is currently playing."
 accent="amber"
 />
 
 {loading ? (
 <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border border-surface-700 bg-surface-800">
 <Loader2 className="h-8 w-8 animate-spin text-pixel-blue" />
 <p className="text-sm text-text-muted font-medium">Fetching top picks...</p>
 </div>
 ) : apiGames.length > 0 ? (
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
 {apiGames.map((game) => (
 <GameCard
 key={game.id}
 {...game}
 tag="TRENDING"
 tagColor="amber"
 onClick={() => navigate(`/codex/${game.id}`)}
 />
 ))}
 </div>
 ) : (
 <div className="rounded-2xl border border-surface-700 bg-surface-800 p-8 text-center text-text-muted">
 Could not fetch live suggestions at this time.
 </div>
 )}
 </section>

 {/* ── Curated Collections ───────────────────────────────── */}
 {gatewayCollections.map((collection) => {
 const colors = COLLECTION_COLORS[collection.color] || COLLECTION_COLORS.violet
 return (
 <section key={collection.id} id={`collection-${collection.id}`}>
 <div className={`rounded-2xl border border-surface-700 bg-surface-800 p-6 sm:p-8`}>
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
 title="The Basics"
 subtitle="No jargon, just straight answers."
 accent="cyan"
 />
 <div className="grid gap-4 sm:grid-cols-2">
 {beginnerGuides.map((guide) => (
 <article
 key={guide.id}
 id={`guide-${guide.id}`}
 className="group flex gap-4 rounded-2xl border border-surface-700 bg-surface-800 p-5 transition-all duration-200 hover:border-signal-blue hover:bg-surface-700 cursor-pointer"
 >
 <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-surface-600 bg-surface-900 text-xl transition-transform group-hover:scale-110">
 {guide.icon}
 </div>
 <div className="min-w-0">
 <div className="flex items-center gap-2">
 <h4 className="text-sm font-semibold text-text-primary group-hover:text-signal-blue transition-colors">
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
 <div className="rounded-2xl border border-surface-700 bg-surface-800 px-8 py-14 text-center">
 <h3 className="font-display text-2xl font-bold text-text-primary">
 Where to Next?
 </h3>
 <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
 Honestly, just grab whatever looks cool and start playing. There's no wrong way to do this.
 </p>
 <div className="mt-6 flex flex-wrap justify-center gap-3">
 <Link
 to="/reviews"
 id="gateway-to-reviews"
 className="rounded-2xl border border-surface-700 bg-pixel-blue px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-pixel-blue/85 active:scale-95"
 >
 Browse All Reviews
 </Link>
 <Link
 to="/indie"
 id="gateway-to-indie"
 className="rounded-2xl border border-surface-700 bg-surface-800 px-6 py-3 text-sm font-semibold text-text-primary transition-all hover:border-surface-600"
 >
 Discover Indie Gems
 </Link>
 </div>
 </div>
 </section>
 </PageTransition>
 )
}
