import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gift,
  Filter,
  Loader2,
  Monitor,
  Globe,
  Radio,
  Sparkles,
  ExternalLink,
  Flame,
  Clock,
  Tag,
  Zap,
  ChevronLeft,
  ChevronRight,
  Send,
  Pause,
  Play,
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { PixelPatternBg } from '../components/BrandDecorations'
import { getWeeklyGiveaways, getFreeGames } from '../utils/api'
import DiscordWebhookModal from '../components/DiscordWebhookModal'
import ToastNotification from '../components/ToastNotification'
import {
  isWebhookConfigured,
  sendFreeGameToDiscord,
  broadcastMultipleGames,
} from '../utils/discordWebhook'
import { formatINR } from '../utils/currency'

const ROTATION_INTERVAL = 5500 // 5.5 seconds per slide

export default function FreeGames() {
  // Feed mode: 'giveaways' (Weekly drops), 'newest' (Latest releases), 'popular' (All-time top)
  const [feedMode, setFeedMode] = useState('giveaways')
  const [platform, setPlatform] = useState('all')

  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  // Carousel & Spotlight state
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progressKey, setProgressKey] = useState(0) // resets animated bar

  // Discord Integration state
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false)
  const [discordConfigured, setDiscordConfigured] = useState(isWebhookConfigured())
  const [sharingGameId, setSharingGameId] = useState(null)
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [toast, setToast] = useState(null)

  // Fetch games based on active tab and platform
  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      setLoading(true)
      let data = []

      try {
        if (feedMode === 'giveaways') {
          const platParam = platform === 'all' ? '' : platform
          data = await getWeeklyGiveaways(platParam)
        } else if (feedMode === 'newest') {
          const platParam = platform === 'all' ? 'all' : platform === 'browser' ? 'browser' : 'pc'
          data = await getFreeGames(platParam, 'release-date')
        } else {
          const platParam = platform === 'all' ? 'all' : platform === 'browser' ? 'browser' : 'pc'
          data = await getFreeGames(platParam, 'popularity')
        }

        if (isMounted) {
          setGames(data || [])
          setFeaturedIndex(0)
          setProgressKey((k) => k + 1)
        }
      } catch (err) {
        console.error('Failed to load games feed:', err)
        if (isMounted) setGames([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [feedMode, platform])

  // Top 5 games to rotate through
  const spotlightCount = Math.min(games.length, 5)
  const spotlightList = games.slice(0, spotlightCount)
  const featuredGame = games[featuredIndex] || games[0]

  // Auto-rotation timer
  useEffect(() => {
    if (loading || spotlightCount <= 1 || isPaused) return

    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % spotlightCount)
      setProgressKey((k) => k + 1)
    }, ROTATION_INTERVAL)

    return () => clearInterval(timer)
  }, [loading, spotlightCount, isPaused, featuredIndex])

  const handleNextSlide = () => {
    if (spotlightCount <= 1) return
    setFeaturedIndex((prev) => (prev + 1) % spotlightCount)
    setProgressKey((k) => k + 1)
  }

  const handlePrevSlide = () => {
    if (spotlightCount <= 1) return
    setFeaturedIndex((prev) => (prev - 1 + spotlightCount) % spotlightCount)
    setProgressKey((k) => k + 1)
  }

  const handleSelectSlide = (idx) => {
    setFeaturedIndex(idx)
    setProgressKey((k) => k + 1)
  }

  const showToast = (type, title, message) => {
    setToast({ type, title, message })
    setTimeout(() => {
      setToast(null)
    }, 4500)
  }

  const handleShareToDiscord = async (game, e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!isWebhookConfigured()) {
      setIsDiscordModalOpen(true)
      return
    }

    setSharingGameId(game.id)
    try {
      await sendFreeGameToDiscord(game)
      showToast('success', 'Sent to Discord!', `"${game.title}" drop alert posted to your channel.`)
    } catch (err) {
      showToast('error', 'Discord Error', err.message || 'Failed to post to Discord.')
    } finally {
      setSharingGameId(null)
    }
  }

  const handleBroadcastTopDrops = async () => {
    if (!isWebhookConfigured()) {
      setIsDiscordModalOpen(true)
      return
    }

    if (!games.length) return

    setIsBroadcasting(true)
    const topGames = games.slice(0, 3)

    try {
      showToast('info', 'Broadcasting Drops...', 'Posting top 3 game alerts to Discord.')
      const results = await broadcastMultipleGames(topGames)
      const successCount = results.filter((r) => r.success).length
      showToast(
        'success',
        'Broadcast Complete!',
        `Successfully sent ${successCount} game alerts to Discord.`
      )
    } catch (err) {
      showToast('error', 'Broadcast Error', err.message || 'Failed to complete broadcast.')
    } finally {
      setIsBroadcasting(false)
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1600px] 2xl:max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6">
        {/* Compact Modern Header */}
        <header className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface p-5 sm:p-6 shadow-xl">
          <PixelPatternBg />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left Info */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 rounded-lg border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-xs font-mono font-semibold text-brand-accent tracking-wide">
                <span className="h-1.5 w-1.5 rounded-[2px] bg-brand-accent" />
                <span>Epic Games & Steam Weekly Radar</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-text">
                Free Games & Weekly Giveaways
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted">
                Claim limited-time weekly 100% OFF giveaways and freshly released free-to-play drops.
              </p>
            </div>

            {/* Right Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsDiscordModalOpen(true)}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-mono font-medium transition-all duration-150 cursor-pointer border ${
                  discordConfigured
                    ? 'border-[#5865F2]/40 bg-[#5865F2]/15 text-[#9ba4fe] hover:bg-[#5865F2]/25'
                    : 'border-surface-700 bg-surface-900 text-brand-muted hover:border-[#5865F2]/50 hover:text-brand-text'
                }`}
              >
                <svg className="h-3.5 w-3.5 fill-current text-[#5865F2]" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>Discord Alerts</span>
                {discordConfigured ? (
                  <span className="flex items-center gap-1 text-[10px] text-brand-accent font-sans font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                    Active
                  </span>
                ) : (
                  <span className="text-[9px] text-brand-muted bg-brand-surface border border-surface-700 px-1 py-0.5 rounded">Setup</span>
                )}
              </button>

              <button
                onClick={handleBroadcastTopDrops}
                disabled={isBroadcasting || !games.length}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-primary/20 border border-brand-primary/40 px-3.5 py-2 text-xs font-mono font-semibold text-brand-accent hover:bg-brand-primary hover:text-white transition-all duration-150 cursor-pointer disabled:opacity-50"
              >
                {isBroadcasting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Radio className="h-3.5 w-3.5 text-brand-accent" />
                )}
                <span>{isBroadcasting ? 'Broadcasting...' : 'Broadcast Top Drops'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* AUTO-ROTATING SPOTLIGHT HERO BANNER (Active for ALL Feed Modes)           */}
        {/* ========================================================================= */}
        {!loading && featuredGame && (
          <section
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative overflow-hidden rounded-3xl border border-surface-700 bg-brand-surface shadow-2xl transition-all"
          >
            {/* Ambient Background Glow matching the game's artwork */}
            <div
              className="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 pointer-events-none -z-0 scale-110 transition-all duration-700"
              style={{
                backgroundImage: `url(${featuredGame.hdImage || featuredGame.image || featuredGame.thumbnail})`,
              }}
            />
            <div className="absolute inset-0 bg-brand-surface/75 pointer-events-none z-0" />

            {/* Top Auto-Rotation Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-surface-700/60 z-20 overflow-hidden">
              {!isPaused && (
                <motion.div
                  key={progressKey}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: ROTATION_INTERVAL / 1000, ease: 'linear' }}
                  className="h-full bg-brand-primary"
                />
              )}
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 lg:p-10 items-center">
              {/* Left Column: Details & Call to Action */}
              <div className="lg:col-span-6 space-y-5 order-2 lg:order-1">
                {/* Dynamic Category Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {feedMode === 'giveaways' ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary/20 px-3 py-1 text-xs font-bold text-brand-accent border border-brand-primary/40 backdrop-blur-md">
                        <Sparkles className="h-3.5 w-3.5" />
                        WEEKLY 100% OFF SPOTLIGHT
                      </span>
                      {featuredGame.worth && featuredGame.worth !== 'N/A' && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-brand-primary/20 px-2.5 py-1 text-xs font-bold text-brand-accent border border-brand-primary/40">
                          -100% OFF
                        </span>
                      )}
                    </>
                  ) : feedMode === 'newest' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary/20 px-3 py-1 text-xs font-bold text-brand-accent border border-brand-primary/40 backdrop-blur-md">
                      <Zap className="h-3.5 w-3.5" />
                      BRAND NEW RELEASE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary/20 px-3 py-1 text-xs font-bold text-brand-accent border border-brand-primary/40 backdrop-blur-md">
                      <Flame className="h-3.5 w-3.5" />
                      ALL-TIME COMMUNITY HIT
                    </span>
                  )}

                  <span className="rounded-lg bg-surface-700/60 px-3 py-1 text-xs font-mono font-medium text-brand-text border border-surface-700">
                    {featuredGame.platforms || (featuredGame.platform === 'PC (Windows)' ? 'PC Windows' : 'Web Browser')}
                  </span>
                </div>

                {/* Game Title */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featuredGame.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text tracking-tight leading-tight">
                      {featuredGame.title}
                    </h2>

                    {/* Pricing & Time details */}
                    <div className="flex flex-wrap items-center gap-4 py-0.5">
                      {featuredGame.worth && featuredGame.worth !== 'N/A' ? (
                        <div className="flex items-center gap-2.5">
                          <span className="text-brand-muted line-through text-base sm:text-lg font-medium">
                            {formatINR(featuredGame.worth)}
                          </span>
                          <span className="text-2xl sm:text-3xl font-extrabold text-brand-accent font-display">
                            FREE
                          </span>
                          <span className="text-xs font-medium text-brand-muted border border-surface-700 rounded px-2 py-0.5">
                            Keep Forever
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl sm:text-3xl font-extrabold text-brand-accent font-display">
                            FREE TO PLAY
                          </span>
                          {featuredGame.genre && (
                            <span className="text-xs font-mono text-brand-accent bg-brand-primary/10 border border-brand-primary/30 rounded px-2.5 py-1">
                              {featuredGame.genre}
                            </span>
                          )}
                        </div>
                      )}

                      {featuredGame.end_date && featuredGame.end_date !== 'N/A' && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-brand-accent bg-brand-primary/10 border border-brand-primary/30 px-3 py-1 rounded-lg">
                          <Clock className="h-3.5 w-3.5 text-brand-accent" />
                          <span>Ends {featuredGame.end_date.split(' ')[0]}</span>
                        </div>
                      )}

                      {!featuredGame.end_date && featuredGame.release_date && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-muted bg-surface-700/40 border border-surface-700 px-3 py-1 rounded-lg">
                          <span>Released: {featuredGame.release_date}</span>
                        </div>
                      )}
                    </div>

                    {/* Synopsis */}
                    <p className="text-sm sm:text-base text-brand-muted leading-relaxed font-sans line-clamp-3">
                      {featuredGame.description || featuredGame.short_description || featuredGame.instructions}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Action Buttons & Slide Controls */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={featuredGame.open_giveaway_url || featuredGame.game_url || featuredGame.freetogame_profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary hover:bg-[#0274B3] px-6 py-3 text-sm font-bold text-white transition-all duration-150 active:scale-95 cursor-pointer shadow-md"
                  >
                    <span>{feedMode === 'giveaways' ? 'Claim Free Drop' : 'Play Free Now'}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>

                  {/* Discord Share */}
                  <button
                    type="button"
                    onClick={(e) => handleShareToDiscord(featuredGame, e)}
                    disabled={sharingGameId === featuredGame.id}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#5865F2]/50 bg-[#5865F2]/20 px-5 py-3 text-xs font-mono font-medium text-[#7985f7] dark:text-[#9ba4fe] hover:bg-[#5865F2]/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {sharingGameId === featuredGame.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 text-[#5865F2]" />
                    )}
                    <span>Share to Discord</span>
                  </button>

                  {/* Play / Pause Toggle indicator */}
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    title={isPaused ? 'Resume Auto-Rotation' : 'Pause Auto-Rotation'}
                    className="p-3 rounded-lg border border-surface-700 bg-brand-surface text-brand-muted hover:text-brand-text hover:bg-surface-700/40 transition-colors cursor-pointer ml-auto hidden sm:flex items-center gap-1.5 text-xs font-mono"
                  >
                    {isPaused ? <Play className="h-3.5 w-3.5 text-brand-accent" /> : <Pause className="h-3.5 w-3.5 text-brand-muted" />}
                    <span>{isPaused ? 'Paused' : 'Auto-Rotating'}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: High-Res Artwork & Rotating Slider controls */}
              <div className="lg:col-span-6 space-y-3 order-1 lg:order-2">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-surface-700 shadow-2xl bg-surface-900 group">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={featuredGame.id}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.35 }}
                      src={featuredGame.hdImage || featuredGame.image || featuredGame.thumbnail}
                      alt={featuredGame.title}
                      loading="eager"
                      className="h-full w-full object-cover select-none"
                    />
                  </AnimatePresence>

                  {/* Previous / Next Arrow Controls */}
                  <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <button
                      onClick={handlePrevSlide}
                      title="Previous featured game"
                      className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 hover:bg-brand-primary hover:border-brand-primary transition-all cursor-pointer shadow-lg"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      title="Next featured game"
                      className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 hover:bg-brand-primary hover:border-brand-primary transition-all cursor-pointer shadow-lg"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Rotating Thumbnails Bar */}
                {spotlightList.length > 1 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-mono text-brand-muted mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
                        FEATURED HIGHLIGHTS ({featuredIndex + 1} of {spotlightList.length}):
                      </span>
                      <span className="text-brand-accent text-[10px]">Auto-rotates every 5s</span>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {spotlightList.map((item, idx) => {
                        const isSelected = idx === featuredIndex
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectSlide(idx)}
                            className={`group/thumb relative aspect-[16/9] overflow-hidden rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.03]'
                                : 'border-surface-700 opacity-60 hover:opacity-100 hover:border-brand-accent'
                            }`}
                          >
                            <img
                              src={item.hdImage || item.thumbnail || item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <span className="absolute bottom-1 left-1.5 right-1.5 truncate text-[9px] font-semibold text-white">
                              {item.title}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* FEED MODE TABS & PLATFORM FILTER BAR                                      */}
        {/* ========================================================================= */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 rounded-2xl border border-surface-700 bg-brand-surface/95 backdrop-blur-md p-3 sm:px-5 sm:py-3.5 shadow-sm">
          {/* Main Feed Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface-900 border border-surface-700 w-full lg:w-auto justify-center">
            {[
              { id: 'giveaways', label: 'Weekly Giveaways', icon: Gift, badge: 'Hot' },
              { id: 'newest', label: 'Newest Releases', icon: Zap },
              { id: 'popular', label: 'Most Popular', icon: Flame },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = feedMode === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFeedMode(tab.id)
                    setPlatform('all')
                  }}
                  className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all duration-150 cursor-pointer relative ${
                    isActive
                      ? 'bg-brand-primary text-white font-semibold shadow-[0_2px_10px_rgba(2,132,199,0.35)]'
                      : 'text-brand-muted hover:text-brand-text hover:bg-surface-700/40'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-brand-accent'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Platform Filters */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-center">
            <div className="flex items-center gap-1 text-xs font-mono text-brand-muted mr-1 hidden sm:flex">
              <Filter className="h-3 w-3 text-brand-accent" />
              <span>PLATFORM:</span>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-900 border border-surface-700">
              {feedMode === 'giveaways' ? (
                [
                  { id: 'all', label: 'All Stores' },
                  { id: 'epic-games-store', label: 'Epic Games' },
                  { id: 'steam', label: 'Steam' },
                  { id: 'pc', label: 'PC' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      platform === p.id
                        ? 'bg-brand-primary text-white font-semibold shadow-xs'
                        : 'text-brand-muted hover:text-brand-text'
                    }`}
                  >
                    {p.label}
                  </button>
                ))
              ) : (
                [
                  { id: 'all', label: 'All' },
                  { id: 'pc', label: 'PC Windows' },
                  { id: 'browser', label: 'Browser' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      platform === p.id
                        ? 'bg-brand-primary text-white font-semibold shadow-xs'
                        : 'text-brand-muted hover:text-brand-text'
                    }`}
                  >
                    {p.label}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between pt-2">
          <h3 className="font-display text-xl font-bold text-brand-text flex items-center gap-2">
            <span>
              {feedMode === 'giveaways'
                ? 'All Weekly Giveaways & Drops'
                : feedMode === 'newest'
                ? 'Recently Added Free Games'
                : 'All-Time Popular Free Titles'}
            </span>
            {!loading && (
              <span className="rounded-full bg-surface-700/60 px-2.5 py-0.5 text-xs font-mono text-brand-accent border border-surface-700">
                {games.length}
              </span>
            )}
          </h3>
        </div>

        {/* ========================================================================= */}
        {/* COMPACT & SLEEK GAME CARDS GRID                                           */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            <p className="text-xs font-mono text-brand-muted tracking-wider">
              {feedMode === 'giveaways' ? 'FETCHING WEEKLY GIVEAWAYS...' : 'FETCHING FREE GAMES...'}
            </p>
          </div>
        ) : games.length === 0 ? (
          <div className="rounded-2xl border border-surface-700 bg-brand-surface p-12 text-center shadow-sm">
            <Gift className="h-10 w-10 text-brand-muted mx-auto mb-3" />
            <p className="text-brand-text font-semibold">No active games found for this filter</p>
            <p className="text-xs text-brand-muted mt-1">Try switching the platform filter to "All".</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game, i) => {
              const isGiveaway = Boolean(game.worth && game.worth !== 'N/A')
              const claimUrl = game.open_giveaway_url || game.game_url || game.freetogame_profile_url
              const thumbnail = game.image || game.thumbnail
              const platformLabel = game.platforms || (game.platform === 'PC (Windows)' ? 'PC' : 'Web')
              const releaseDate = game.release_date || (game.published_date ? game.published_date.split(' ')[0] : null)

              return (
                <motion.article
                  key={game.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.025, 0.25) }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-primary/50 hover:shadow-xl"
                >
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-900">
                    <img
                      src={thumbnail}
                      alt={game.title}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Top-Left: Discount Badge / Free Badge */}
                    <div className="absolute left-3 top-3 flex items-center gap-1.5">
                      {isGiveaway ? (
                        <div className="inline-flex items-center gap-1 rounded-lg bg-brand-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-brand-accent border border-brand-primary/40 backdrop-blur-md shadow-sm">
                          <Tag className="h-3 w-3" />
                          <span>-100% OFF</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary/20 px-2.5 py-0.5 text-[10px] font-semibold text-brand-accent border border-brand-primary/30 backdrop-blur-md shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-[2px] bg-brand-accent" />
                          FREE
                        </div>
                      )}
                    </div>

                    {/* Top-Right: Quick Discord Drop Action */}
                    <button
                      type="button"
                      onClick={(e) => handleShareToDiscord(game, e)}
                      disabled={sharingGameId === game.id}
                      title="Post drop alert to Discord"
                      className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-zinc-300 backdrop-blur-md border border-white/10 hover:bg-[#5865F2] hover:text-white hover:border-[#5865F2] transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50"
                    >
                      {sharingGameId === game.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                      ) : (
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                      )}
                    </button>

                    {/* Bottom-Right platform indicator */}
                    <div className="absolute right-3 bottom-2.5 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-mono font-medium text-white backdrop-blur-sm border border-white/10 line-clamp-1 max-w-[140px]">
                      {platformLabel}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-5 pt-4">
                    {/* Meta bar */}
                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-mono">
                      <span className="font-semibold uppercase tracking-wider text-brand-accent">
                        {game.genre || game.type || 'Game'}
                      </span>
                      {game.end_date && game.end_date !== 'N/A' && (
                        <span className="flex items-center gap-1 text-brand-accent font-medium">
                          <Clock className="h-3 w-3 text-brand-accent" />
                          <span>Ends {game.end_date.split(' ')[0]}</span>
                        </span>
                      )}
                      {!game.end_date && releaseDate && (
                        <span className="text-brand-muted">
                          {releaseDate}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="mb-1.5 font-display text-base font-bold text-brand-text transition-colors group-hover:text-brand-accent line-clamp-1">
                      {game.title}
                    </h3>

                    {/* Pricing / Value Comparison */}
                    {isGiveaway ? (
                      <div className="mb-3 flex items-center gap-2 text-xs">
                        <span className="text-brand-muted line-through">{formatINR(game.worth)}</span>
                        <span className="font-bold text-brand-accent">FREE</span>
                        <span className="text-[10px] text-brand-muted">• Keep Forever</span>
                      </div>
                    ) : (
                      <p className="mb-4 text-xs leading-relaxed text-brand-muted line-clamp-2">
                        {game.short_description || game.description}
                      </p>
                    )}

                    {isGiveaway && (
                      <p className="mb-4 text-xs leading-relaxed text-brand-muted line-clamp-2">
                        {game.description || game.instructions}
                      </p>
                    )}

                    {/* Action Button */}
                    <div className="mt-auto pt-2">
                      <a
                        href={claimUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn relative flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-center text-xs font-semibold text-white transition-all duration-150 active:scale-95 cursor-pointer bg-brand-primary hover:bg-[#0274B3] shadow-md"
                      >
                        <span>{isGiveaway ? 'Claim Giveaway' : 'Play Free Game'}</span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-80 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                      </a>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}

        {/* Discord Setup Modal */}
        <DiscordWebhookModal
          isOpen={isDiscordModalOpen}
          onClose={() => setIsDiscordModalOpen(false)}
          onWebhookUpdated={(url) => setDiscordConfigured(Boolean(url))}
        />

        {/* Floating Toast Notification */}
        <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
      </div>
    </PageTransition>
  )
}
