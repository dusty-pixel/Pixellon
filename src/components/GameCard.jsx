const TAG_COLORS = {
  violet: 'bg-accent-violet/15 text-accent-violet',
  cyan: 'bg-accent-cyan/15 text-accent-cyan',
  amber: 'bg-accent-amber/15 text-accent-amber',
  rose: 'bg-accent-rose/15 text-accent-rose',
  emerald: 'bg-accent-emerald/15 text-accent-emerald',
}

/**
 * Reusable game card component used across all pages.
 *
 * @param {object} props
 * @param {string} props.title          - Game title
 * @param {string} props.genre          - Genre label
 * @param {string[]} props.platform     - Array of platform strings
 * @param {number} props.rating         - Score out of 10
 * @param {string} props.image          - Cover image URL
 * @param {string} props.excerpt        - Short description
 * @param {string} [props.tag]          - Optional badge text (e.g. "Trending")
 * @param {string} [props.tagColor]     - Color key for the tag badge
 * @param {string} [props.verdict]      - Review verdict label
 * @param {string} [props.developer]    - Developer name
 * @param {'default'|'compact'|'featured'} [props.variant] - Layout variant
 * @param {function} [props.onClick]    - Click handler
 */
export default function GameCard({
  title,
  genre,
  platform = [],
  rating,
  image,
  excerpt,
  tag,
  tagColor = 'violet',
  verdict,
  developer,
  variant = 'default',
  onClick,
}) {
  if (variant === 'featured') {
    return (
      <article
        onClick={onClick}
        className="group relative overflow-hidden rounded-2xl border border-surface-700/50 bg-surface-800/40 transition-all duration-300 hover:border-accent-violet/30 hover:glow-violet cursor-pointer"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950/90 via-surface-950/30 to-transparent" />

          {/* Tag */}
          {tag && (
            <div className="absolute left-4 top-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TAG_COLORS[tagColor] || TAG_COLORS.violet}`}>
                {tag}
              </span>
            </div>
          )}

          {/* Rating */}
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-950/70 backdrop-blur-sm">
            <span className="text-sm font-bold text-accent-amber">{rating}</span>
          </div>

          {/* Content over image */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-medium text-accent-violet">{genre}</span>
              <span className="text-text-muted">·</span>
              <span className="text-xs text-text-muted">{platform.join(' / ')}</span>
            </div>
            <h3 className="font-display text-xl font-bold text-text-primary transition-colors group-hover:text-accent-violet">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-2">{excerpt}</p>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article
        onClick={onClick}
        className="group flex gap-4 rounded-xl border border-surface-700/40 bg-surface-800/30 p-3 transition-all duration-200 hover:border-surface-600 hover:bg-surface-800/60 cursor-pointer"
      >
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
          {rating && (
            <div className="absolute bottom-1 right-1 flex h-6 w-8 items-center justify-center rounded bg-surface-950/80 backdrop-blur-sm">
              <span className="text-[10px] font-bold text-accent-amber">{rating}</span>
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          <h4 className="text-sm font-semibold text-text-primary transition-colors group-hover:text-accent-violet truncate">
            {title}
          </h4>
          <p className="mt-0.5 text-xs text-text-muted">{genre} · {platform.join(', ')}</p>
          {verdict && (
            <span className={`mt-1.5 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${TAG_COLORS[tagColor]}`}>
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
      className="group overflow-hidden rounded-xl border border-surface-700/40 bg-surface-800/30 transition-all duration-300 hover:border-surface-600 hover:bg-surface-800/60 cursor-pointer"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 to-transparent" />

        {tag && (
          <div className="absolute left-3 top-3">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TAG_COLORS[tagColor] || TAG_COLORS.violet}`}>
              {tag}
            </span>
          </div>
        )}

        {rating && (
          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-surface-950/70 backdrop-blur-sm">
            <span className="text-xs font-bold text-accent-amber">{rating}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xs font-medium text-accent-violet">{genre}</span>
          {developer && (
            <>
              <span className="text-text-muted">·</span>
              <span className="text-xs text-text-muted">{developer}</span>
            </>
          )}
        </div>
        <h3 className="font-display text-base font-bold text-text-primary transition-colors group-hover:text-accent-violet">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary line-clamp-2">{excerpt}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {platform.map((p) => (
            <span key={p} className="rounded-md bg-surface-700/50 px-2 py-0.5 text-[10px] font-medium text-text-muted">
              {p}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
