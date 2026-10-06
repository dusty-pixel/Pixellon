import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'

/**
 * Left Column hero component:
 * Compact, shortened layout with clean typography, no text shadows, and tighter spacing.
 */
export default function TlouHeroLeft({ game, onWatchTrailer }) {
  if (!game) return null

  return (
    <div className="flex flex-col justify-between space-y-3.5 max-w-2xl">
      {/* ── Main Title & Narrative Section ────────────────────────── */}
      <div className="space-y-2">
        {/* Dynamic Status / Mode Badge */}
        {(game?.id && String(game.id).startsWith('daily')) || game?.dataSource?.name?.includes('FreeToGame') ? (
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-200 font-mono text-[11px] tracking-wider backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="font-bold uppercase tracking-wider">Live Daily API Feed</span>
            <span className="text-red-500/80">•</span>
            <span className="text-stone-300 font-sans">FreeToGame Open Database • Real-Time Sync</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-cinematic text-[11px] tracking-widest uppercase backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-bold text-white">
              {game?.rankingBadge || (game?.ranking ? `#${game.ranking} TOP GAME OF THE WEEK` : 'TOP GAME OF THE WEEK')}
            </span>
            <span className="text-emerald-500/60">•</span>
            <span className="text-stone-300">{game?.developer || 'Official Studio'}</span>
            {game?.metacritic && (
              <>
                <span className="text-emerald-500/60">•</span>
                <span className="font-mono text-emerald-300 font-bold">{game.metacritic} Metascore</span>
              </>
            )}
          </div>
        )}

        {/* Subtitle / Part Indicator */}
        <div className="flex items-center gap-3 pt-0.5">
          <span className="tlou-subtitle-stencil text-xs sm:text-sm tracking-[0.3em] font-semibold text-stone-300">
            {game.subtitle || 'PART II'}
          </span>
          {game.ageRating && (
            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border border-stone-600/50 bg-stone-900/60 text-stone-400">
              {game.ageRating}
            </span>
          )}
        </div>

        {/* Crisp Weathered Title (Clean & Shadowless) */}
        <h1
          id="hero-game-title"
          className="tlou-weathered-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase font-bold tracking-tight select-none leading-none"
        >
          {game.title || 'THE LAST OF US'}
        </h1>

        {/* ── "ABOUT THE GAME" Section ──────────────────────────────── */}
        <div id="about-section" className="space-y-1.5 pt-1">
          <h2 className="font-cinematic text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-white/95 flex items-center gap-2">
            <span>ABOUT THE GAME</span>
            <span className="h-px flex-1 max-w-[60px] bg-stone-500/40" />
          </h2>

          <p className="font-sans text-xs sm:text-sm leading-relaxed text-stone-300/90 font-light max-w-xl text-justify sm:text-left line-clamp-2">
            {game.synopsis}
          </p>

          {game.logline && (
            <p className="font-cinematic text-xs tracking-wider italic text-emerald-400/90 pt-0.5 line-clamp-1">
              "{game.logline}"
            </p>
          )}
        </div>

        {/* ── Custom CTA Buttons (Shadowless) ───────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Muted Blood-Red Primary CTA Button (Shadowless) */}
          <Link
            to={game.cta?.primaryUrl || `/vault/${game.slug || 'the-last-of-us-part-ii'}`}
            id="hero-primary-cta"
            className="tlou-btn-crimson px-6 py-2.5 text-xs sm:text-sm font-bold"
          >
            {game.cta?.primary || 'PREORDER NOW'}
          </Link>

          {/* Secondary Watch Trailer CTA (Shadowless) */}
          <button
            onClick={onWatchTrailer}
            id="hero-secondary-trailer-btn"
            className="tlou-btn-ghost px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Play className="h-3.5 w-3.5 fill-current text-white/90" />
            <span>Watch Trailer</span>
          </button>

          {/* Quick Platform Badges */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2">
            {game.platforms?.slice(0, 3).map((p, idx) => (
              <span
                key={idx}
                className="font-cinematic text-[10px] tracking-wider uppercase text-stone-400 px-2 py-0.5 rounded bg-stone-900/60 border border-stone-800 backdrop-blur-sm"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Left: Socials & Studio Tagline (Compact Single Row) ── */}
      <div className="pt-2.5 border-t border-stone-800/40 flex flex-wrap items-center justify-between gap-3 text-stone-400">
        {/* Social Icons (Instagram, Facebook, Twitter, Discord) */}
        <div className="flex items-center gap-3.5">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
            </svg>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Twitter / X"
          >
            <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Discord"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>
        </div>

        {/* Studio Production Tagline */}
        <div className="font-cinematic text-[10px] tracking-[0.2em] uppercase text-stone-400/90 flex items-center gap-2">
          <span>Produced by</span>
          <span className="font-bold text-stone-200 tracking-[0.2em]">
            {game.producedBy || game.developer || 'OFFICIAL STUDIO'}
          </span>
          <span className="text-stone-600">•</span>
          <span className="text-stone-400/70">Curated by PIXELLON</span>
        </div>
      </div>
    </div>
  )
}
