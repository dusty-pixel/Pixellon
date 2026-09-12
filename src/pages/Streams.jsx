import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tv, Users, Loader2, Play } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { getTopStreams } from '../utils/api'

export default function Streams() {
 const [streams, setStreams] = useState([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 async function fetchData() {
 const data = await getTopStreams()
 setStreams(data)
 setLoading(false)
 }
 fetchData()
 }, [])

 // Twitch thumbnail URLs look like: "https://static-cdn.jtvnw.net/previews-ttv/live_user_name-{width}x{height}.jpg"
 const getThumbnail = (url, width = 640, height = 360) => {
 return url.replace('{width}', width).replace('{height}', height)
 }

 return (
 <PageTransition>
 <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
 <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
 <div>
 <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-400">
 <Tv className="h-4 w-4" />
 Live Now
 </div>
 <h1 className="font-display text-4xl font-extrabold text-text-primary sm:text-5xl">
 Top <span className="text-purple-400">Streams</span>
 </h1>
 </div>
 <p className="max-w-xs text-sm text-text-secondary sm:text-right">
 Discover the most popular gaming broadcasts happening right now on Twitch.
 </p>
 </header>

 {loading ? (
 <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
 <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
 <p className="text-text-secondary">Tuning in...</p>
 </div>
 ) : streams.length === 0 ? (
 <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-surface-600 bg-surface-800 p-8 text-center">
 <Tv className="mb-4 h-12 w-12 text-surface-600" />
 <h2 className="mb-2 text-xl font-bold text-text-primary">No Streams Found</h2>
 <p className="max-w-md text-sm text-text-secondary">
 It looks like we couldn't fetch live streams right now. Ensure your Twitch API keys are configured in the environment variables.
 </p>
 </div>
 ) : (
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
 {streams.map((stream, i) => (
 <motion.article
 key={stream.id}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.05 }}
 className="group relative flex flex-col overflow-hidden rounded-xl bg-surface-800 transition-all hover:bg-surface-800 hover:shadow-xl hover:shadow-purple-500/10"
 >
 <div className="relative aspect-video overflow-hidden">
 <img
 src={getThumbnail(stream.thumbnail_url)}
 alt={stream.title}
 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
 
 <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
 <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
 LIVE
 </div>
 
 <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded bg-surface-950 px-2 py-0.5 text-xs font-semibold text-white ">
 <Users className="h-3.5 w-3.5" />
 {new Intl.NumberFormat('en-US').format(stream.viewer_count)}
 </div>
 
 {/* Overlay Play Icon */}
 <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
 <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/90 text-white shadow-lg transition-transform group-hover:scale-110">
 <Play className="h-5 w-5 ml-1" />
 </div>
 </div>
 </div>
 
 <div className="flex flex-1 flex-col p-4">
 <div className="mb-2 flex items-center justify-between gap-2">
 <span className="truncate text-sm font-bold text-purple-400">
 {stream.user_name}
 </span>
 <span className="truncate rounded-full bg-surface-700/50 px-2 py-0.5 text-[10px] font-medium text-text-muted">
 {stream.game_name}
 </span>
 </div>
 <h3 className="line-clamp-2 text-sm font-medium text-text-primary group-hover:text-purple-300" title={stream.title}>
 <a href={`https://twitch.tv/${stream.user_login}`} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
 {stream.title}
 </a>
 </h3>
 </div>
 </motion.article>
 ))}
 </div>
 )}
 </div>
 </PageTransition>
 )
}
