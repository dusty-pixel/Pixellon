import { useState } from 'react'
import SectionHeader from '../components/SectionHeader'
import { upcomingReleases } from '../data/mockData'

const STATUS_STYLES = {
  confirmed: 'bg-accent-emerald/12 text-accent-emerald',
  rumored: 'bg-accent-amber/12 text-accent-amber',
}

const PLATFORM_TAGS = ['All', 'PS5', 'Xbox', 'PC', 'Switch 2']

export default function Calendar() {
  const [platformFilter, setPlatformFilter] = useState('All')

  const filtered = platformFilter === 'All'
    ? upcomingReleases
    : upcomingReleases.filter((r) => r.platform.some((p) => p.toLowerCase().includes(platformFilter.toLowerCase())))

  // Group by month
  const grouped = filtered.reduce((acc, release) => {
    const dateStr = release.date
    let monthKey = 'TBA'
    if (dateStr.match(/^\d{4}-\d{2}/)) {
      const d = new Date(dateStr)
      monthKey = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } else if (dateStr.includes('Q')) {
      monthKey = dateStr
    }
    if (!acc[monthKey]) acc[monthKey] = []
    acc[monthKey].push(release)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
      {/* ── Header ────────────────────────────────────────────── */}
      <section id="calendar-header" className="animate-fade-up">
        <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary">
          Release Calendar
        </h1>
        <p className="mt-2 text-base text-text-secondary">
          Every confirmed and rumored release, organized by date.
        </p>
      </section>

      {/* ── Platform Filter ───────────────────────────────────── */}
      <section id="calendar-filters" className="flex flex-wrap gap-2">
        {PLATFORM_TAGS.map((p) => (
          <button
            key={p}
            id={`filter-${p.toLowerCase().replace(/\s/g, '-')}`}
            onClick={() => setPlatformFilter(p)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              platformFilter === p
                ? 'bg-accent-cyan/15 text-accent-cyan'
                : 'bg-surface-800/50 text-text-secondary hover:bg-surface-700/50 hover:text-text-primary'
            }`}
          >
            {p}
          </button>
        ))}
      </section>

      {/* ── Grouped Releases ──────────────────────────────────── */}
      <section id="calendar-grid" className="space-y-10">
        {Object.entries(grouped).map(([month, releases]) => (
          <div key={month}>
            <h3 className="mb-4 flex items-center gap-3">
              <div className="h-4 w-1 rounded-full bg-accent-cyan" />
              <span className="font-display text-lg font-semibold text-text-primary">{month}</span>
              <span className="rounded-full bg-surface-700/50 px-2 py-0.5 text-[10px] text-text-muted">
                {releases.length} title{releases.length > 1 ? 's' : ''}
              </span>
            </h3>

            {/* Table-style rows */}
            <div className="space-y-2">
              {releases.map((release) => (
                <div
                  key={release.id}
                  id={`release-${release.id}`}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-xl border border-surface-700/40 bg-surface-800/30 px-5 py-4 transition-all hover:border-surface-600 hover:bg-surface-800/50 sm:grid-cols-[1fr_140px_120px_100px]"
                >
                  {/* Title + Genre */}
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">{release.title}</h4>
                    <p className="mt-0.5 text-xs text-text-muted">{release.genre}</p>
                  </div>

                  {/* Platforms (hidden on very small screens) */}
                  <div className="hidden sm:flex flex-wrap gap-1">
                    {release.platform.map((p) => (
                      <span
                        key={p}
                        className="rounded bg-surface-700/50 px-2 py-0.5 text-[10px] font-medium text-text-muted"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* Date */}
                  <span className="text-right text-sm font-medium text-accent-cyan sm:text-left">
                    {release.date}
                  </span>

                  {/* Status */}
                  <span className={`hidden sm:inline-flex justify-center items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_STYLES[release.status]}`}>
                    {release.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-surface-700/40 bg-surface-800/30 px-8 py-16 text-center">
            <p className="text-text-muted">No releases found for the selected platform.</p>
          </div>
        )}
      </section>
    </div>
  )
}
