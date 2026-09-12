import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Calendar, Clock, Loader2, Gamepad2, Shield } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { getEsportsMatches } from '../utils/api'

export default function Esports() {
 const [matches, setMatches] = useState([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 async function fetchData() {
 const data = await getEsportsMatches()
 setMatches(data)
 setLoading(false)
 }
 fetchData()
 }, [])

 const formatMatchTime = (dateString) => {
 const date = new Date(dateString)
 const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
 return date.toLocaleString(undefined, options)
 }

 return (
 <PageTransition>
 <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
 <header className="mb-10 text-center sm:text-left">
 <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-500">
 <Trophy className="h-4 w-4" />
 Competitive Arena
 </div>
 <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
 Pro <span className="text-signal-blue">Esports</span> Matches
 </h1>
 <p className="mt-4 max-w-2xl text-lg text-text-secondary sm:text-left">
 Track upcoming professional matches across major esports titles. Don't miss a moment of the action.
 </p>
 </header>

 {loading ? (
 <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
 <Loader2 className="h-10 w-10 animate-spin text-amber-400" />
 <p className="text-text-secondary">Loading match schedule...</p>
 </div>
 ) : matches.length === 0 ? (
 <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-surface-600 bg-surface-800 p-8 text-center">
 <Shield className="mb-4 h-12 w-12 text-surface-600" />
 <h2 className="mb-2 text-xl font-bold text-text-primary">No Matches Found</h2>
 <p className="max-w-md text-sm text-text-secondary">
 We couldn't fetch the upcoming esports matches. Ensure your PandaScore API key is configured correctly in the environment variables.
 </p>
 </div>
 ) : (
 <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
 {matches.map((match, i) => (
 <motion.article
 key={match.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 className="group flex flex-col overflow-hidden rounded-xl border-2 border-surface-700 bg-surface-800 transition-all hover:border-amber-500/50 hover:bg-surface-800 hover:shadow-xl hover:shadow-amber-500/10"
 >
 {/* League Header */}
 <div className="flex items-center gap-3 border-b border-surface-700 bg-surface-900 px-5 py-3">
 {match.league.image_url ? (
 <img src={match.league.image_url} alt={match.league.name} className="h-8 w-8 object-contain" />
 ) : (
 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-700">
 <Gamepad2 className="h-4 w-4 text-text-muted" />
 </div>
 )}
 <div className="flex-1 min-w-0">
 <p className="truncate text-sm font-bold text-text-primary">{match.league.name}</p>
 <p className="truncate text-xs text-text-muted">{match.serie.full_name}</p>
 </div>
 {match.videogame && (
 <span className="rounded-full bg-amber-500/20 px-2 py-1 text-[10px] font-bold text-amber-500">
 {match.videogame.name}
 </span>
 )}
 </div>

 {/* Matchup */}
 <div className="flex flex-1 flex-col p-5">
 <div className="mb-6 flex flex-1 items-center justify-between gap-4">
 {/* Team 1 */}
 <div className="flex flex-1 flex-col items-center gap-2 text-center">
 <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-surface-950 p-2 shadow-inner">
 {match.opponents[0]?.opponent?.image_url ? (
 <img src={match.opponents[0].opponent.image_url} alt={match.opponents[0].opponent.name} className="h-full w-full object-contain" />
 ) : (
 <Shield className="h-8 w-8 text-surface-600" />
 )}
 </div>
 <span className="text-sm font-bold text-text-primary line-clamp-2">
 {match.opponents[0]?.opponent?.name || 'TBD'}
 </span>
 </div>
 
 {/* VS */}
 <div className="flex flex-col items-center justify-center">
 <span className="font-display text-2xl font-black italic text-surface-600 group-hover:text-amber-500/50 transition-colors">
 VS
 </span>
 </div>

 {/* Team 2 */}
 <div className="flex flex-1 flex-col items-center gap-2 text-center">
 <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-surface-950 p-2 shadow-inner">
 {match.opponents[1]?.opponent?.image_url ? (
 <img src={match.opponents[1].opponent.image_url} alt={match.opponents[1].opponent.name} className="h-full w-full object-contain" />
 ) : (
 <Shield className="h-8 w-8 text-surface-600" />
 )}
 </div>
 <span className="text-sm font-bold text-text-primary line-clamp-2">
 {match.opponents[1]?.opponent?.name || 'TBD'}
 </span>
 </div>
 </div>

 {/* Match Info */}
 <div className="mt-auto flex flex-col gap-2 rounded-lg bg-surface-950 p-3 text-sm">
 <div className="flex items-center gap-2 text-text-secondary">
 <Calendar className="h-4 w-4 text-amber-500" />
 <span className="font-medium">{formatMatchTime(match.begin_at)}</span>
 </div>
 <div className="flex items-center gap-2 text-text-secondary">
 <Clock className="h-4 w-4 text-amber-500" />
 <span className="font-medium">Best of {match.number_of_games}</span>
 </div>
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
