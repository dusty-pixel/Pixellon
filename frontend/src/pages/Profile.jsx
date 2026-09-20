import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Gamepad2,
  MapPin,
  Monitor,
  Edit3,
  Share2,
  Check,
  Plus,
  Trash2,
  UserPlus,
  Briefcase,
  Eye,
  Users,
  Shield,
  ThumbsUp,
  Flame,
  Link as LinkIcon,
  Sparkles,
  LogOut,
  LogIn,
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { PixelPatternBg } from '../components/BrandDecorations'
import { getSteamProfile, getSteamOwnedGames } from '../utils/api'
import EditProfileModal from '../components/profile/EditProfileModal'
import GamePickerModal from '../components/profile/GamePickerModal'
import { useAuth } from '../context/AuthContext'

const INITIAL_PROFILE = {
  name: "Kael 'Nighthawk' Vos",
  handle: '@nighthawk',
  headline: 'Competitive FPS Entry Fragger • Soulslike Veteran • Lore Contributor on Pixellon',
  bio: 'Passionate gamer focused on tactical communication, competitive counter-stratting, and deep story campaigns. Currently grinding CS2 Premier 18k+ & exploring Black Myth Wukong. Open for co-op drops and competitive team queues.',
  location: 'Tokyo, Japan',
  battleStation: 'Custom Rig (RTX 4070 Ti) & Steam Deck OLED',
  openToPlay: true,
  avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ShadowCat',
  skills: 'Entry Fragging, Raid Leading, Clutch Plays, Boss Soloing, Map Navigation',
  connections: 142,
}

const INITIAL_FEATURED_GAMES = [
  {
    id: 'cs2',
    title: 'Counter-Strike 2',
    genre: 'Tactical FPS',
    platform: 'PC',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/header.jpg',
  },
  {
    id: 'elden-ring',
    title: 'Elden Ring',
    genre: 'Action RPG',
    platform: 'PC / PS5 / Xbox',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg',
  },
  {
    id: 'bg3',
    title: "Baldur's Gate 3",
    genre: 'CRPG',
    platform: 'PC / PS5 / Xbox',
    image: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg',
  },
]

const GAMING_EXPERIENCE = [
  {
    id: 'exp-1',
    role: 'Competitive Entry Fragger',
    team: 'Team Pixellon CS2',
    period: '2024 — Present • 2 yrs',
    description: 'Led site executes and point duels. Reached Premier Rating 18,500 and placed top 4 in the Community Circuit.',
    icon: Gamepad2,
    color: 'text-brand-accent border-brand-primary/40 bg-brand-primary/10',
  },
  {
    id: 'exp-2',
    role: 'Guild Raid Master',
    team: 'FromSoft & Soulslike Expeditions',
    period: '2022 — Present • 4 yrs',
    description: 'Organized and completed 40+ co-op boss hunts across Elden Ring, Dark Souls trilogy, and Bloodborne.',
    icon: Shield,
    color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
  },
  {
    id: 'exp-3',
    role: 'Helldive Tactical Operative',
    team: 'Helldivers 2 Planetary Defense Taskforce',
    period: '2024 • 8 mos',
    description: 'Specialized in automated bug-breach defense and heavy armor extraction on Helldive difficulty.',
    icon: Flame,
    color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
  },
]

const INITIAL_ENDORSEMENTS = [
  { id: 'end-1', name: 'Clutch Master', count: 18, endorsed: false },
  { id: 'end-2', name: 'Friendly Teammate', count: 24, endorsed: false },
  { id: 'end-3', name: 'Great Callouts', count: 15, endorsed: false },
  { id: 'end-4', name: 'Lore Expert', count: 12, endorsed: false },
  { id: 'end-5', name: 'Raid Leader', count: 9, endorsed: false },
]

const SUGGESTED_GAMERS = [
  {
    id: 'g-1',
    name: "Alex 'Viper' Lin",
    headline: 'Apex Predator • Movement Specialist',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ViperApex',
    connected: false,
  },
  {
    id: 'g-2',
    name: "Elena 'Frost' Vance",
    headline: 'Speedrunner • Hades & Souls Veteran',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=FrostVance',
    connected: false,
  },
  {
    id: 'g-3',
    name: "Marcus 'Titan' Cole",
    headline: 'Tank & Flex Player • 500h in Overwatch',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=TitanCole',
    connected: false,
  },
  {
    id: 'g-4',
    name: "Sora 'Pixel' Takahashi",
    headline: 'Indie Deckbuilder Enthusiast • Balatro Addict',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=SoraPixel',
    connected: false,
  },
]

