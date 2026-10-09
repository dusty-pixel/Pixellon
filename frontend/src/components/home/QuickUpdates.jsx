import { Children } from 'react'
import { Link } from 'react-router-dom'
import { Flame, Trophy, Newspaper } from 'lucide-react'
import SectionHeader from '../SectionHeader'
import { SectionReveal, Pressable } from '../motion/Reveal'

function MarqueeRow({ children, duration = 40, reverse = false }) {
  const items = Children.toArray(children)
  return (
    <div className={`marquee overflow-hidden ${reverse ? 'marquee-reverse' : ''}`}>
      <div
        className="marquee-track py-1"
        style={{ '--marquee-duration': `${duration}s` }}
      >
        <div className="flex shrink-0 items-stretch gap-4 pr-4">{items}</div>
        <div aria-hidden="true" className="flex shrink-0 items-stretch gap-4 pr-4">{items}</div>
      </div>
    </div>
  )
}

function RowLabel({ icon: Icon, text, to }) {
  return (
    <Link
      to={to}
      className="mb-3 inline-flex items-center gap-2 rounded-lg border border-surface-700 bg-surface-900/60 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-brand-accent transition-colors hover:border-brand-primary/60 hover:text-brand-text"
    >
      <Icon size={13} />
      {text}
      <span aria-hidden>→</span>
    </Link>
  )
}

function GameChip({ game }) {
  return (
    <Link
      to={`/vault?search=${encodeURIComponent(game.title || '')}`}
      className="flex w-64 shrink-0 items-center gap-3 rounded-xl border border-surface-700 bg-brand-surface p-2.5 transition-colors hover:border-brand-primary/60"
    >
      <img
        src={game.image}
        alt={game.title}
        loading="lazy"
        className="h-14 w-14 shrink-0 rounded-lg object-cover"
      />
      <span className="min-w-0">
        <span className="block truncate font-display text-sm font-bold text-brand-text">
          {game.title}
        </span>
        <span className="mt-0.5 block truncate text-[11px] text-brand-muted">
          {game.genre}
          {game.rating ? ` · ★ ${game.rating}` : ''}
        </span>
      </span>
    </Link>
  )
}

function MatchChip({ match }) {
  const [a, b] = match.opponents || []
  const scoreA = match.results?.[0]?.score
  const scoreB = match.results?.[1]?.score
  const isLive = match.status === 'running'
  const isDone = match.status === 'finished'
  return (
    <Link
      to="/esports"
      className="w-72 shrink-0 rounded-xl border border-surface-700 bg-brand-surface p-3 transition-colors hover:border-brand-primary/60"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[10px] uppercase tracking-wider text-brand-muted">
          {match.league?.name || match.videogame?.name || 'Esports'}
        </span>
        {isLive ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded bg-red-950 px-1.5 py-0.5 font-mono text-[10px] font-bold text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </span>
        ) : (
          <span className="shrink-0 rounded bg-surface-800 px-1.5 py-0.5 font-mono text-[10px] text-brand-muted">
            {isDone ? 'FT' : match.begin_at ? new Date(match.begin_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'VS'}
          </span>
        )}
      </span>
      <span className="mt-1.5 block truncate font-display text-sm font-bold text-brand-text">
        {a?.opponent?.name || 'TBD'}
        <span className="mx-1.5 font-mono text-xs text-brand-muted">
          {isDone || isLive ? `${scoreA ?? 0} – ${scoreB ?? 0}` : 'vs'}
        </span>
        {b?.opponent?.name || 'TBD'}
      </span>
    </Link>
  )
}

function NewsChip({ article }) {
  const img = article.thumbnail || article.enclosure?.link
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-80 shrink-0 items-center gap-3 rounded-xl border border-surface-700 bg-brand-surface p-2.5 transition-colors hover:border-brand-primary/60"
    >
      {img && (
        <img
          src={img}
          alt=""
          loading="lazy"
          className="h-14 w-20 shrink-0 rounded-lg object-cover"
        />
      )}
      <span className="min-w-0">
        <span className="block truncate font-mono text-[10px] uppercase tracking-wider text-brand-muted">
          World news
          {article.pubDate ? ` · ${new Date(article.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
        </span>
        <span className="mt-0.5 block truncate font-display text-sm font-bold text-brand-text">
          {article.title}
        </span>
      </span>
    </a>
  )
}

/**
 * "Here are some quick updates" — three auto-scrolling carousels:
 * hot game picks, latest esports matches, world gaming news.
 * Pauses on hover; static when reduced-motion is preferred.
 */
export default function QuickUpdates({ games = [], matches = [], news = [] }) {
  if (!games.length && !matches.length && !news.length) return null
  return (
    <section id="quick-updates" className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pt-8 sm:px-6 lg:px-8">
      <SectionHeader
        title="Here are some quick updates"
        subtitle="Hot picks, esports scores and world news — scrolling by. Hover any row to pause."
        accent="accent"
      />
      <SectionReveal className="space-y-6">
        {games.length > 0 && (
          <div>
            <RowLabel icon={Flame} text="Hot picks" to="/reviews" />
            <MarqueeRow duration={Math.max(25, games.length * 7)}>
              {games.slice(0, 8).map((g) => (
                <Pressable key={g.id} className="shrink-0" lift={-2}>
                  <GameChip game={g} />
                </Pressable>
              ))}
            </MarqueeRow>
          </div>
        )}
        {matches.length > 0 && (
          <div>
            <RowLabel icon={Trophy} text="Esports latest" to="/esports" />
            <MarqueeRow duration={Math.max(25, matches.length * 7)} reverse>
              {matches.slice(0, 8).map((m) => (
                <Pressable key={m.id} className="shrink-0" lift={-2}>
                  <MatchChip match={m} />
                </Pressable>
              ))}
            </MarqueeRow>
          </div>
        )}
        {news.length > 0 && (
          <div>
            <RowLabel icon={Newspaper} text="World news" to="/news" />
            <MarqueeRow duration={Math.max(30, news.length * 6)}>
              {news.slice(0, 10).map((n, i) => (
                <Pressable key={n.link || n.title || i} className="shrink-0" lift={-2}>
                  <NewsChip article={n} />
                </Pressable>
              ))}
            </MarqueeRow>
          </div>
        )}
      </SectionReveal>
    </section>
  )
}
