import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Tv,
  Users,
  Loader2,
  Play,
  ExternalLink,
  Radio,
  Flame,
  Search,
  CheckCircle2,
  Send,
  MonitorPlay,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Building2,
  Clock,
  Award,
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { PixelPatternBg } from '../components/BrandDecorations'
import { getTopStreams } from '../utils/api'
import DiscordWebhookModal from '../components/DiscordWebhookModal'
import ToastNotification from '../components/ToastNotification'
import { postToDiscord, isWebhookConfigured } from '../utils/discordWebhook'

const FALLBACK_HERO_IMAGE = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1817070/library_hero.jpg'
const FALLBACK_AVATAR_IMAGE = 'https://unavatar.io/twitch/playstation'

export default function Streams() {
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [embedMode, setEmbedMode] = useState(false)
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (type, title, message) => {
    setToast({ type, title, message })
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const data = await getTopStreams()
      setStreams(data)
      setSelectedIndex(0)
      setLoading(false)
    }
    fetchData()
  }, [])

  const selectedStream = streams[selectedIndex] || null

  const getThumbnail = (url, width = 1280, height = 720) => {
    if (!url) return FALLBACK_HERO_IMAGE
    return url.replace('{width}', width).replace('{height}', height)
  }

  // 24/7 streams list
  const streams247 = useMemo(() => {
    return streams.filter((s) => s.is24_7)
  }, [streams])

  // Official Studio streams list
  const officialStreams = useMemo(() => {
    return streams.filter((s) => s.isOfficial)
  }, [streams])

  // Filtered streams
  const filteredStreams = useMemo(() => {
    return streams.filter((stream) => {
      let matchesCat = true
      if (selectedCategory === '24-7') {
        matchesCat = Boolean(stream.is24_7)
      } else if (selectedCategory === 'official') {
        matchesCat = Boolean(stream.isOfficial)
      } else if (selectedCategory !== 'all') {
        matchesCat =
          (stream.category && stream.category.toLowerCase() === selectedCategory.toLowerCase()) ||
          (stream.game_name && stream.game_name.toLowerCase() === selectedCategory.toLowerCase())
      }

      const matchesSearch =
        !searchQuery ||
        stream.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stream.game_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (stream.studio && stream.studio.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCat && matchesSearch
    })
  }, [streams, selectedCategory, searchQuery])

  // Total live viewers
  const totalViewers = useMemo(() => {
    return streams.reduce((acc, curr) => acc + (curr.viewer_count || 0), 0)
  }, [streams])

  const handlePrevStream = () => {
    setEmbedMode(false)
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : streams.length - 1))
  }

  const handleNextStream = () => {
    setEmbedMode(false)
    setSelectedIndex((prev) => (prev < streams.length - 1 ? prev + 1 : 0))
  }

  const handleShareToDiscord = async (stream) => {
    if (!isWebhookConfigured()) {
      setIsDiscordModalOpen(true)
      return
    }

    try {
      const payload = {
        content: `🔴 **LIVE NOW** • **${stream.user_name}** is streaming **${stream.game_name}** to **${new Intl.NumberFormat('en-IN').format(stream.viewer_count)}** viewers!`,
        embeds: [
          {
            title: `📺 Watch ${stream.user_name} on Twitch`,
            url: `https://twitch.tv/${stream.user_login}`,
            description: stream.title,
            color: 0x9146ff, // Twitch Purple
            fields: [
              { name: '🎮 Game / Studio', value: stream.studio || stream.game_name || 'Just Chatting', inline: true },
              { name: '👥 Live Viewers', value: new Intl.NumberFormat('en-IN').format(stream.viewer_count), inline: true },
            ],
            image: { url: getThumbnail(stream.thumbnail_url, 1280, 720) },
            footer: { text: stream.isOfficial ? 'Pixellon Official Studio Radar' : 'Pixellon Live Stream Radar' },
            timestamp: new Date().toISOString(),
          },
        ],
      }

      await postToDiscord(payload)
      showToast('success', 'Stream Shared!', `"${stream.user_name}" posted to Discord.`)
    } catch (err) {
      showToast('error', 'Broadcast Failed', err.message || 'Could not send stream to Discord.')
    }
  }

  const getGameBadgeColor = (gameName = '', isOfficial = false) => {
    if (isOfficial) return 'bg-amber-400/20 text-amber-300 border-amber-400/40'
    const name = gameName.toLowerCase()
    if (name.includes('gta') || name.includes('theft')) return 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    if (name.includes('counter') || name.includes('cs2')) return 'bg-sky-500/20 text-sky-300 border-sky-500/40'
    if (name.includes('fortnite')) return 'bg-purple-500/20 text-purple-300 border-purple-500/40'
    if (name.includes('rainbow') || name.includes('siege')) return 'bg-orange-500/20 text-orange-300 border-orange-500/40'
    if (name.includes('call of duty') || name.includes('warzone')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    if (name.includes('minecraft')) return 'bg-lime-500/20 text-lime-300 border-lime-500/40'
    if (name.includes('valorant')) return 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    if (name.includes('elden')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
    if (name.includes('league') || name.includes('lol')) return 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    if (name.includes('apex')) return 'bg-red-500/20 text-red-300 border-red-500/40'
    if (name.includes('rocket')) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    if (name.includes('dota')) return 'bg-red-600/20 text-red-300 border-red-600/40'
    if (name.includes('street fighter')) return 'bg-amber-400/20 text-amber-300 border-amber-400/40'
    if (name.includes('deadlock')) return 'bg-violet-500/20 text-violet-300 border-violet-500/40'
    if (name.includes('marvel')) return 'bg-blue-600/20 text-blue-300 border-blue-600/40'
    return 'bg-brand-primary/20 text-brand-accent border-brand-primary/40'
  }

  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1600px] 2xl:max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-10 space-y-8">
        {/* Header with Multi-Game Live Stats */}
        <header className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface p-6 sm:p-8">
          <PixelPatternBg />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="mb-2.5 inline-flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-500/30 px-3 py-1 text-xs font-mono font-bold text-red-400 tracking-wide">
                <span className="h-1.5 w-1.5 rounded-[2px] bg-red-500" />
                <span>OFFICIAL GAME STUDIOS • 24/7 NON-STOP THEATER</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
                Live Streams & Studio Broadcasts
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-brand-muted">
                Official game developer showcases, 24/7 non-stop tournament marathons, and top gaming community creators.
              </p>
            </div>

            {/* Quick Live Stats Badge */}
            <div className="flex items-center gap-3 self-start md:self-auto rounded-xl border border-surface-700 bg-surface-900/90 px-4 py-2.5 backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-muted">Active Feeds</span>
                <span className="text-base font-bold font-mono text-brand-text flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-red-500" />
                  {streams.length} Live Channels
                </span>
              </div>
              <div className="h-8 w-px bg-surface-700" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-muted">Spectators</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {new Intl.NumberFormat('en-IN').format(totalViewers)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            <p className="text-sm font-mono text-brand-muted">Tuning in to studio broadcasts and 24/7 streams...</p>
          </div>
        ) : streams.length === 0 ? (
          <div className="flex min-h-[35vh] flex-col items-center justify-center rounded-2xl border border-dashed border-surface-700 bg-brand-surface p-8 text-center">
            <Tv className="mb-4 h-12 w-12 text-brand-muted" />
            <h2 className="mb-2 font-display text-xl font-bold text-brand-text">No Streams Found</h2>
            <p className="max-w-md text-sm text-brand-muted">
              Channels will populate once community broadcasts begin.
            </p>
          </div>
        ) : (
          <>
            {/* Interactive Stream Theater Hero with Carousel Controls */}
            {selectedStream && (
              <section className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Player / Video Stage (8 cols) */}
                  <div className="lg:col-span-8 relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                    {embedMode ? (
                      <iframe
                        src={`https://player.twitch.tv/?channel=${selectedStream.user_login}&parent=${hostname}&muted=false`}
                        title={selectedStream.title}
                        className="w-full h-full border-0"
                        allowFullScreen
                      />
                    ) : (
                      <div className="relative w-full h-full group">
                        <img
                          src={getThumbnail(selectedStream.thumbnail_url, 1920, 1080)}
                          alt={selectedStream.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = FALLBACK_HERO_IMAGE
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                        {/* Carousel Arrows on Stage */}
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <button
                            onClick={handlePrevStream}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md border border-white/10 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                            title="Previous Stream"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <button
                            onClick={handleNextStream}
                            className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md border border-white/10 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                            title="Next Stream"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Top Overlay Indicators */}
                        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                          <span className="badge-live shadow-lg">
                            <span className="badge-live-dot" />
                            LIVE THEATER
                          </span>

                          {selectedStream.is24_7 && (
                            <span className="flex items-center gap-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 text-xs font-mono font-bold backdrop-blur-md shadow-md">
                              <Zap className="h-3 w-3 fill-amber-400" />
                              24/7 NON-STOP
                            </span>
                          )}

                          {selectedStream.isOfficial && (
                            <span className="flex items-center gap-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2.5 py-1 text-xs font-mono font-bold backdrop-blur-md shadow-md">
                              <Building2 className="h-3 w-3" />
                              OFFICIAL STUDIO
                            </span>
                          )}

                          <span
                            className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold border backdrop-blur-md ${getGameBadgeColor(
                              selectedStream.game_name,
                              selectedStream.isOfficial
                            )}`}
                          >
                            {selectedStream.game_name}
                          </span>
                        </div>

                        {/* Big Center Play Action */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <button
                            onClick={() => setEmbedMode(true)}
                            className="group/btn flex items-center gap-3 rounded-lg bg-brand-primary px-6 py-3.5 text-base font-bold text-white shadow-lg backdrop-blur-md transition-all hover:bg-brand-primary/90 active:scale-95 cursor-pointer"
                          >
                            <Play className="h-6 w-6 fill-white ml-0.5" />
                            <span>Play Live Stream in Theater</span>
                          </button>
                          <span className="text-xs font-mono text-zinc-400 bg-black/60 px-3 py-1 rounded-lg backdrop-blur-sm">
                            Powered by Official Twitch Player
                          </span>
                        </div>

                        {/* Bottom Left Streamer Tag */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg overflow-hidden border-2 border-brand-primary shadow-lg bg-zinc-800 shrink-0">
                              <img
                                src={selectedStream.avatar_url || getThumbnail(selectedStream.thumbnail_url, 100, 100)}
                                alt={selectedStream.user_name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.onerror = null
                                  e.currentTarget.src = FALLBACK_AVATAR_IMAGE
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-display text-lg font-bold text-white flex items-center gap-1.5 truncate">
                                {selectedStream.user_name}
                                {selectedStream.verified && (
                                  <CheckCircle2 className="h-4 w-4 text-brand-accent fill-brand-accent/20 shrink-0" />
                                )}
                              </h3>
                              <p className="text-xs font-mono text-zinc-300 flex items-center gap-2">
                                <Users className="h-3.5 w-3.5 text-emerald-400" />
                                {new Intl.NumberFormat('en-IN').format(selectedStream.viewer_count)} Watching Now
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setEmbedMode(true)}
                            className="group/btn flex items-center gap-2.5 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-md backdrop-blur-md transition-all hover:bg-brand-primary/90 active:scale-95 cursor-pointer"
                          >
                            <Play className="h-4 w-4 fill-white text-white" />
                            <span>Tune In</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar Info & Controls (4 cols) */}
                  <div className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-surface-700 bg-surface-900">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-accent flex items-center gap-1.5">
                          <Radio className="h-3.5 w-3.5 text-red-500" />
                          Now Playing In Theater
                        </span>
                        {embedMode && (
                          <button
                            onClick={() => setEmbedMode(false)}
                            className="text-xs font-mono text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
                          >
                            Close Player
                          </button>
                        )}
                      </div>

                      <h2 className="font-display text-lg font-bold text-brand-text leading-snug">
                        {selectedStream.title}
                      </h2>

                      {/* Studio / Game Details Info Box */}
                      <div className="rounded-xl border border-surface-700 bg-brand-surface p-3.5 space-y-2 text-xs font-mono">
                        {selectedStream.studio && (
                          <div className="flex items-center justify-between text-brand-muted">
                            <span>Official Studio:</span>
                            <span className="text-amber-400 font-bold">{selectedStream.studio}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-brand-muted">
                          <span>Game Title:</span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded border text-[11px] ${getGameBadgeColor(
                              selectedStream.game_name,
                              selectedStream.isOfficial
                            )}`}
                          >
                            {selectedStream.game_name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-brand-muted">
                          <span>Channel:</span>
                          <span className="text-brand-accent font-bold">@{selectedStream.user_login}</span>
                        </div>
                        <div className="flex items-center justify-between text-brand-muted">
                          <span>Live Viewers:</span>
                          <span className="text-emerald-400 font-bold">
                            {new Intl.NumberFormat('en-IN').format(selectedStream.viewer_count)}
                          </span>
                        </div>
                      </div>

                      {/* Stream Tags */}
                      {selectedStream.tags && selectedStream.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {selectedStream.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-brand-surface px-2 py-0.5 text-[11px] font-mono text-brand-muted border border-surface-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quick Switch Top Channel Pills */}
                      <div className="pt-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-brand-muted block mb-2">
                          Quick Switch Channel:
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 scrollbar-thin">
                          {streams.slice(0, 12).map((s, idx) => (
                            <button
                              key={s.id}
                              onClick={() => {
                                setEmbedMode(false)
                                setSelectedIndex(idx)
                              }}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-medium transition-all cursor-pointer border ${
                                selectedIndex === idx
                                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                  : 'bg-brand-surface text-brand-muted border-surface-700 hover:border-brand-primary/50'
                              }`}
                            >
                              {s.isOfficial ? `🏢 ${s.user_name}` : s.is24_7 ? `⚡ ${s.user_name.split(' ')[0]}` : s.game_name.split(':')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2.5 pt-4 border-t border-surface-700 mt-4">
                      <a
                        href={`https://twitch.tv/${selectedStream.user_login}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#9146FF] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#772CE8] shadow-[0_0_15px_rgba(145,70,255,0.3)] cursor-pointer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Watch on Twitch.tv</span>
                      </a>

                      <button
                        onClick={() => handleShareToDiscord(selectedStream)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#5865F2]/40 bg-[#5865F2]/15 px-4 py-2.5 text-sm font-bold text-[#7983F5] transition-all hover:bg-[#5865F2]/30 cursor-pointer"
                      >
                        <Send className="h-4 w-4" />
                        <span>Share Stream to Discord</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ⚡ 24/7 NON-STOP STREAMS SPOTLIGHT RAIL */}
            {streams247.length > 0 && (
              <section className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
                      <Zap className="h-3.5 w-3.5 fill-amber-400" />
                    </span>
                    <h2 className="font-display text-lg sm:text-xl font-bold text-brand-text">
                      24/7 Non-Stop Broadcasts
                    </h2>
                    <span className="text-xs font-mono text-brand-muted bg-surface-900 border border-surface-700 px-2 py-0.5 rounded-lg">
                      Always Playing
                    </span>
                  </div>
                  <span className="text-xs font-mono text-brand-muted hidden sm:inline">
                    Continuous tournament archives, speedruns & chill beats
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {streams247.map((s) => {
                    const streamIdx = streams.findIndex((item) => item.id === s.id)
                    const isPlaying = selectedIndex === streamIdx

                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedIndex(streamIdx)
                          setEmbedMode(true)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className={`group text-left relative overflow-hidden rounded-lg border p-2.5 transition-all cursor-pointer ${
                          isPlaying
                            ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/50'
                            : 'border-surface-700 bg-brand-surface hover:border-amber-500/50 hover:bg-surface-700'
                        }`}
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-black">
                          <img
                            src={getThumbnail(s.thumbnail_url, 400, 225)}
                            alt={s.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = FALLBACK_HERO_IMAGE
                            }}
                          />
                          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 rounded bg-amber-500 px-1.5 py-0.2 text-[9px] font-mono font-bold text-black shadow">
                            <Zap className="h-2.5 w-2.5 fill-black" />
                            24/7
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity">
                            <Play className="h-5 w-5 fill-white text-white" />
                          </div>
                        </div>
                        <h4 className="text-xs font-display font-bold text-brand-text truncate group-hover:text-amber-300 transition-colors">
                          {s.user_name}
                        </h4>
                        <p className="text-[10px] font-mono text-brand-muted truncate">
                          {s.game_name}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
              {/* Category Pills with Dedicated 24/7 and Official Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === 'all'
                      ? 'bg-brand-primary text-white shadow-[0_0_16px_rgba(37,99,235,0.4)]'
                      : 'border border-surface-700 bg-brand-surface text-brand-muted hover:border-brand-primary/50 hover:text-brand-text'
                  }`}
                >
                  <span>All Channels</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-lg bg-white/20 text-white">
                    {streams.length}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedCategory('24-7')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === '24-7'
                      ? 'bg-amber-500 text-black shadow-[0_0_16px_rgba(245,158,11,0.4)]'
                      : 'border border-amber-500/30 bg-brand-surface text-amber-300 hover:border-amber-500 hover:text-white'
                  }`}
                >
                  <Zap className="h-3 w-3 fill-current" />
                  <span>24/7 Non-Stop</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-lg bg-black/30 text-amber-200">
                    {streams247.length}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedCategory('official')}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === 'official'
                      ? 'bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.4)]'
                      : 'border border-blue-500/30 bg-brand-surface text-blue-300 hover:border-blue-500 hover:text-white'
                  }`}
                >
                  <Building2 className="h-3 w-3" />
                  <span>Official Studios</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-lg bg-blue-950/60 text-blue-200">
                    {officialStreams.length}
                  </span>
                </button>

                {/* Other categories */}
                {['PlayStation', 'Xbox', 'Nintendo', 'Grand Theft Auto V', 'Counter-Strike 2', 'Fortnite', 'Call of Duty', 'Minecraft', 'VALORANT'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-brand-primary text-white shadow-[0_0_16px_rgba(37,99,235,0.4)]'
                          : 'border border-surface-700 bg-brand-surface text-brand-muted hover:border-brand-primary/50 hover:text-brand-text'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
                <input
                  type="text"
                  placeholder="Search studio, GTA, CS2, 24/7..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2 pl-9 pr-4 text-xs font-mono text-brand-text placeholder:text-brand-muted outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            </div>

            {/* Streams Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredStreams.map((stream, i) => {
                const streamIndex = streams.findIndex((s) => s.id === stream.id)
                const isCurrent = selectedIndex === streamIndex

                return (
                  <motion.article
                    key={stream.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className={`group relative flex flex-col overflow-hidden rounded-lg border transition-all ${
                      isCurrent
                        ? 'border-brand-primary bg-brand-surface shadow-[0_0_24px_rgba(37,99,235,0.3)] ring-1 ring-brand-primary'
                        : 'border-surface-700 bg-brand-surface hover:border-brand-primary/80 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:-translate-y-1'
                    }`}
                  >
                    {/* Thumbnail Stage */}
                    <div className="relative aspect-video overflow-hidden bg-black">
                      <img
                        src={getThumbnail(stream.thumbnail_url, 800, 450)}
                        alt={stream.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null
                          e.currentTarget.src = FALLBACK_HERO_IMAGE
                        }}
                      />

                      {/* LIVE / 24/7 Badge */}
                      <div className="absolute left-3 top-3 flex items-center gap-1.5">
                        {stream.is24_7 ? (
                          <div className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-0.5 text-[10px] font-mono font-bold text-black shadow-md">
                            <Zap className="h-3 w-3 fill-black" />
                            24/7 NON-STOP
                          </div>
                        ) : (
                          <div className="badge-live text-[10px] py-0.5 px-2 shadow-md">
                            <span className="badge-live-dot" />
                            LIVE
                          </div>
                        )}

                        {stream.isOfficial && (
                          <div className="flex items-center gap-1 rounded-lg bg-blue-600 px-2 py-0.5 text-[10px] font-mono font-bold text-white shadow-md">
                            <Building2 className="h-2.5 w-2.5" />
                            OFFICIAL
                          </div>
                        )}
                      </div>

                      {/* Viewers Counter */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-black/75 backdrop-blur-md px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-400 border border-white/10">
                        <Users className="h-3 w-3" />
                        {new Intl.NumberFormat('en-IN').format(stream.viewer_count)}
                      </div>

                      {/* Hover Overlay with Quick Actions */}
                      <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setSelectedIndex(streamIndex)
                            setEmbedMode(true)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className="flex items-center gap-2 rounded-lg bg-brand-primary px-3.5 py-2 text-xs font-bold text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
                        >
                          <MonitorPlay className="h-4 w-4" />
                          <span>Watch in Theater</span>
                        </button>
                        <a
                          href={`https://twitch.tv/${stream.user_login}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center rounded-lg bg-[#9146FF] p-2 text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
                          title="Open on Twitch"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      {/* Streamer Avatar & Name */}
                      <div className="mb-2 flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg overflow-hidden border border-surface-700 bg-surface-900 shrink-0">
                          <img
                            src={stream.avatar_url || getThumbnail(stream.thumbnail_url, 60, 60)}
                            alt={stream.user_name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = FALLBACK_AVATAR_IMAGE
                            }}
                          />
                        </div>
                        <div className="flex flex-1 items-center justify-between min-w-0">
                          <span className="truncate text-xs font-mono font-bold text-brand-accent flex items-center gap-1">
                            {stream.user_name}
                            {stream.verified && (
                              <CheckCircle2 className="h-3 w-3 text-brand-accent fill-brand-accent/20 shrink-0" />
                            )}
                          </span>
                          <span
                            className={`truncate rounded-lg px-2 py-0.5 text-[10px] font-mono border font-semibold ${getGameBadgeColor(
                              stream.game_name,
                              stream.isOfficial
                            )}`}
                          >
                            {stream.studio || stream.game_name}
                          </span>
                        </div>
                      </div>

                      {/* Stream Title */}
                      <h3
                        className="line-clamp-2 text-sm font-display font-medium text-brand-text group-hover:text-brand-accent transition-colors"
                        title={stream.title}
                      >
                        {stream.title}
                      </h3>

                      {/* Bottom Footer Action */}
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-surface-700 text-xs font-mono">
                        <button
                          onClick={() => {
                            setSelectedIndex(streamIndex)
                            setEmbedMode(false)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className="text-xs font-mono font-bold text-brand-accent hover:text-brand-accent2 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          Select Channel →
                        </button>
                        <button
                          onClick={() => handleShareToDiscord(stream)}
                          className="text-brand-muted hover:text-[#5865F2] transition-colors p-1 cursor-pointer"
                          title="Share to Discord"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                )
              })}
            </div>

            {/* Community Streamer & Discord Callout Banner */}
            <section className="relative overflow-hidden rounded-lg border border-brand-primary/30 bg-brand-surface p-8 sm:p-10 shadow-lg">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-brand-primary/20 border border-brand-primary/40 px-3 py-1 text-xs font-mono font-semibold text-brand-accent tracking-wide">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>CREATOR & STUDIO SPOTLIGHT</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-brand-text">
                    Are You a Streamer, Indie Studio, or Tournament Host?
                  </h3>
                  <p className="text-sm text-brand-muted">
                    Feature your 24/7 broadcasts or studio showcases on Pixellon's Live Radar and broadcast drop announcements directly to our Discord community.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsDiscordModalOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-[#5865F2] px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#4752C4] cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>Connect Discord Webhook</span>
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Discord Webhook Modal */}
        <DiscordWebhookModal
          isOpen={isDiscordModalOpen}
          onClose={() => setIsDiscordModalOpen(false)}
        />

        {/* Floating Toast Notification */}
        <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
      </div>
    </PageTransition>
  )
}