export default function Profile() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth()

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('pixellon_linkedin_profile')
      return saved ? JSON.parse(saved) : INITIAL_PROFILE
    } catch {
      return INITIAL_PROFILE
    }
  })

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.displayName || user.username || prev.name,
        handle: `@${user.username || prev.handle.replace('@', '')}`,
        avatar: user.avatar || prev.avatar,
        headline: user.headline || prev.headline,
        bio: user.bio || prev.bio,
        location: user.location || prev.location,
        battleStation: user.battleStation || prev.battleStation,
      }))
    }
  }, [user])

  const [featuredGames, setFeaturedGames] = useState(() => {
    try {
      const saved = localStorage.getItem('pixellon_linkedin_featured_games')
      return saved ? JSON.parse(saved) : INITIAL_FEATURED_GAMES
    } catch {
      return INITIAL_FEATURED_GAMES
    }
  })

  const [endorsements, setEndorsements] = useState(INITIAL_ENDORSEMENTS)
  const totalEndorsements = endorsements.reduce((acc, curr) => acc + curr.count, 0)
  const [suggestedGamers, setSuggestedGamers] = useState(SUGGESTED_GAMERS)
  const [isConnectedToUser, setIsConnectedToUser] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isGamePickerOpen, setIsGamePickerOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Steam Sync State
  const [steamIdInput, setSteamIdInput] = useState('')
  const [steamProfile, setSteamProfile] = useState(null)
  const [steamGames, setSteamGames] = useState([])
  const [steamLoading, setSteamLoading] = useState(false)
  const [steamError, setSteamError] = useState('')

  useEffect(() => {
    localStorage.setItem('pixellon_linkedin_profile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('pixellon_linkedin_featured_games', JSON.stringify(featuredGames))
  }, [featuredGames])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleSaveProfile = (updated) => {
    setProfile((prev) => ({ ...prev, ...updated }))
    if (updateProfile) {
      updateProfile(updated)
    }
    showToast('Profile updated successfully!')
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      showToast('Profile link copied to clipboard!')
    }
  }

  const handleAddFeaturedGame = (game) => {
    if (featuredGames.some((g) => g.title === game.title)) {
      showToast('Game already in your Featured Showcase!')
      return
    }
    setFeaturedGames([...featuredGames, game])
    showToast(`Added ${game.title} to Featured Showcase!`)
  }

  const handleRemoveFeaturedGame = (gameId) => {
    setFeaturedGames(featuredGames.filter((g) => g.id !== gameId))
    showToast('Removed from Featured Showcase')
  }

  const handleToggleEndorse = (endId) => {
    setEndorsements((prev) =>
      prev.map((e) => {
        if (e.id === endId) {
          const newStatus = !e.endorsed
          return {
            ...e,
            endorsed: newStatus,
            count: newStatus ? e.count + 1 : e.count - 1,
          }
        }
        return e
      })
    )
    showToast('Endorsement recorded!')
  }

  const handleToggleConnectGamer = (gamerId) => {
    setSuggestedGamers((prev) =>
      prev.map((g) => (g.id === gamerId ? { ...g, connected: !g.connected } : g))
    )
    showToast('Connection request sent!')
  }

  const handleSteamSearch = async (e, customId) => {
    if (e) e.preventDefault()
    const id = customId || steamIdInput
    if (!id.trim()) return

    setSteamLoading(true)
    setSteamError('')
    setSteamProfile(null)
    setSteamGames([])

    try {
      const p = await getSteamProfile(id)
      if (!p) {
        setSteamError('Steam profile not found. Please ensure the 64-bit ID is public.')
        setSteamLoading(false)
        return
      }
      setSteamProfile(p)

      const g = await getSteamOwnedGames(id)
      const sorted = g.sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 8)
      setSteamGames(sorted)
      showToast('Steam account synced!')
    } catch {
      setSteamError('Could not connect to Steam. Check ID or privacy settings.')
    } finally {
      setSteamLoading(false)
    }
  }

  const skillsList = profile.skills
    ? profile.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1500px] 2xl:max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Floating Toast Alert */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-20 right-8 z-50 rounded-xl border border-brand-primary bg-surface-900 px-4 py-2.5 font-mono text-xs text-brand-accent shadow-2xl flex items-center gap-2"
          >
            <Check className="h-4 w-4 text-brand-accent" />
            <span>{toastMessage}</span>
          </motion.div>
        )}

        {/* ── LinkedIn-Style 2-Column Portal Grid ─────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* ═════════════════════════════════════════════════════════════ */}
          {/* LEFT 70% MAIN COLUMN (LinkedIn Feed of Profile Cards)        */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <div className="xl:col-span-8 space-y-6">
            {/* ── CARD 1: LinkedIn-Style Profile Intro Card ───────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface shadow-xl">
              {/* Header Cover Banner */}
              <div className="relative h-40 sm:h-52 w-full bg-surface-900 overflow-hidden border-b border-surface-700">
                <PixelPatternBg />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-surface-900/80 backdrop-blur-md border border-surface-700 px-3 py-1 font-mono text-xs text-brand-muted hover:text-brand-text transition-all cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Profile Intro Info with Overlapping Avatar */}
              <div className="relative px-6 sm:px-8 pb-7 -mt-16 sm:-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  {/* Avatar with #OpenToPlay status ring */}
                  <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full p-1 bg-brand-surface shadow-2xl shrink-0">
                    <div
                      className={`relative h-full w-full rounded-full overflow-hidden p-2 bg-surface-900 border-2 transition-all ${
                        profile.openToPlay
                          ? 'border-brand-primary'
                          : 'border-surface-700'
                      }`}
                    >
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    {/* OpenToPlay Ring Badge */}
                    {profile.openToPlay && (
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-lg bg-brand-primary px-2.5 py-0.5 text-[9px] font-mono font-extrabold text-white uppercase tracking-wider shadow-md whitespace-nowrap">
                        #OpenToPlay
                      </span>
                    )}
                  </div>

                  {/* Action Buttons (Connect / Message / Share) */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-0">
                    <button
                      onClick={() => {
                        setIsConnectedToUser(!isConnectedToUser)
                        showToast(isConnectedToUser ? 'Connection removed' : 'Added to Gaming Network!')
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-md ${
                        isConnectedToUser
                          ? 'bg-brand-primary/20 text-brand-accent border border-brand-primary/40'
                          : 'bg-brand-primary text-white hover:bg-brand-primary/90 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                      }`}
                    >
                      {isConnectedToUser ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-3.5 w-3.5" />
                          <span>+ Connect</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-surface-700 bg-surface-900 px-4 py-2 text-xs font-semibold text-brand-text hover:bg-surface-700 hover:border-brand-primary/50 transition-all cursor-pointer"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit Intro</span>
                    </button>

                    <button
                      onClick={handleShare}
                      title="Share Profile"
                      className="rounded-lg border border-surface-700 bg-surface-900 p-2 text-brand-muted hover:text-brand-text hover:border-brand-primary/50 transition-all cursor-pointer"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>

                    {isAuthenticated ? (
                      <button
                        onClick={() => {
                          logout()
                          showToast('Signed out of session')
                        }}
                        title="Sign Out of Session"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-2 text-xs font-mono font-medium text-red-400 hover:bg-red-950/40 hover:border-red-500/50 transition-all cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Sign Out</span>
                      </button>
                    ) : (
                      <Link
                        to="/signin"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-brand-primary/90 transition-all"
                      >
                        <LogIn className="h-3.5 w-3.5" />
                        <span>Sign In</span>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Profile Identity Details */}
                <div className="mt-4 space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
                      {profile.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-md bg-brand-primary/15 border border-brand-primary/30 px-2 py-0.5 text-xs font-mono font-bold text-brand-accent">
                      <Sparkles className="h-3 w-3" />
                      {profile.handle}
                    </span>
                    <span className="text-xs font-mono text-brand-muted">• 1st</span>
                  </div>

                  <p className="text-sm sm:text-base font-medium text-brand-text/90">
                    {profile.headline}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-brand-muted pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-brand-accent" />
                      {profile.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-amber-400" />
                      {profile.clan}
                    </span>
                    <span className="text-brand-accent hover:underline cursor-pointer">
                      500+ gaming connections
                    </span>
                  </div>
                </div>

                {/* Stat Badges Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-surface-700">
                  <div className="rounded-xl bg-surface-900 p-3 border border-surface-700">
                    <span className="text-[10px] font-mono text-brand-muted uppercase tracking-wider block">
                      Player Level
                    </span>
                    <span className="text-lg font-mono font-bold text-brand-accent">
                      LVL {profile.level}
                    </span>
                  </div>

                  <div className="rounded-xl bg-surface-900 p-3 border border-surface-700">
                    <span className="text-[10px] font-mono text-brand-muted uppercase tracking-wider block">
                      Steam Hours
                    </span>
                    <span className="text-lg font-mono font-bold text-emerald-400">
                      {new Intl.NumberFormat('en-IN').format(profile.hoursPlayed)} hrs
                    </span>
                  </div>

                  <div className="rounded-xl bg-surface-900 p-3 border border-surface-700">
                    <span className="text-[10px] font-mono text-brand-muted uppercase tracking-wider block">
                      Achievements
                    </span>
                    <span className="text-lg font-mono font-bold text-amber-400">
                      {new Intl.NumberFormat('en-IN').format(profile.achievements)} 🏆
                    </span>
                  </div>

                  <div className="rounded-xl bg-surface-900 p-3 border border-surface-700">
                    <span className="text-[10px] font-mono text-brand-muted uppercase tracking-wider block">
                      Endorsements
                    </span>
                    <span className="text-lg font-mono font-bold text-brand-accent2">
                      {totalEndorsements} Kudos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CARD 2: About / Summary Card ────────────────────────── */}
            <div className="rounded-2xl border border-surface-700 bg-brand-surface p-6 sm:p-7 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-surface-700 pb-3">
                <h2 className="font-display text-lg font-bold text-brand-text">
                  About
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-brand-muted hover:text-brand-accent p-1 transition-colors cursor-pointer"
                  title="Edit About"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed whitespace-pre-line font-sans">
                {profile.bio}
              </p>

              {/* Combat Skills Tags */}
              {skillsList.length > 0 && (
                <div className="pt-3 border-t border-surface-700 space-y-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-brand-muted block font-semibold">
                    Specialties & Combat Strengths
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-surface-700 bg-surface-900 px-3 py-1 font-mono text-xs text-brand-accent"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── CARD 3: Featured Games Showcase (LinkedIn Featured) ─── */}
            <div className="rounded-2xl border border-surface-700 bg-brand-surface p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-surface-700 pb-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-brand-text">
                    Featured Games Showcase
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Pinned titles representing your main games and favorite experiences.
                  </p>
                </div>

                <button
                  onClick={() => setIsGamePickerOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand-primary/20 border border-brand-primary/40 px-3.5 py-1.5 text-xs font-mono font-semibold text-brand-accent hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Game</span>
                </button>
              </div>

              {/* Featured Games Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredGames.map((game, idx) => (
                  <div
                    key={game.id || idx}
                    className="group relative rounded-lg border border-surface-700 bg-surface-900 p-3 transition-all hover:border-brand-primary hover:shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-surface-700 mb-2.5 bg-brand-surface">
                        <img
                          src={game.image}
                          alt={game.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFeaturedGame(game.id)}
                          title="Remove from featured"
                          className="absolute top-1.5 right-1.5 rounded-md bg-black/75 p-1 text-zinc-400 hover:text-red-400 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-brand-accent font-bold uppercase tracking-wider">
                        Featured #{idx + 1}
                      </span>
                      <h4 className="font-display text-sm font-bold text-brand-text truncate mt-0.5">
                        {game.title}
                      </h4>
                      <p className="text-xs font-mono text-brand-muted">
                        {game.genre}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-surface-700 flex items-center justify-between text-[10px] font-mono text-brand-accent">
                      <span>★ Pinned Favorite</span>
                      <span className="text-zinc-500 font-normal">Active</span>
                    </div>
                  </div>
                ))}

                {/* Add Game Slot */}
                <button
                  type="button"
                  onClick={() => setIsGamePickerOpen(true)}
                  className="group flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-700 bg-surface-900/50 p-6 text-center transition-all hover:border-brand-accent/50 hover:bg-brand-surface/60 cursor-pointer min-h-[180px]"
                >
                  <Plus className="h-5 w-5 text-brand-muted group-hover:text-brand-accent transition-colors mb-2" />
                  <span className="text-xs font-display font-bold text-brand-text group-hover:text-brand-accent">
                    + Pin Another Game
                  </span>
                  <span className="text-[10px] font-mono text-brand-muted mt-1">
                    Choose from catalog
                  </span>
                </button>
              </div>
            </div>

            {/* ── CARD 4: Gaming Experience & History (LinkedIn Experience) */}
            <div className="rounded-lg border border-surface-700 bg-brand-surface p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-surface-700 pb-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-brand-text">
                    Gaming Experience & History
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Competitive squads, raid leaderships, and major milestone tenures.
                  </p>
                </div>
                <Briefcase className="h-4 w-4 text-brand-accent" />
              </div>

              <div className="space-y-5">
                {GAMING_EXPERIENCE.map((exp) => {
                  const Icon = exp.icon
                  return (
                    <div key={exp.id} className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg border flex items-center justify-center shrink-0 ${exp.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-sm sm:text-base font-bold text-brand-text">
                          {exp.role}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-brand-accent font-semibold mt-0.5">
                          <span>{exp.team}</span>
                          <span className="text-brand-muted">•</span>
                          <span className="text-brand-muted font-normal">{exp.period}</span>
                        </div>
                        <p className="mt-1.5 text-xs text-brand-muted leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── CARD 5: Endorsements & Commendations (LinkedIn Skills) ─ */}
            <div className="rounded-lg border border-surface-700 bg-brand-surface p-6 sm:p-7 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-surface-700 pb-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-brand-text">
                    Player Endorsements & Commendations
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Skills commended by teammates and community squad members.
                  </p>
                </div>
                <ThumbsUp className="h-4 w-4 text-brand-accent" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {endorsements.map((end) => (
                  <div
                    key={end.id}
                    className="flex items-center justify-between rounded-lg border border-surface-700 bg-surface-900 p-3.5 transition-all hover:border-brand-primary/40"
                  >
                    <div>
                      <h4 className="font-display text-xs sm:text-sm font-bold text-brand-text">
                        {end.name}
                      </h4>
                      <p className="text-[11px] font-mono text-brand-muted mt-0.5">
                        {end.count} player endorsements
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleEndorse(end.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all cursor-pointer border ${
                        end.endorsed
                          ? 'border-brand-primary/40 bg-brand-primary/15 text-brand-accent'
                          : 'border-surface-700 bg-surface-900 text-brand-muted hover:text-brand-accent hover:border-brand-accent/40'
                      }`}
                    >
                      {end.endorsed ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Endorsed</span>
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="h-3 w-3" />
                          <span>Endorse</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════ */}
          {/* RIGHT 30% SIDEBAR RAIL (LinkedIn Companion Rail)              */}
          {/* ═════════════════════════════════════════════════════════════ */}
          <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-20">
            {/* ── SIDEBAR 1: Gamers You May Know ─────────────────────── */}
            <div className="rounded-lg border border-surface-700 bg-brand-surface p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-surface-700 pb-3">
                <h3 className="font-display text-sm font-bold text-brand-text">
                  Gamers You May Know
                </h3>
                <Users className="h-4 w-4 text-brand-accent" />
              </div>

              <div className="space-y-3.5">
                {suggestedGamers.map((gamer) => (
                  <div
                    key={gamer.id}
                    className="flex items-start justify-between gap-3 p-2 rounded-lg transition-all hover:bg-surface-900"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-surface-700 bg-surface-900 shrink-0 p-0.5">
                        <img src={gamer.avatar} alt={gamer.name} className="h-full w-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-display text-xs font-bold text-brand-text truncate">
                          {gamer.name}
                        </h4>
                        <p className="text-[10px] text-brand-muted truncate">
                          {gamer.headline}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleConnectGamer(gamer.id)}
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-mono font-semibold transition-all cursor-pointer border ${
                        gamer.connected
                          ? 'border-brand-primary/40 bg-brand-primary/15 text-brand-accent'
                          : 'border-surface-700 bg-brand-surface text-brand-accent hover:border-brand-primary'
                      }`}
                    >
                      {gamer.connected ? 'Pending' : '+ Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SIDEBAR 2: Profile Analytics ───────────────────────── */}
            <div className="rounded-lg border border-surface-700 bg-brand-surface p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-surface-700 pb-2.5">
                <h3 className="font-display text-sm font-bold text-brand-text">
                  Profile Analytics
                </h3>
                <span className="text-[10px] font-mono text-brand-accent bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded-lg">
                  +12% vs last week
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between rounded-lg bg-surface-900 border border-surface-700 p-3">
                  <div className="flex items-center gap-2 text-brand-muted">
                    <Eye className="h-3.5 w-3.5 text-brand-accent" />
                    <span>Profile Views</span>
                  </div>
                  <span className="font-bold text-brand-text">84</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-surface-900 border border-surface-700 p-3">
                  <div className="flex items-center gap-2 text-brand-muted">
                    <Gamepad2 className="h-3.5 w-3.5 text-brand-accent" />
                    <span>Squad Invites</span>
                  </div>
                  <span className="font-bold text-brand-accent">16</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-surface-900 border border-surface-700 p-3">
                  <div className="flex items-center gap-2 text-brand-muted">
                    <Search className="h-3.5 w-3.5 text-amber-400" />
                    <span>Search Appearances</span>
                  </div>
                  <span className="font-bold text-brand-text">32</span>
                </div>
              </div>
            </div>

            {/* ── SIDEBAR 3: Steam Sync & Discord ─────────────────────── */}
            <div className="rounded-lg border border-surface-700 bg-brand-surface p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-surface-700 pb-3">
                <h3 className="font-display text-sm font-bold text-brand-text">
                  Steam Account Sync
                </h3>
                <LinkIcon className="h-4 w-4 text-blue-400" />
              </div>

              <p className="text-xs text-brand-muted">
                Sync your public 64-bit Steam ID to verify your library hours.
              </p>

              <form onSubmit={handleSteamSearch} className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter Steam 64-ID..."
                  value={steamIdInput}
                  onChange={(e) => setSteamIdInput(e.target.value)}
                  className="w-full rounded-lg border border-surface-700 bg-surface-900 py-2 px-3 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={steamLoading}
                  className="w-full rounded-lg bg-brand-primary py-2 text-xs font-mono font-bold text-white shadow hover:bg-brand-primary/90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {steamLoading ? 'Syncing...' : 'Sync Steam Profile'}
                </button>
              </form>

              {/* Demo IDs */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-brand-muted pt-1">
                <span>Demo:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSteamIdInput('76561197960287930')
                    handleSteamSearch(null, '76561197960287930')
                  }}
                  className="text-brand-accent hover:underline"
                >
                  Gabe Newell
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    setSteamIdInput('76561197960434622')
                    handleSteamSearch(null, '76561197960434622')
                  }}
                  className="text-brand-accent hover:underline"
                >
                  Valve
                </button>
              </div>

              {/* Steam Result or Error */}
              {steamError && (
                <div className="mt-3 pt-3 border-t border-surface-700 text-[11px] font-mono text-red-400">
                  {steamError}
                </div>
              )}
              {steamProfile && (
                <div className="mt-3 pt-3 border-t border-surface-700 flex items-center gap-2.5">
                  <img
                    src={steamProfile.avatarfull}
                    alt={steamProfile.personaname}
                    className="h-9 w-9 rounded-lg border border-brand-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-brand-text truncate">
                      {steamProfile.personaname}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400">
                      ✓ Verified Steam ID ({steamGames.length} games synced)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Modals ─────────────────────────────────────────────────── */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentProfile={profile}
          onSave={handleSaveProfile}
        />

        <GamePickerModal
          isOpen={isGamePickerOpen}
          onClose={() => setIsGamePickerOpen(false)}
          onSelectGame={handleAddFeaturedGame}
          currentFavorites={featuredGames}
        />
      </div>
    </PageTransition>
  )
}
