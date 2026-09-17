import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Search, Loader2, Gamepad2, Clock, AlertCircle } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { getSteamProfile, getSteamOwnedGames } from './api'

export default function Profile() {
 const [steamId, setSteamId] = useState('')
 const [profile, setProfile] = useState(null)
 const [games, setGames] = useState([])
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState('')
 const [searched, setSearched] = useState(false)

 const handleSearch = async (e) => {
 e.preventDefault()
 if (!steamId.trim()) return

 setLoading(true)
 setError('')
 setProfile(null)
 setGames([])
 setSearched(true)

 try {
 const p = await getSteamProfile(steamId)
 if (!p) {
 setError('Profile not found. Ensure the Steam ID is correct and the profile is public.')
 setLoading(false)
 return
 }
 setProfile(p)

 const g = await getSteamOwnedGames(steamId)
 // Sort by playtime (highest first)
 const sortedGames = g.sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 12)
 setGames(sortedGames)
 } catch (err) {
 setError('An error occurred while fetching profile data.')
 } finally {
 setLoading(false)
 }
 }

 return (
 <PageTransition>
 <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
 <header className="mb-10 text-center">
 <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-signal-blue/30 bg-signal-blue/10 px-4 py-1.5 text-sm font-medium text-signal-blue">
 <User className="h-4 w-4" />
 Player Profile
 </div>
 <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
 Steam <span className="text-signal-blue">Card</span>
 </h1>
 <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
 Enter a public Steam ID (64-bit) to view player stats and most played games.
 </p>
 </header>

 {/* Search Bar */}
 <form onSubmit={handleSearch} className="mx-auto mb-12 flex max-w-lg items-center gap-2">
 <div className="relative flex-1">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
 <input
 type="text"
 placeholder="e.g. 76561197960434622"
 value={steamId}
 onChange={(e) => setSteamId(e.target.value)}
 className="w-full rounded-xl border-2 border-surface-600 bg-surface-800 py-3 pl-10 pr-4 text-text-primary placeholder:text-text-muted focus:border-signal-blue focus:outline-none focus:ring-1 focus:ring-signal-blue transition-all"
 />
 </div>
 <button
 type="submit"
 disabled={loading}
 className="rounded-xl bg-signal-blue px-6 py-3.5 font-bold text-surface-950 transition-all hover:bg-cyan-400 disabled:opacity-50"
 >
 {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
 </button>
 </form>

 {error && (
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 className="mx-auto mb-8 max-w-lg rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm font-medium text-red-400 flex items-center justify-center gap-2"
 >
 <AlertCircle className="h-5 w-5" />
 {error}
 </motion.div>
 )}

 {profile && (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="rounded-2xl border border-surface-700 bg-surface-800 p-6 shadow-2xl sm:p-8"
 >
 <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
 <img
 src={profile.avatarfull}
 alt={profile.personaname}
 className="h-32 w-32 rounded-2xl border-4 border-surface-600 shadow-xl"
 />
 <div className="flex-1 text-center sm:text-left">
 <h2 className="mb-2 font-display text-3xl font-bold text-text-primary">
 {profile.personaname}
 </h2>
 <div className="mb-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
 <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${profile.personastate === 1 ? 'bg-signal-green/20 text-signal-green' : 'bg-surface-600 text-text-secondary'}`}>
 <span className={`h-2 w-2 rounded-full ${profile.personastate === 1 ? 'bg-signal-green' : 'bg-text-secondary'}`} />
 {profile.personastate === 1 ? 'Online' : 'Offline'}
 </span>
 <a
 href={profile.profileurl}
 target="_blank"
 rel="noopener noreferrer"
 className="text-sm font-medium text-signal-blue hover:underline"
 >
 View on Steam
 </a>
 </div>
 </div>
 </div>

 {/* Top Games */}
 <div className="mt-10">
 <h3 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-text-primary">
 <Gamepad2 className="h-5 w-5 text-signal-blue" />
 Most Played Games
 </h3>
 
 {games.length > 0 ? (
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {games.map((game) => (
 <div key={game.appid} className="flex items-center gap-4 rounded-xl bg-surface-900 p-3">
 <img
 src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
 alt={game.name}
 className="h-12 w-12 rounded shadow"
 onError={(e) => { e.target.style.display = 'none' }}
 />
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-bold text-text-primary" title={game.name}>
 {game.name}
 </p>
 <p className="flex items-center gap-1 text-xs text-text-secondary">
 <Clock className="h-3 w-3" />
 {Math.round(game.playtime_forever / 60)} hours
 </p>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-sm text-text-secondary">No public gameplay data available.</p>
 )}
 </div>
 </motion.div>
 )}
 </div>
 </PageTransition>
 )
}
