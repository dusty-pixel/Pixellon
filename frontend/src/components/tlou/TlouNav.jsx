import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Volume2, VolumeX, ChevronDown, ChevronLeft, ChevronRight, RefreshCw, Trophy, Flame } from 'lucide-react'

/**
 * Top navigation bar for Pixellon Top Games of the Week
 * Features:
 * - Pixellon platform brand + Top Games of the Week badge
 * - Dynamic ranking switcher tabs for the #1 - #5 games and Live Daily Leaderboard
 * - Prev/Next arrows to quickly cycle through this week's top games
 * - Live API sync button and atmospheric audio toggle
 */
export default function TlouNav({
  game,
  spotlightList = [],
  activeId,
  onSelectGame,
  isAudioPlaying,
  onToggleAudio,
  onOpenSearch,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim() && onOpenSearch) {
      onOpenSearch(searchQuery.trim())
    }
  }

  const handleRefreshLive = async () => {
    setIsRefreshing(true)
    try {
      await onSelectGame('live-daily', true)
    } finally {
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  // Find current index to support Next / Prev cycling
  const currentIndex = spotlightList.findIndex((item) => item.id === activeId)
  const handlePrevGame = () => {
    if (spotlightList.length === 0) return
    const prevIdx = (currentIndex - 1 + spotlightList.length) % spotlightList.length
    onSelectGame(spotlightList[prevIdx].id)
  }
  const handleNextGame = () => {
    if (spotlightList.length === 0) return
    const nextIdx = (currentIndex + 1) % spotlightList.length
    onSelectGame(spotlightList[nextIdx].id)
  }

  const isLiveActive =
    activeId === 'live-daily' || (game?.id && String(game.id).startsWith('daily'))

  return (
    <header className="relative z-30 w-full px-4 py-3 sm:px-8 sm:py-4 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4 border-b border-stone-800/60 bg-stone-950/70 backdrop-blur-xl">
      {/* ── Left: Pixellon Platform Brand ─────────────────────────── */}
      <div className="flex items-center justify-between w-full lg:w-auto">
        <Link to="/" className="group flex items-center gap-2.5 sm:gap-3">
          <span className="font-tlou text-2xl sm:text-3xl tracking-[0.1em] text-white group-hover:text-emerald-400 transition-colors">
            PIXELLON
          </span>
          <span className="h-4 w-px bg-stone-700 hidden sm:block" />
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/60 shadow-sm">
            <Trophy className="h-3 w-3 text-emerald-400" />
            <span className="font-cinematic text-[10px] sm:text-xs tracking-[0.18em] uppercase text-emerald-300 font-bold">
              TOP GAMES OF THE WEEK
            </span>
          </div>
        </Link>

        {/* Mobile Prev / Next Controls */}
        <div className="flex lg:hidden items-center gap-1 bg-stone-900/80 rounded-lg p-0.5 border border-stone-700">
          <button
            onClick={handlePrevGame}
            className="p-1.5 text-stone-300 hover:text-white"
            aria-label="Previous game"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNextGame}
            className="p-1.5 text-stone-300 hover:text-white"
            aria-label="Next game"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Center: Top Games of the Week Ranking Switcher ─────────── */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-stone-950/90 p-1 rounded-full border border-stone-800 backdrop-blur-2xl shadow-xl max-w-full overflow-x-auto scrollbar-none">
        {/* Prev Arrow */}
        <button
          onClick={handlePrevGame}
          className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
          title="Previous Top Game"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Quick Ranking Buttons (Top 4) */}
        {spotlightList.slice(0, 4).map((item) => {
          const isActive = activeId === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelectGame(item.id)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-cinematic uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-emerald-950 text-white border border-emerald-400/80 shadow-[0_0_14px_rgba(16,185,129,0.35)] font-bold'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
              }`}
            >
              <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-emerald-300' : 'text-stone-500'}`}>
                #{item.ranking || 1}
              </span>
              <span className="truncate max-w-[90px] sm:max-w-[120px]">{item.title}</span>
            </button>
          )
        })}

        {/* More Games Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-cinematic uppercase tracking-wider transition-colors cursor-pointer ${
              spotlightList.slice(4).some((item) => item.id === activeId)
                ? 'bg-emerald-950 text-emerald-200 border border-emerald-500/60 font-bold'
                : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
            }`}
            title="More rankings & live games"
          >
            <span>More</span>
            <ChevronDown className="h-3 w-3 text-stone-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl border border-stone-700/80 bg-stone-950/95 p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-400 border-b border-stone-800 flex items-center justify-between">
                <span>Top Games Leaderboard</span>
                <span>Metascore</span>
              </div>
              <div className="mt-1 space-y-1 max-h-64 overflow-y-auto">
                {spotlightList.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectGame(item.id)
                      setDropdownOpen(false)
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      item.id === activeId
                        ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/50'
                        : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-emerald-400 font-bold">
                          {item.ranking ? `#${item.ranking}` : 'LIVE'}
                        </span>
                        <span className="font-tlou tracking-wide text-sm truncate">{item.title}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 tracking-wider font-cinematic uppercase block truncate">
                        {item.developer}
                      </span>
                    </div>
                    {item.metacritic && (
                      <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-800 text-emerald-400 border border-emerald-900/50 font-bold">
                        {item.metacritic}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Daily Feed Button */}
        <button
          onClick={() => onSelectGame('live-daily')}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-cinematic uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
            isLiveActive
              ? 'bg-red-950 text-red-200 border border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.4)] font-bold'
              : 'text-stone-400 hover:text-white hover:bg-stone-900/60'
          }`}
          title="Switch to Real-Time Live Daily Gaming API"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span>Live API</span>
        </button>

        {/* Next Arrow */}
        <button
          onClick={handleNextGame}
          className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
          title="Next Top Game"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* ── Right: Live Sync Controls & Search ──────────────────────── */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Refresh Live API Button */}
        {isLiveActive && (
          <button
            onClick={handleRefreshLive}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-500/50 bg-red-950/60 text-red-200 hover:bg-red-900/70 font-cinematic text-[11px] uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-50"
            title="Fetch latest real-time daily games from live open API"
          >
            <RefreshCw className={`h-3 w-3 text-red-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
          </button>
        )}

        {/* Ambient Sound Toggle */}
        <button
          onClick={onToggleAudio}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-stone-900/60 text-stone-300 hover:text-white hover:border-emerald-500/40 backdrop-blur-md transition-all cursor-pointer"
          title={isAudioPlaying ? 'Mute Atmospheric Audio' : 'Play Atmospheric Audio'}
          aria-label="Toggle atmospheric audio"
        >
          {isAudioPlaying ? (
            <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <VolumeX className="h-3.5 w-3.5 text-stone-400" />
          )}
        </button>

        {/* Minimal Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search Vault"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-24 focus:w-44 transition-all duration-300 pl-3 pr-7 py-1 rounded-full border border-white/20 bg-stone-950/40 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-emerald-400/70 backdrop-blur-md font-cinematic tracking-wider"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            aria-label="Submit search"
          >
            <Search className="h-3 w-3" />
          </button>
        </form>
      </div>
    </header>
  )
}
