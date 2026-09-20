import { Flame, Eye } from 'lucide-react'

const DEFAULT_TRENDING = [
  {
    id: 1,
    title: 'Nintendo Switch 2 Rumors: 4K DLSS & Backward Compatibility Details Leaked',
    views: '14.2k',
    category: 'Hardware',
  },
  {
    id: 2,
    title: 'Grand Theft Auto VI: New Screenshots Showcase Next-Gen Ocean Physics',
    views: '11.8k',
    category: 'Rockstar',
  },
  {
    id: 3,
    title: 'Steam Breaks Record with 38 Million Concurrent Players Online',
    views: '9.4k',
    category: 'Steam',
  },
  {
    id: 4,
    title: 'Monster Hunter Wilds Beta Dates and PC System Requirements Revealed',
    views: '8.1k',
    category: 'Capcom',
  },
  {
    id: 5,
    title: 'Elden Ring Shadow of the Erdtree Patch 1.14 Rebalances Boss Poise',
    views: '6.7k',
    category: 'Update',
  },
]

export default function SidebarTrendingNews({ articles }) {
  // If actual articles are passed, use them, otherwise use curated trending
  const items = articles && articles.length >= 3
    ? articles.slice(0, 5).map((a, idx) => ({
        id: a.guid || a.link || idx,
        title: a.title,
        views: `${(15 - idx * 2.1).toFixed(1)}k`,
        category: a.category || 'Breaking',
        link: a.link,
      }))
    : DEFAULT_TRENDING

  return (
    <div className="rounded-2xl border border-surface-700 bg-brand-surface p-5 shadow-xl transition-all hover:border-brand-primary/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-brand-accent" />
          <h3 className="font-display text-sm font-bold text-brand-text">
            Trending Stories
          </h3>
        </div>
        <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
          HOT
        </span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <a
            key={item.id}
            href={item.link || '#'}
            target={item.link ? '_blank' : '_self'}
            rel="noreferrer"
            className="group flex items-start gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-surface-700 hover:bg-surface-900"
          >
            {/* Rank Number */}
            <span className={`font-mono text-xs font-extrabold shrink-0 mt-0.5 w-4 ${
              index === 0 ? 'text-amber-400' : index === 1 ? 'text-zinc-300' : index === 2 ? 'text-amber-600' : 'text-brand-muted'
            }`}>
              #{index + 1}
            </span>

            {/* Title & Metadata */}
            <div className="min-w-0 flex-1">
              <h4 className="font-display text-xs font-semibold text-brand-text leading-snug line-clamp-2 group-hover:text-brand-accent transition-colors">
                {item.title}
              </h4>
              <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-brand-muted">
                <span className="text-brand-muted">{item.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {item.views}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
