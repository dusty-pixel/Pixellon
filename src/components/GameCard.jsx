const TAG_COLORS = {
  blue: 'bg-brand-primary/15 text-brand-accent border-brand-primary/30',
  accent: 'bg-brand-accent/15 text-brand-accent border-brand-accent/30',
  violet: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  cyan: 'bg-brand-accent/15 text-brand-accent border-brand-accent/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
}

/**
 * Reusable game card component used across all pages.
 */
export default function GameCard({
  title,
  genre,
  platform = [],
  rating,
  image,
  excerpt,
  tag,
  tagColor = 'blue',
  verdict,
  developer,
  variant = 'default',
  onClick,
}) {
  if (variant === 'featured') {
    return (
      <article
        onClick={onClick}
        className="group flex flex-col h-full overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface transition-all duration-300 hover:border-brand-primary hover:shadow-[0_0_20px_rgba(2,132,199,0.25)] hover:-translate-y-1 cursor-pointer shadow-sm"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Tag */}
          {tag && (
            <div className="absolute left-3 top-3">
              <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-mono font-semibold backdrop-blur-md border ${TAG_COLORS[tagColor] || TAG_COLORS.blue}`}>
                {tag}
              </span>
            </div>
          )}

          {/* Rating */}
          {rating && (
            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-surface-700 bg-brand-surface/90 shadow-md backdrop-blur-sm">
              <span className="text-xs font-bold font-mono text-brand-accent">{rating}</span>
            </div>
          )}
        </div>

        {/* Content cleanly below image */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-accent">
              {genre}
            </span>
            <span className="text-brand-muted">•</span>
            <span className="text-xs font-medium text-brand-muted">{platform.join(' / ')}</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-text transition-colors group-hover:text-brand-accent">
            {title}
          </h3>
          {excerpt && (
            <p className="mt-2 text-sm leading-relaxed text-brand-muted line-clamp-2">{excerpt}</p>
          )}
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article
        onClick={onClick}
        className="group flex gap-4 rounded-xl border border-surface-700 bg-brand-surface p-3 transition-all duration-200 hover:border-brand-primary/50 hover:shadow-md cursor-pointer shadow-sm"
      >
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {rating && (
            <div className="absolute bottom-1 right-1 flex h-5 w-7 items-center justify-center rounded bg-brand-surface border border-surface-700">
              <span className="text-[10px] font-mono font-bold text-brand-accent">{rating}</span>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <h4 className="text-sm font-display font-bold text-brand-text transition-colors group-hover:text-brand-accent truncate">
            {title}
          </h4>
          <p className="mt-1 text-xs text-brand-muted font-medium truncate">
            {genre} • {platform.join(', ')}
          </p>
          {verdict && (
            <span className={`mt-2 inline-flex w-fit items-center rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${TAG_COLORS[tagColor] || TAG_COLORS.blue}`}>
              {verdict}
            </span>
          )}
        </div>
      </article>
    )
  }

  // Default variant
  return (
    <article
      onClick={onClick}
      className="group flex flex-col h-full overflow-hidden rounded-xl border border-surface-700 bg-brand-surface transition-all duration-200 hover:border-brand-primary hover:shadow-[0_0_16px_rgba(2,132,199,0.2)] hover:-translate-y-1 cursor-pointer shadow-sm"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {tag && (
          <div className="absolute left-3 top-3">
            <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border ${TAG_COLORS[tagColor] || TAG_COLORS.blue}`}>
              {tag}
            </span>
          </div>
        )}

        {rating && (
          <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg border border-surface-700 bg-brand-surface/90 shadow-sm backdrop-blur-sm">
            <span className="text-xs font-mono font-bold text-brand-accent">{rating}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-accent">
            {genre}
          </span>
          {developer && (
            <>
              <span className="text-brand-muted">•</span>
              <span className="text-[11px] font-medium text-brand-muted truncate">{developer}</span>
            </>
          )}
        </div>
        <h3 className="font-display text-lg font-bold text-brand-text transition-colors group-hover:text-brand-accent line-clamp-1">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 text-sm leading-relaxed text-brand-muted line-clamp-2">{excerpt}</p>
        )}
        <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
          {platform.map((p) => (
            <span
              key={p}
              className="rounded border border-surface-700 bg-surface-900 px-2 py-0.5 text-[10px] font-mono font-medium text-brand-muted"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
