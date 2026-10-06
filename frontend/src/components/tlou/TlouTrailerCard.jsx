import { Play, ExternalLink } from 'lucide-react'

/**
 * Bottom right trailer preview card:
 * Compact, shadow-free video thumbnail with direct YouTube link and play overlay.
 */
export default function TlouTrailerCard({ game, onPlayTrailer }) {
  if (!game) return null

  const trailer = game.trailer || {
    title: 'Official Gameplay Reveal Trailer',
    youtubeId: 'qLZenOn7WUo',
    youtubeUrl: 'https://www.youtube.com/watch?v=qLZenOn7WUo',
    channel: 'Bandai Namco',
    thumbnail: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg',
    duration: '3:06',
    source: 'Official YouTube Channel',
  }

  const youtubeUrl =
    trailer.youtubeUrl ||
    (trailer.youtubeId
      ? `https://www.youtube.com/watch?v=${trailer.youtubeId}`
      : 'https://www.youtube.com')

  return (
    <div id="trailer-preview" className="space-y-2 max-w-sm w-full">
      {/* ── Section Title: RELEASE TRAILER & Real YouTube Link ──────── */}
      <div className="flex items-center justify-between">
        <h3 className="font-cinematic text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white/95 flex items-center gap-2">
          <span>RELEASE TRAILER</span>
          {trailer.duration && (
            <span className="font-mono text-[10px] tracking-widest text-stone-400 font-normal">
              {trailer.duration}
            </span>
          )}
        </h3>

        {/* Real YouTube Direct Link */}
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-cinematic text-[10px] uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
          title="Open real video on YouTube"
        >
          <svg className="h-3 w-3 fill-current text-red-500" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <span className="hidden sm:inline">YouTube</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
      </div>

      {/* ── Video Preview Card with Play Button Overlay (Shadowless) ── */}
      <div className="relative group">
        <button
          type="button"
          onClick={onPlayTrailer}
          className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/20 transition-all duration-300 hover:border-emerald-400/80 cursor-pointer text-left focus:outline-none focus:ring-1 focus:ring-emerald-400 block"
          aria-label={`Play ${trailer.title || 'game trailer'} on Pixellon`}
        >
          {/* Thumbnail Image */}
          <img
            src={trailer.thumbnail || '/images/tlou_trailer_thumb.jpg'}
            alt={trailer.title || 'Trailer Thumbnail'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Ambient Dark Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent transition-opacity group-hover:opacity-75" />

          {/* Centered Clean Play Button Overlay (Shadowless) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-stone-950/70 text-white backdrop-blur-md border border-white/40 transition-all duration-300 group-hover:scale-105 group-hover:bg-red-600 group-hover:border-red-400">
              <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current translate-x-0.5" />
            </div>
          </div>

          {/* Channel and Title Badges */}
          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-stone-200">
            <div className="truncate pr-2">
              <span className="font-cinematic uppercase tracking-wider block font-medium truncate text-white text-[11px]">
                {trailer.title || 'Official Trailer'}
              </span>
              <span className="text-[10px] text-stone-400 font-sans block truncate">
                {trailer.channel || trailer.source || 'Verified Official Stream'}
              </span>
            </div>
            <span className="shrink-0 font-mono text-[9px] text-red-400 bg-black/60 px-1.5 py-0.5 rounded border border-red-500/30">
              YouTube 4K
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
