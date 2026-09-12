import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, Filter, Loader2, Monitor, LayoutGrid } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { getFreeGames } from '../utils/api'

export default function FreeGames() {
 const [games, setGames] = useState([])
 const [loading, setLoading] = useState(true)
 const [platform, setPlatform] = useState('all') // 'all', 'pc', 'browser'

 useEffect(() => {
 async function fetchData() {
 setLoading(true)
 const data = await getFreeGames(platform)
 setGames(data)
 setLoading(false)
 }
 fetchData()
 }, [platform])

 return (
 <PageTransition>
 <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
 <header className="mb-10 text-center">
 <motion.div
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-4 inline-flex items-center gap-2 rounded-full border border-signal-green/30 bg-signal-green/10 px-4 py-1.5 text-sm font-medium text-signal-green"
 >
 <Gift className="h-4 w-4" />
 100% Free to Play
 </motion.div>
 <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
 Free <span className="text-signal-blue">Games</span> Vault
 </h1>
 <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
 Discover the best free-to-play games available right now. Keep your wallet closed and your library full.
 </p>
 </header>

 {/* Filters */}
 <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row rounded-xl border border-surface-700 bg-surface-800 p-4 ">
 <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
 <Filter className="h-4 w-4" />
 Platform Filter
 </div>
 <div className="flex flex-wrap gap-2">
 {[
 { id: 'all', label: 'All Platforms', icon: LayoutGrid },
 { id: 'pc', label: 'PC (Windows)', icon: Monitor },
 { id: 'browser', label: 'Web Browser', icon: LayoutGrid },
 ].map((p) => {
 const Icon = p.icon
 const isActive = platform === p.id
 return (
 <button
 key={p.id}
 onClick={() => setPlatform(p.id)}
 className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
 isActive
 ? 'bg-signal-green text-surface-950 shadow-lg shadow-signal-green/20'
 : 'bg-surface-800 text-text-secondary hover:bg-surface-700 hover:text-text-primary'
 }`}
 >
 <Icon className="h-4 w-4" />
 {p.label}
 </button>
 )
 })}
 </div>
 </div>

 {/* Game Grid */}
 {loading ? (
 <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
 <Loader2 className="h-10 w-10 animate-spin text-signal-green" />
 <p className="text-text-secondary">Hunting for free games...</p>
 </div>
 ) : (
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
 {games.map((game, i) => (
 <motion.article
 key={game.id}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.05 }}
 className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-700 bg-surface-800 transition-all duration-300 hover:-translate-y-1 hover:border-signal-green/50 hover:shadow-2xl "
 >
 <div className="relative aspect-[16/9] overflow-hidden">
 <img
 src={game.thumbnail}
 alt={game.title}
 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent" />
 <div className="absolute right-3 top-3 rounded-full bg-signal-green/90 px-3 py-1 text-[10px] font-bold tracking-wider text-surface-950 shadow-sm ">
 FREE
 </div>
 </div>
 <div className="flex flex-1 flex-col p-6">
 <div className="mb-3 flex items-center justify-between">
 <span className="text-[11px] font-bold uppercase tracking-wider text-signal-green">
 {game.genre}
 </span>
 <span className="rounded-md border border-surface-600 bg-surface-700/30 px-2 py-1 text-[10px] font-semibold text-text-muted">
 {game.platform === 'PC (Windows)' ? 'PC' : 'Web'}
 </span>
 </div>
 <h3 className="mb-2 font-display text-xl font-bold text-text-primary transition-colors group-hover:text-signal-green">
 {game.title}
 </h3>
 <p className="mb-6 text-sm leading-relaxed text-text-secondary line-clamp-2">
 {game.short_description}
 </p>
 <div className="mt-auto">
 <a
 href={game.game_url}
 target="_blank"
 rel="noopener noreferrer"
 className="block w-full rounded-xl bg-surface-700/50 border border-white/5 px-4 py-3 text-center text-sm font-semibold text-text-primary transition-all duration-300 hover:bg-signal-green hover:text-surface-950 hover:shadow-lg "
 >
 Get Game
 </a>
 </div>
 </div>
 </motion.article>
 ))}
 </div>
 )}
 </div>
 </PageTransition>
 )
}
