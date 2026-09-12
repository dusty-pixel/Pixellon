const TAG_COLORS = {
 violet: 'bg-pixel-blue/15 text-pixel-blue',
 cyan: 'bg-signal-blue/15 text-signal-blue',
 amber: 'bg-pixel-blue/15 text-pixel-blue',
 rose: 'bg-pixel-blue/15 text-pixel-blue',
 emerald: 'bg-signal-blue/15 text-signal-blue',
}

/**
 * Reusable game card component used across all pages.
 *
 * @param {object} props
 * @param {string} props.title - Game title
 * @param {string} props.genre - Genre label
 * @param {string[]} props.platform - Array of platform strings
 * @param {number} props.rating - Score out of 10
 * @param {string} props.image - Cover image URL
 * @param {string} props.excerpt - Short description
 * @param {string} [props.tag] - Optional badge text (e.g. "Trending")
 * @param {string} [props.tagColor] - Color key for the tag badge
 * @param {string} [props.verdict] - Review verdict label
 * @param {string} [props.developer] - Developer name
 * @param {'default'|'compact'|'featured'} [props.variant] - Layout variant
 * @param {function} [props.onClick] - Click handler
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
 className="group relative overflow-hidden rounded-2xl border border-surface-700 bg-surface-800 transition-all duration-200 hover:border-pixel-blue hover:shadow-lg hover:-translate-y-1 cursor-pointer"
 >
 <div className="relative aspect-[16/9] overflow-hidden">
 <img
 src={image}
 alt={title}
 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/40 to-transparent" />

 {/* Tag */}
 {tag && (
 <div className="absolute left-4 top-4">
 <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${TAG_COLORS[tagColor] || TAG_COLORS.violet}`}>
 {tag}
 </span>
 </div>
 )}

 {/* Rating */}
 <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-surface-600 bg-surface-900 shadow-md">
 <span className="text-sm font-bold text-pixel-blue">{rating}</span>
 </div>

 {/* Content over image */}
 <div className="absolute bottom-0 left-0 right-0 p-6">
 <div className="mb-2 flex items-center gap-2">
 <span className="text-xs font-semibold tracking-wider uppercase text-pixel-blue">{genre}</span>
 <span className="text-white/40">•</span>
 <span className="text-xs font-medium text-white/70">{platform.join(' / ')}</span>
 </div>
 <h3 className="font-display text-2xl font-bold text-white transition-colors group-hover:text-pixel-blue">
 {title}
 </h3>
 <p className="mt-2 text-sm leading-relaxed text-white/70 line-clamp-2">{excerpt}</p>
 </div>
 </div>
 </article>
 )
 }

 if (variant === 'compact') {
 return (
 <article
 onClick={onClick}
 className="group flex gap-4 rounded-xl border border-surface-700 bg-surface-800 p-3 transition-all duration-200 hover:border-surface-500 hover:shadow-md cursor-pointer"
 >
 <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
 <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
 {rating && (
 <div className="absolute bottom-1 right-1 flex h-6 w-8 items-center justify-center rounded-md bg-surface-950 border border-surface-700">
 <span className="text-[10px] font-bold text-pixel-blue">{rating}</span>
 </div>
 )}
 </div>
 <div className="flex min-w-0 flex-col justify-center">
 <h4 className="text-sm font-bold text-text-primary transition-colors group-hover:text-pixel-blue truncate">
 {title}
 </h4>
 <p className="mt-1 text-xs text-text-muted font-medium">{genre} • {platform.join(', ')}</p>
 {verdict && (
 <span className={`mt-2 inline-flex w-fit items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TAG_COLORS[tagColor]}`}>
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
 className="group flex flex-col h-full overflow-hidden rounded-xl border border-surface-700 bg-surface-800 transition-all duration-200 hover:border-pixel-blue hover:shadow-md hover:-translate-y-1 cursor-pointer"
 >
 <div className="relative aspect-[16/10] overflow-hidden">
 <img
 src={image}
 alt={title}
 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

 {tag && (
 <div className="absolute left-3 top-3">
 <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm border border-surface-600 ${TAG_COLORS[tagColor] || TAG_COLORS.violet}`}>
 {tag}
 </span>
 </div>
 )}

 {rating && (
 <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-surface-600 bg-surface-950 shadow-sm">
 <span className="text-xs font-bold text-pixel-blue">{rating}</span>
 </div>
 )}
 </div>

 <div className="flex flex-1 flex-col p-5">
 <div className="mb-2 flex items-center gap-2">
 <span className="text-[11px] font-bold uppercase tracking-wider text-pixel-blue">{genre}</span>
 {developer && (
 <>
 <span className="text-text-muted/50">•</span>
 <span className="text-[11px] font-medium text-text-muted truncate">{developer}</span>
 </>
 )}
 </div>
 <h3 className="font-display text-lg font-bold text-text-primary transition-colors group-hover:text-pixel-blue">
 {title}
 </h3>
 <p className="mt-2 text-sm leading-relaxed text-text-secondary line-clamp-2">{excerpt}</p>
 <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
 {platform.map((p) => (
 <span key={p} className="rounded-md border border-surface-600 bg-surface-700 px-2 py-1 text-[10px] font-semibold text-text-primary">
 {p}
 </span>
 ))}
 </div>
 </div>
 </article>
 )
}
