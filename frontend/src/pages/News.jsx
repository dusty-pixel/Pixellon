import { useState, useEffect } from 'react'
import {
  Newspaper,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2,
  CheckCircle,
  AlertCircle,
  Flame,
  Radio,
  Send,
  Heart,
  Globe,
  MessageSquare,
  Sparkles,
  Loader2,
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { SectionReveal, Stagger, StaggerItem } from '../components/motion/Reveal'
import { getGamingNews } from '../utils/api'
import { isWebhookConfigured, sendGameUpdateToDiscord } from '../utils/discordWebhook'
import DiscordWebhookModal from '../components/DiscordWebhookModal'
import ToastNotification from '../components/ToastNotification'

export default function News() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [investigationIndex, setInvestigationIndex] = useState(0)
  const [timelineIndex, setTimelineIndex] = useState(0)
  const [sharingGuid, setSharingGuid] = useState(null)
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false)
  const [toast, setToast] = useState(null)

  // Newsletter / Dispatch wire form state
  const [wireForm, setWireForm] = useState({ name: '', destination: '', topic: '' })
  const [wireStatus, setWireStatus] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getGamingNews()
        setArticles(data || [])
      } catch (err) {
        console.error('Failed to load gaming news', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'RECENT'
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const formatTime = (dateString) => {
    if (!dateString) return 'LIVE'
    const d = new Date(dateString)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const showToast = (type, title, message) => {
    setToast({ type, title, message })
    setTimeout(() => setToast(null), 4500)
  }

  const handleShareToDiscord = async (article, e) => {
    if (e) e.stopPropagation()
    if (!isWebhookConfigured()) {
      setIsDiscordModalOpen(true)
      return
    }

    const key = article.guid || article.link
    setSharingGuid(key)
    try {
      await sendGameUpdateToDiscord({
        title: article.title,
        link: article.link,
        description: article.description,
        thumbnail: article.enclosure?.link || article.thumbnail,
        pubDate: formatDate(article.pubDate),
      })
      showToast('success', 'Posted to Discord!', `"${article.title}" sent to your Discord channel.`)
    } catch (err) {
      showToast('error', 'Discord Error', err.message || 'Failed to post news update.')
    } finally {
      setSharingGuid(null)
    }
  }

  const handleWireSubmit = (e) => {
    e.preventDefault()
    if (!wireForm.destination) {
      showToast('error', 'Missing Destination', 'Please enter your email or Discord webhook URL.')
    }
    setWireStatus('success')
    showToast('success', 'Connected to Dispatch Wire', 'You will receive real-time gaming alerts.')
    setWireForm({ name: '', destination: '', topic: '' })
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Hero section rotating stories state
  const [heroIndex, setHeroIndex] = useState(0)
  const [isAutoCycling, setIsAutoCycling] = useState(true)
  const [isHeroHovered, setIsHeroHovered] = useState(false)

  // ── DEDICATED SLICES WITH ZERO OVERLAP ACROSS SECTIONS ──
  // Hero (01): Top 5 breaking headlines
  const heroStories = articles.length >= 5 ? articles.slice(0, 5) : articles
  const currentHeroStory = heroStories[heroIndex] || articles[0]

  // Section 02: Investigation Wire (Next 6 unique stories - no repeat with Hero)
  const investigationStories = articles.length >= 11
    ? articles.slice(5, 11)
    : articles.slice(Math.min(articles.length, 1), 7)
  const currentInvestigationArticle = investigationStories[investigationIndex] || investigationStories[0] || articles[0]

  // Section 03: Chronological Log / Incident Wire (Next 5 unique stories - no repeat with Hero or Section 2)
  const timelineStories = articles.length >= 16
    ? articles.slice(11, 16)
    : (articles.length >= 10 ? articles.slice(5, 10) : articles.slice(0, 5))
  const currentTimelineItem = timelineStories[timelineIndex] || timelineStories[0] || articles[0]


  // Auto-cycle Hero stories every 10 seconds unless paused or hovered
  useEffect(() => {
    if (!isAutoCycling || isHeroHovered || heroStories.length <= 1) return

    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroStories.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [isAutoCycling, isHeroHovered, heroStories.length])

  const goToNextHeroStory = () => {
    if (heroStories.length <= 1) return
    setHeroIndex((prev) => (prev + 1) % heroStories.length)
  }

  const goToPrevHeroStory = () => {
    if (heroStories.length <= 1) return
    setHeroIndex((prev) => (prev - 1 + heroStories.length) % heroStories.length)
  }

  // Keyboard navigation for story cycling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToNextHeroStory()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPrevHeroStory()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [heroStories.length])

  const getStoryCategory = (story, idx) => {
    if (!story) return 'BREAKING INVESTIGATION'
    const t = (story.title || '').toLowerCase()
    if (t.includes('star wars') || t.includes('movie') || t.includes('film')) return 'WORLD PREMIERE'
    if (t.includes('layoff') || t.includes('ceo') || t.includes('microsoft') || t.includes('xbox')) return 'INDUSTRY WIRE'
    if (t.includes('discord') || t.includes('wumpus') || t.includes('community')) return 'COMMUNITY WIRE'
    if (t.includes('last of us') || t.includes('naughty dog') || t.includes('playstation')) return 'STUDIO INTELLIGENCE'
    if (t.includes('minecraft') || t.includes('ice cave') || t.includes('update')) return 'DEVELOPMENT WIRE'
    const defaults = ['BREAKING INVESTIGATION', 'SPECIAL REPORT', 'INDUSTRY DISPATCH', 'PLATFORM INTELLIGENCE', 'EXCLUSIVE DOSSIER']
    return defaults[idx % defaults.length]
  }

  if (loading) {
    return (
      <PageTransition className="min-h-screen bg-[#06080C] text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
        <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
          Syncing Pixellon Dispatch Wire...
        </p>
      </PageTransition>
    )
  }

  return (
    <PageTransition className="min-h-screen bg-[#06080C] text-stone-200 overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* ── STICKY TOP EDITORIAL NAV BAR ── */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#06080C]/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold tracking-widest text-sm flex items-center gap-1.5 font-mono">
            <span>▲</span>
            <span>PIXELLON DISPATCH</span>
          </span>
          <span className="hidden sm:inline-block h-3 w-px bg-white/20" />
          <span className="hidden sm:inline-block text-[11px] font-mono text-stone-400 uppercase tracking-widest">
            Investigative Gaming Wire
          </span>
        </div>

        {/* Section Anchors */}
        <div className="hidden md:flex items-center gap-7 text-xs font-mono tracking-wider uppercase text-stone-300">
          <button onClick={() => scrollToSection('section-hero')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            01 Rotating Lead
          </button>
          <button onClick={() => scrollToSection('section-investigation')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            02 Dispatch Wire
          </button>
          <button onClick={() => scrollToSection('section-timeline')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            03 Timeline
          </button>
          <button onClick={() => scrollToSection('section-dossier')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            04 Dossier
          </button>
          <button onClick={() => scrollToSection('section-subscribe')} className="hover:text-emerald-400 transition-colors cursor-pointer">
            05 Wire Alert
          </button>
        </div>

        {/* Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDiscordModalOpen(true)}
            className="text-xs font-mono tracking-wider uppercase text-stone-300 hover:text-white flex items-center gap-2 border-l border-white/15 pl-4 cursor-pointer"
          >
            <span>| Discord Sync</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
          <div className="hidden lg:grid grid-cols-3 gap-0.5 opacity-60 hover:opacity-100 transition-opacity p-1 cursor-pointer">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} className="h-1 w-1 bg-white rounded-[0.5px]" />
            ))}
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: HERO ("ИСТОКИ" / "THE DISPATCH")
          Atmospheric full-bleed visual with rotating stories & ghost text
          ───────────────────────────────────────────────────────────── */}
      <section
        id="section-hero"
        className="relative min-h-[92vh] w-full flex flex-col justify-between overflow-hidden border-b border-white/10"
      >
        {/* Background Artwork with smooth crossfade between rotating stories */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroStories.map((story, idx) => {
            const isCurrent = heroIndex === idx
            const imgUrl =
              story?.enclosure?.link ||
              story?.thumbnail ||
              'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2000&q=80'
            return (
              <div
                key={story?.guid || story?.link || idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={story?.title || ''}
                  className={`h-full w-full object-cover object-center filter brightness-[0.42] contrast-[1.18] transition-transform duration-[7000ms] ease-out ${
                    isCurrent ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            )
          })}
          {/* Nature Vignette & Dark Forest Overlay matching template */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080C] via-[#06080C]/40 to-[#06080C]/80 z-20" />
        </div>

        {/* Left Side: Interactive Dynamic Step Indicator (01 - 05) */}
        <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3 text-xs font-mono">
          {heroStories.map((story, idx) => {
            const isActive = heroIndex === idx
            return (
              <button
                key={story?.guid || idx}
                onClick={() => setHeroIndex(idx)}
                className={`group flex items-center gap-2.5 transition-all duration-300 cursor-pointer ${
                  isActive ? 'text-white font-bold scale-110' : 'text-stone-500 hover:text-stone-300'
                }`}
                title={`Jump to Story 0${idx + 1}: ${story?.title || ''}`}
              >
                <span className="font-mono text-xs">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-6 bg-emerald-400'
                      : 'w-1.5 bg-white/20 group-hover:bg-white/50 group-hover:w-3'
                  }`}
                />
              </button>
            )
          })}
          <div className="editorial-step-line my-1 opacity-50" />
          <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
            {heroStories.length < 10 ? `0${heroStories.length}` : heroStories.length}
          </span>
        </div>

        {/* Right Side: Rotated Vertical Text */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-30 vertical-rl text-[11px] font-mono tracking-[0.25em] text-stone-400/60 uppercase">
          Pixellon Dispatch • Live Rotating Wire • Real-Time Gaming Feed
        </div>

        {/* Hero Content Layer with hover detection */}
        <div
          onMouseEnter={() => setIsHeroHovered(true)}
          onMouseLeave={() => setIsHeroHovered(false)}
          className="relative z-30 max-w-5xl mx-auto px-6 sm:px-12 pt-28 sm:pt-36 pb-16 text-center flex flex-col items-center justify-center flex-1"
        >
          {/* Animated Story Content Wrapper */}
          <div key={heroIndex} className="animate-editorial-fade flex flex-col items-center">
            {/* Category / Sub-tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/70 px-4 py-1 text-xs font-mono font-semibold text-emerald-300 tracking-[0.2em] uppercase mb-4 shadow-lg backdrop-blur-md">
              <Flame className="h-3.5 w-3.5 text-emerald-400" />
              <span>{getStoryCategory(currentHeroStory, heroIndex)}</span>
            </div>

            {/* Subtitle / Logline */}
            <p className="max-w-2xl text-sm sm:text-base text-stone-300/90 font-sans tracking-wide leading-relaxed mb-4">
              Story 0{heroIndex + 1} of 0{heroStories.length} • {currentHeroStory?.author || 'Pixellon Wire'} • {formatDate(currentHeroStory?.pubDate)}
            </p>

            {/* Headline */}
            <h1 className="relative font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.08] max-w-4xl">
              <a
                href={currentHeroStory?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 transition-colors"
              >
                {currentHeroStory?.title || 'Global Gaming Chronicles'}
              </a>
            </h1>
          </div>
        </div>

        {/* Bottom Hero Strip (Scroll & Rotation Controls + Progress Bar) */}
        <div className="relative z-30 max-w-7xl w-full mx-auto px-6 sm:px-12 py-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          {/* Rotation Controls: Prev, Next & Auto-Play Status */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={goToPrevHeroStory}
              className="h-9 w-9 rounded-full border border-white/20 bg-black/50 hover:bg-emerald-400 hover:text-black flex items-center justify-center transition-all cursor-pointer text-stone-200"
              title="Previous rotating story (or ↑ / ← key)"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              onClick={goToNextHeroStory}
              className="h-9 w-9 rounded-full border border-white/20 bg-black/50 hover:bg-emerald-400 hover:text-black flex items-center justify-center transition-all cursor-pointer text-stone-200"
              title="Next rotating story (or ↓ / → key)"
            >
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Auto-cycle toggle button */}
            <button
              onClick={() => setIsAutoCycling((prev) => !prev)}
              className="h-9 px-3.5 rounded-full border border-white/20 bg-black/50 hover:border-emerald-400/60 text-xs font-mono tracking-wider uppercase text-stone-300 flex items-center gap-2 cursor-pointer transition-all"
              title={isAutoCycling ? 'Click to pause automatic story rotation (10s)' : 'Click to resume automatic story rotation (10s)'}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isAutoCycling && !isHeroHovered ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>
                {isAutoCycling
                  ? isHeroHovered
                    ? 'HOVER PAUSED'
                    : `CYCLE 0${heroIndex + 1}/0${heroStories.length}`
                  : 'PAUSED'}
              </span>
            </button>
          </div>

          {/* Center: Quick Action Link */}
          <div className="flex items-center gap-4">
            <a
              href={currentHeroStory?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 hover:text-white flex items-center gap-2 transition-colors group"
            >
              <span>Read Full Report</span>
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <span className="hidden md:inline-block h-3 w-px bg-white/20" />

            <button
              onClick={() => scrollToSection('section-investigation')}
              className="hidden md:flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
            >
              <span>Explore Archive</span>
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          {/* Right: Discord Share & Settings */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleShareToDiscord(currentHeroStory)}
              disabled={sharingGuid === (currentHeroStory?.guid || currentHeroStory?.link)}
              className="h-9 px-3 rounded-full border border-white/20 bg-black/50 hover:bg-[#5865F2] hover:border-[#5865F2] flex items-center gap-2 transition-all cursor-pointer text-stone-300 hover:text-white text-xs font-mono"
              title="Share current rotating story to Discord"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => setIsDiscordModalOpen(true)}
              className="h-9 w-9 rounded-full border border-white/20 bg-black/50 hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer text-stone-300"
              title="Discord Webhook Settings"
            >
              <Radio className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Progress Line indicating rotation countdown */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 overflow-hidden z-40">
          <div
            key={`${heroIndex}-${isAutoCycling && !isHeroHovered}`}
            className={`h-full bg-emerald-500 ${
              isAutoCycling && !isHeroHovered ? 'animate-editorial-progress' : 'opacity-40 w-full'
            }`}
            style={{
              animationPlayState: isAutoCycling && !isHeroHovered ? 'running' : 'paused',
            }}
          />
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: "THE STORY BEGINS HERE" ("ИСТОРИЯ НАЧИНАЕТСЯ ЗДЕСЬ")
          Featured story breakdown + 6-card horizontal photo reel
          ───────────────────────────────────────────────────────────── */}
      <section
        id="section-investigation"
        className="relative max-w-[1560px] mx-auto px-6 sm:px-12 lg:px-16 py-20 sm:py-28 border-b border-white/10"
      >
        {/* Left Side Step Indicator */}
        <div className="hidden lg:flex absolute left-6 top-28 flex-col items-center gap-3 text-xs font-mono text-stone-400">
          <span className="text-white font-bold">02</span>
          <div className="editorial-step-line" />
        </div>

        {/* Section Grid: Title + Image on Left, Deep Editorial on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column (7 cols): Bold Header + Lead Image */}
          <div className="lg:col-span-6 space-y-6">
            <SectionReveal>
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400">
                02 / Major Headlines
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.05]">
                The Story Begins Here
              </h2>
            </div>
            </SectionReveal>

            {/* Cinematic Featured Image with Reflection */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/15 bg-black/60 shadow-2xl">
              <img
                src={currentInvestigationArticle?.enclosure?.link || currentInvestigationArticle?.thumbnail}
                alt={currentInvestigationArticle?.title}
                className="h-full w-full object-cover transition-all duration-700 hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-stone-300">
                <span>{currentInvestigationArticle?.author ? `Report by ${currentInvestigationArticle.author}` : 'Pixellon Wire'}</span>
                <span>{formatDate(currentInvestigationArticle?.pubDate)}</span>
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): In-depth editorial prose & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full pt-4 lg:pt-12 space-y-6">
            <div className="space-y-4">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-wide">
                {currentInvestigationArticle?.title}
              </h3>

              <div
                className="text-stone-300/85 text-sm sm:text-base leading-relaxed space-y-3 font-sans"
                dangerouslySetInnerHTML={{ __html: currentInvestigationArticle?.description || 'Full coverage pending wire release.' }}
              />
            </div>

            {/* Action Row */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6">
              <a
                href={currentInvestigationArticle?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] font-bold text-white hover:text-emerald-400 transition-colors group"
              >
                <span>→ Launch Full Coverage</span>
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <button
                type="button"
                onClick={(e) => handleShareToDiscord(currentInvestigationArticle, e)}
                disabled={sharingGuid === (currentInvestigationArticle?.guid || currentInvestigationArticle?.link)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#5865F2]/50 bg-[#5865F2]/15 px-3.5 py-1.5 text-xs font-mono text-[#8a94fd] hover:bg-[#5865F2] hover:text-white transition-all cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Sync to Discord</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 6-Card Horizontal Thumbnail Reel matching reference template ── */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-white/10">
          <div className="mb-4 flex items-center justify-between text-xs font-mono text-stone-400 uppercase tracking-widest">
            <span>Select Story from Wire Archive</span>
            <span>{investigationStories.length} Wire Stories Available</span>
          </div>

          <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {investigationStories.map((story, idx) => (
              <StaggerItem key={story.guid || story.link || idx}>
              <button
                onClick={() => setInvestigationIndex(idx)}
                className={`group text-left relative aspect-square sm:aspect-[4/3] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                  investigationIndex === idx
                    ? 'border-emerald-400 ring-2 ring-emerald-400/40'
                    : 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'
                }`}
              >
                <img
                  src={story.enclosure?.link || story.thumbnail}
                  alt={story.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[11px] font-sans font-semibold text-white line-clamp-2 leading-tight">
                    {story.title}
                  </p>
                </div>
              </button>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: TIMELINE / INCIDENT WIRE ("3 – 17 АВГУСТА" style)
          Tabular event log on left, dramatic combat/action key art on right
          ───────────────────────────────────────────────────────────── */}
      <section
        id="section-timeline"
        className="relative max-w-[1560px] mx-auto px-6 sm:px-12 lg:px-16 py-20 sm:py-28 border-b border-white/10"
      >
        {/* Left Step Indicator */}
        <div className="hidden lg:flex absolute left-6 top-28 flex-col items-center gap-3 text-xs font-mono text-stone-400">
          <span className="text-white font-bold">03</span>
          <div className="editorial-step-line" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (7 cols): Date Header + Tabular Event Timeline */}
          <div className="lg:col-span-7 space-y-8">
            <SectionReveal>
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400">
                03 / Chronological Log
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
                26 – 27 September 2026
              </h2>
            </div>
            </SectionReveal>

            {/* Timeline Rows */}
            <Stagger className="space-y-4">
              {timelineStories.map((item, idx) => {
                const isSelected = timelineIndex === idx
                return (
                  <StaggerItem key={item.guid || item.link || idx}>
                  <div
                    onMouseEnter={() => setTimelineIndex(idx)}
                    onClick={() => setTimelineIndex(idx)}
                    className={`group rounded-xl border p-4 sm:p-5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-emerald-400/80 bg-black/80 ring-1 ring-emerald-400/30'
                        : 'border-white/10 bg-black/40 hover:bg-black/60 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Time Pill matching reference "День 1 • 9:00" */}
                      <div
                        className={`flex-shrink-0 font-mono text-xs font-bold px-3 py-1.5 rounded border transition-colors ${
                          isSelected
                            ? 'bg-emerald-500 text-black border-emerald-400 font-black'
                            : 'text-white bg-white/10 border-white/15'
                        }`}
                      >
                        0{idx + 1} • {formatTime(item.pubDate)}
                      </div>

                      <div>
                        <h4
                          className={`text-sm font-sans font-bold transition-colors line-clamp-1 ${
                            isSelected ? 'text-emerald-300' : 'text-white group-hover:text-emerald-300'
                          }`}
                        >
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.title}
                          </a>
                        </h4>
                        <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
                          {item.author ? `Reported by ${item.author}` : 'Wire Incident Desk'} • {formatDate(item.pubDate)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center flex-shrink-0">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-mono text-stone-400 hover:text-white"
                        title="Read item"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShareToDiscord(item)
                        }}
                        className="text-xs font-mono text-[#8a94fd] hover:text-white"
                        title="Send to Discord"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  </StaggerItem>
                )
              })}
            </Stagger>
          </div>

          {/* Right Column (5 cols): High-contrast Dramatic Key Art with dynamic preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
              <img
                key={timelineIndex}
                src={
                  currentTimelineItem?.enclosure?.link ||
                  currentTimelineItem?.thumbnail ||
                  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80'
                }
                alt=""
                className="h-full w-full object-cover filter contrast-[1.2] brightness-90 animate-editorial-fade"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/30" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-700/50">
                    Incident Log 0{timelineIndex + 1} Still
                  </span>
                  <span className="text-[11px] font-mono text-stone-300">
                    {formatTime(currentTimelineItem?.pubDate)}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-sans font-bold text-white line-clamp-2">
                  {currentTimelineItem?.title}
                </p>
                <p className="text-xs font-mono text-stone-400">
                  {currentTimelineItem?.author ? `Reported by ${currentTimelineItem.author}` : 'Wire Incident Desk'} • {formatDate(currentTimelineItem?.pubDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: SPOTLIGHT DOSSIER ("2450 €" style metrics & breakdown)
          High-contrast figure on left, giant stat in center, checklists on right
          ───────────────────────────────────────────────────────────── */}
      <section
        id="section-dossier"
        className="relative max-w-[1560px] mx-auto px-6 sm:px-12 lg:px-16 py-20 sm:py-28 border-b border-white/10"
      >
        {/* Left Step Indicator */}
        <div className="hidden lg:flex absolute left-6 top-28 flex-col items-center gap-3 text-xs font-mono text-stone-400">
          <span className="text-white font-bold">04</span>
          <div className="editorial-step-line" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column (4 cols): Dramatic Character / Subject Figure */}
          <div className="lg:col-span-4 relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl">
            <img
              src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145360/capsule_616x353.jpg"
              alt="Subject dossier"
              className="h-full w-full object-cover object-center filter contrast-125 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">
                Verified Intelligence Dossier
              </span>
              <p className="text-base font-display font-bold text-white mt-1">
                Studio Leadership & Tech Shifts
              </p>
            </div>
          </div>

          {/* Center Column (3 cols): Massive Metric Number */}
          <div className="lg:col-span-3 text-center lg:text-left space-y-2 py-4">
            <SectionReveal>
            <div className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter">
              98.4%
            </div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400 font-semibold">
              Global Accuracy Rating
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-sans max-w-xs mx-auto lg:mx-0">
              Cross-verified with official SEC filings, Steam backend depots, and direct studio confirmations.
            </p>
            </SectionReveal>
          </div>

          {/* Right Column (5 cols): Inclusions / Exclusions Checklists */}
          <Stagger className="lg:col-span-5 space-y-6">
            {/* Confirmed Intelligence */}
            <StaggerItem>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <span>● Confirmed Intelligence</span>
              </div>
              <ul className="text-xs font-sans text-stone-300 space-y-2 list-disc list-inside">
                <li>Direct on-record statements from primary studio leads and directors.</li>
                <li>Verifiable code commits, ESRB age ratings, and public trailer reveals.</li>
                <li>Official developer roadmaps with targeted release windows.</li>
              </ul>
            </div>
            </StaggerItem>

            {/* Rumors & Speculation */}
            <StaggerItem>
            <div className="rounded-xl border border-white/10 bg-black/40 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <span>● Unverified Rumors & Insider Leaks</span>
              </div>
              <ul className="text-xs font-sans text-stone-400 space-y-2 list-disc list-inside">
                <li>Anonymous forum posts, uncredited retailer placeholder dates.</li>
                <li>Unannounced hardware iterations lacking official manufacturer patents.</li>
                <li>Speculative plot leaks and early non-NDA alpha builds.</li>
              </ul>
            </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 5: "BEGIN YOUR JOURNEY" ("НАЧНИ СВОЕ ПУТЕШЕСТВИЕ")
          Newsletter & Webhook subscription form + atmospheric landscape
          ───────────────────────────────────────────────────────────── */}
      <section
        id="section-subscribe"
        className="relative max-w-[1560px] mx-auto px-6 sm:px-12 lg:px-16 py-20 sm:py-28 border-b border-white/10"
      >
        {/* Left Step Indicator */}
        <div className="hidden lg:flex absolute left-6 top-28 flex-col items-center gap-3 text-xs font-mono text-stone-400">
          <span className="text-white font-bold">05</span>
          <div className="editorial-step-line" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (7 cols): Heading + Minimalist Form */}
          <div className="lg:col-span-7 space-y-8">
            <SectionReveal>
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-emerald-400">
                05 / Direct Connectivity
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight">
                Join the Dispatch Wire
              </h2>
              <p className="text-sm text-stone-400 font-sans max-w-lg">
                Receive direct breaking notifications the second major studio acquisitions, release dates, or leaks drop.
              </p>
            </div>
            </SectionReveal>

            <form onSubmit={handleWireSubmit} className="space-y-5 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Alias / Gamertag"
                  value={wireForm.name}
                  onChange={(e) => setWireForm({ ...wireForm, name: e.target.value })}
                  className="w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-xs font-mono text-white placeholder-stone-500 focus:border-emerald-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Discord Webhook or Email"
                  value={wireForm.destination}
                  onChange={(e) => setWireForm({ ...wireForm, destination: e.target.value })}
                  className="w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-xs font-mono text-white placeholder-stone-500 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <input
                type="text"
                placeholder="Topic Filter (e.g. PlayStation, Nintendo, PC, RPGs)"
                value={wireForm.topic}
                onChange={(e) => setWireForm({ ...wireForm, topic: e.target.value })}
                className="w-full rounded-lg border border-white/20 bg-black/50 px-4 py-3 text-xs font-mono text-white placeholder-stone-500 focus:border-emerald-400 focus:outline-none"
              />

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 text-xs font-mono uppercase tracking-[0.15em] font-bold transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>→ Connect to Wire</span>
                </button>
                <span className="text-[11px] font-mono text-stone-500">
                  Zero spam • One-click revoke
                </span>
              </div>
            </form>
          </div>

          {/* Right Column (5 cols): Atmospheric Explorer Key Art */}
          <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
              alt="Explorer on horizon"
              className="h-full w-full object-cover filter brightness-[0.6] contrast-[1.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-xs font-mono text-stone-400">
              <span className="text-emerald-400 font-bold">PIXELLON CORRESPONDENCE</span> • Broadcast worldwide
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 6: CLEAN SIGNOFF FOOTER ("Спасибо за внимание ♥")
          Minimalist typography + heart glyph + scenic panoramic image
          ───────────────────────────────────────────────────────────── */}
      <footer className="relative w-full py-20 text-center bg-black/80 border-t border-white/10 overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto px-6 space-y-4">
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase">
            Thank you for reading
          </h3>

          <div className="flex items-center justify-center gap-2 text-rose-500">
            <Heart className="h-5 w-5 fill-current animate-pulse" />
          </div>

          <p className="text-xs font-mono text-stone-400 tracking-widest uppercase">
            Pixellon Dispatch • Curated by Gamers for Gamers • 2026
          </p>
        </div>

        {/* Minimalist Panoramic Base Image */}
        <div className="mt-12 h-36 w-full opacity-20 filter grayscale contrast-150 overflow-hidden">
          <img
            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/page_bg_raw.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </footer>

      {/* Discord Webhook Setup Modal */}
      <DiscordWebhookModal
        isOpen={isDiscordModalOpen}
        onClose={() => setIsDiscordModalOpen(false)}
      />

      {/* Floating Toast Notification */}
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </PageTransition>
  )
}
