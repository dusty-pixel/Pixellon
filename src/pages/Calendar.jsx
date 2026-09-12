import { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { getUpcomingGames } from '../utils/api'

export default function Calendar() {
 const [upcomingReleases, setUpcomingReleases] = useState([])
 const [loading, setLoading] = useState(true)
 const [activePlatform, setActivePlatform] = useState('All')

 useEffect(() => {
 async function loadData() {
 try {
 const data = await getUpcomingGames()
 setUpcomingReleases(data)
 } catch (err) {
 console.error('Failed to load upcoming games', err)
 } finally {
 setLoading(false)
 }
 }
 loadData()
 }, [])

 // Extract all unique platforms
 const allPlatforms = ['All', ...new Set(upcomingReleases.flatMap((game) => game.platform))]

 // Filter logic
 const filteredReleases = upcomingReleases.filter((game) => {
 if (activePlatform === 'All') return true
 return game.platform.includes(activePlatform)
 })

 // Group by month
 const groupedReleases = filteredReleases.reduce((acc, game) => {
 let monthYear;
 if (!game.date) {
 monthYear = 'TBA';
 } else if (game.date.includes('Q')) {
 monthYear = game.date;
 } else {
 const d = new Date(game.date)
 monthYear = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
 }
 
 if (!acc[monthYear]) acc[monthYear] = []
 acc[monthYear].push(game)
 return acc
 }, {})

 if (loading) {
 return (
 <PageTransition className="mx-auto max-w-7xl px-6 py-20 flex justify-center items-center min-h-[50vh]">
 <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-700 border-t-pixel-blue"></div>
 </PageTransition>
 )
 }

 return (
 <PageTransition className="mx-auto max-w-5xl px-6 py-10 space-y-12">
 <section id="calendar-header" className="animate-fade-up text-center">
 <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
 Release Calendar
 </h1>
 <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
 Keep track of every major drop. From massive blockbusters to indie darlings, here is what is coming down the pipeline.
 </p>
 </section>

 <section id="calendar-filters" className="animate-fade-up flex flex-wrap items-center justify-center gap-3">
 <div className="flex items-center gap-2 mr-2 text-text-muted">
 <Filter size={18} />
 <span className="text-sm font-semibold uppercase tracking-wider">Platform:</span>
 </div>
 {allPlatforms.map((platform) => (
 <button
 key={platform}
 onClick={() => setActivePlatform(platform)}
 className={`rounded-none border-2 border-deep-ink px-4 py-1.5 text-sm font-semibold transition-all ${
 activePlatform === platform
 ? 'bg-pixel-blue text-white shadow-[4px_4px_0_var(--color-deep-ink)]'
 : 'bg-surface-800 text-text-secondary hover:bg-surface-700 hover:text-text-primary'
 }`}
 >
 {platform}
 </button>
 ))}
 </section>

 <section id="calendar-list" className="animate-fade-up space-y-10">
 {Object.entries(groupedReleases).map(([month, releases]) => (
 <div key={month} className="relative pl-4 sm:pl-0">
 {/* Timeline Line (Desktop only) */}
 <div className="hidden sm:block absolute left-40 top-0 bottom-0 w-0.5 bg-surface-700/50"></div>
 
 <div className="sm:flex gap-8">
 {/* Month Header */}
 <div className="sm:w-32 shrink-0 pb-4 sm:pb-0 relative">
 {/* Timeline Dot */}
 <div className="hidden sm:block absolute -right-[19px] top-2 h-3 w-3 rounded-full border-2 border-surface-900 bg-pixel-blue shadow-[0_0_8px_var(--color-pixel-blue)]"></div>
 
 <h2 className="font-display text-xl font-bold text-signal-blue sticky top-24">
 {month}
 </h2>
 </div>
 
 {/* Games List */}
 <div className="flex-1 space-y-4">
 {releases.map((game) => (
 <div
 key={game.id}
 className="group relative overflow-hidden rounded-2xl border border-surface-700 shadow-lg bg-surface-800 p-5 transition-all hover:border-pixel-blue hover:bg-surface-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
 >
 <div>
 <h3 className="font-display text-lg font-bold text-text-primary group-hover:text-pixel-blue transition-colors">
 {game.title}
 </h3>
 <div className="mt-1 flex flex-wrap items-center gap-2">
 <span className="rounded bg-surface-700/50 px-2 py-0.5 text-xs text-text-secondary">
 {game.genre}
 </span>
 <span className="text-text-muted text-xs">•</span>
 <span className="text-xs text-text-secondary font-medium">
 {game.platform?.join(', ')}
 </span>
 </div>
 </div>
 
 <div className="shrink-0 sm:text-right">
 <div className="text-sm font-bold text-text-primary">
 {game.date ? new Date(game.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 ))}

 {filteredReleases.length === 0 && (
 <div className="text-center py-20 text-text-muted">
 <p>No upcoming releases found for the selected platform.</p>
 </div>
 )}
 </section>
 </PageTransition>
 )
}
