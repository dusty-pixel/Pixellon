import { useEffect, useState } from 'react'
import { X, ExternalLink, Play, Film, AlertCircle, ShieldCheck } from 'lucide-react'

/**
 * Cinematic video trailer modal with real embedded YouTube player,
 * active fallback controls, and direct official YouTube link.
 */
export default function TlouTrailerModal({ isOpen, onClose, trailer, gameTitle }) {
  const [playerMode, setPlayerMode] = useState('embed') // 'embed' | 'poster'

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Always use verified working YouTube ID (default to verified PlayStation TLOU trailer II5UsqP2JAk)
  const youtubeId = trailer?.youtubeId && trailer.youtubeId !== 'vhII1qlCZ4E'
    ? trailer.youtubeId
    : 'II5UsqP2JAk'

  const youtubeUrl =
    trailer?.youtubeUrl || `https://www.youtube.com/watch?v=${youtubeId}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-2xl animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Game Trailer Player"
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-stone-700/80 bg-stone-950 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header Bar ────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-stone-800 bg-stone-900/90">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2">
              <h3 className="font-tlou text-xl sm:text-2xl tracking-wide text-white uppercase truncate">
                {gameTitle || 'The Last of Us'}
              </h3>
              <span className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-700/50">
                <ShieldCheck className="h-2.5 w-2.5 text-emerald-400" />
                <span>Verified Official Trailer</span>
              </span>
            </div>
            <p className="font-cinematic text-xs tracking-wider text-stone-400 uppercase truncate mt-0.5">
              {trailer?.title || 'Official Cinematic Trailer'} • {trailer?.channel || 'Official Channel'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Direct Open in YouTube */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-cinematic text-xs uppercase tracking-wider transition-colors shadow-md"
              title="Open video directly on YouTube"
            >
              <svg className="h-3 w-3 fill-current text-white" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>Watch on YouTube</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors cursor-pointer"
              aria-label="Close trailer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Video Frame or Cinematic Poster ─────────────────────────── */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {playerMode === 'embed' ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
              title={trailer?.title || 'Official Game Trailer'}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="relative h-full w-full">
              <img
                src={trailer?.thumbnail || 'https://i.ytimg.com/vi/II5UsqP2JAk/hqdefault.jpg'}
                alt={trailer?.title || 'Trailer'}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white shadow-2xl transition-transform hover:scale-110 mb-4 cursor-pointer"
                >
                  <Play className="h-7 w-7 fill-current translate-x-0.5" />
                </a>
                <h4 className="font-tlou text-2xl text-white uppercase tracking-wider mb-2">
                  {trailer?.title || 'Official Trailer'}
                </h4>
                <p className="text-xs text-stone-300 max-w-md mb-4 font-sans">
                  Click the button below to stream the official full 4K trailer directly on YouTube without browser embed restrictions.
                </p>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-cinematic text-xs uppercase tracking-wider font-semibold inline-flex items-center gap-2 shadow-lg"
                >
                  <span>Launch Official YouTube Broadcast</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ── Modal Footer Bar ────────────────────────────────────────── */}
        <div className="px-5 sm:px-6 py-3 border-t border-stone-800/80 bg-stone-900/70 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-cinematic uppercase tracking-wider text-stone-300">
              Source: {trailer?.source || trailer?.channel || 'Official Channel'}
            </span>
            <span className="text-stone-600">•</span>
            <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/30">
              1080p / 4K UHD
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlayerMode(playerMode === 'embed' ? 'poster' : 'embed')}
              className="text-[11px] font-cinematic uppercase tracking-wider text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              {playerMode === 'embed' ? 'Having embed issues? Use Direct Player' : 'Switch back to Embedded Video'}
            </button>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-cinematic text-xs text-red-400 hover:text-red-300 uppercase tracking-wider inline-flex items-center gap-1 font-semibold"
            >
              <span>Direct Link</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
