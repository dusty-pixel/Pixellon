import { useState, useEffect } from 'react'
import { Filter, Calendar as CalendarIcon } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { PixelPatternBg, PixelCross } from '../components/BrandDecorations'
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

  const allPlatforms = ['All', ...new Set(upcomingReleases.flatMap((game) => game.platform))]

  const filteredReleases = upcomingReleases.filter((game) => {
    if (activePlatform === 'All') return true
    return game.platform.includes(activePlatform)
  })

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
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#1E2638] border-t-brand-primary"></div>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header */}
      <section id="calendar-header" className="relative overflow-hidden rounded-2xl border border-[#1E2638] bg-[#151A24] p-8 sm:p-10">
        <PixelPatternBg />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-brand-accent">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest">
                Release Timeline • Global Drops
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-text">
              Release Calendar
            </h1>
            <p className="mt-1 text-sm text-brand-muted">
              Never miss a launch. Track major blockbusters and indie debuts down the pipeline.
            </p>
          </div>
          <div className="hidden sm:block">
            <PixelCross size={24} />
          </div>
        </div>
      </section>

      {/* Platform Filter */}
      <section id="calendar-filters" className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center gap-2 mr-2 text-xs font-mono text-brand-muted">
          <Filter size={16} className="text-brand-accent" />
          <span>PLATFORM:</span>
        </div>
        {allPlatforms.map((platform) => (
          <button
            key={platform}
            onClick={() => setActivePlatform(platform)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-medium transition-all cursor-pointer ${
              activePlatform === platform
                ? 'bg-brand-primary text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                : 'bg-[#151A24] text-brand-muted hover:bg-[#1E2638] hover:text-brand-text border border-[#1E2638]'
            }`}
          >
            {platform}
          </button>
        ))}
      </section>

      {/* Releases Timeline */}
      <section id="calendar-list" className="space-y-10">
        {Object.entries(groupedReleases).map(([month, releases]) => (
          <div key={month} className="relative pl-4 sm:pl-0">
            <div className="hidden sm:block absolute left-36 top-0 bottom-0 w-px bg-[#1E2638]"></div>
            
            <div className="sm:flex gap-8">
              {/* Month Header */}
              <div className="sm:w-32 shrink-0 pb-4 sm:pb-0 relative">
                <div className="hidden sm:block absolute -right-[17px] top-2 h-2.5 w-2.5 rounded-none bg-brand-primary shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
                
                <h2 className="font-display text-lg font-bold text-brand-accent sticky top-24 font-mono">
                  {month}
                </h2>
              </div>
              
              {/* Games List */}
              <div className="flex-1 space-y-3.5">
                {releases.map((game) => (
                  <div
                    key={game.id}
                    className="group relative overflow-hidden rounded-xl border border-[#1E2638] bg-[#151A24] p-4 sm:p-5 transition-all hover:border-brand-primary hover:shadow-[0_0_16px_rgba(37,99,235,0.2)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-display text-base sm:text-lg font-bold text-brand-text group-hover:text-brand-accent transition-colors">
                        {game.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="rounded bg-[#0B0F17] px-2 py-0.5 text-brand-muted border border-[#1E2638]">
                          {game.genre}
                        </span>
                        <span className="text-brand-muted">•</span>
                        <span className="text-brand-accent2">
                          {game.platform?.join(', ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 sm:text-right font-mono text-xs text-brand-accent font-semibold">
                      {game.date ? new Date(game.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredReleases.length === 0 && (
          <div className="text-center py-20 text-brand-muted text-sm font-mono">
            No upcoming releases found for the selected platform.
          </div>
        )}
      </section>
    </PageTransition>
  )
}
