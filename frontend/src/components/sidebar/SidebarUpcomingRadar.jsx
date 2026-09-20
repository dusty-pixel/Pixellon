import { Link } from 'react-router-dom'
import { Calendar, ChevronRight } from 'lucide-react'

const UPCOMING_RADAR = [
  {
    id: 'gta-6',
    title: 'Grand Theft Auto VI',
    date: 'Fall 2026',
    genre: 'Open World',
    badge: 'Hyped',
    badgeColor: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
  },
  {
    id: 'mh-wilds',
    title: 'Monster Hunter Wilds',
    date: '2026',
    genre: 'Action RPG',
    badge: 'Ready',
    badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  },
  {
    id: 'doom-dark',
    title: 'DOOM: The Dark Ages',
    date: '2026',
    genre: 'FPS / Metal',
    badge: 'Confirmed',
    badgeColor: 'border-red-500/30 bg-red-500/10 text-red-400',
  },
  {
    id: 'witcher-4',
    title: 'The Witcher: Polaris',
    date: 'TBA 2026',
    genre: 'RPG',
    badge: 'In Dev',
    badgeColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  },
]

export default function SidebarUpcomingRadar() {
  return (
    <div className="rounded-2xl border border-surface-700 bg-brand-surface p-5 shadow-xl transition-all hover:border-brand-primary/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand-accent" />
          <h3 className="font-display text-sm font-bold text-brand-text">
            Upcoming Releases
          </h3>
        </div>
        <span className="text-[10px] font-mono text-brand-muted">2026 RADAR</span>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {UPCOMING_RADAR.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-surface-700 bg-surface-900 p-3 transition-all hover:border-brand-accent/40"
          >
            <div className="min-w-0 pr-2">
              <h4 className="font-display text-xs font-bold text-brand-text truncate">
                {item.title}
              </h4>
              <p className="text-[10px] font-mono text-brand-muted">
                {item.genre}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold border ${item.badgeColor}`}>
                {item.badge}
              </span>
              <span className="block mt-0.5 text-[10px] font-mono text-brand-muted">
                {item.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Link
        to="/calendar"
        className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-surface-700 bg-surface-900 py-2 text-xs font-semibold text-brand-accent transition-all hover:bg-brand-primary/10 hover:border-brand-primary/40"
      >
        <span>View Release Calendar</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
