import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  Calendar,
  Clock,
  Loader2,
  Gamepad2,
  Shield,
  Plus,
  Flame,
  Radio,
  Search,
  CheckCircle2,
  ChevronRight,
  Play,
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { PixelPatternBg } from '../components/BrandDecorations'
import { getEsportsMatches, saveCustomMatch, deleteCustomMatch } from '../utils/api'
import { getEsportsLive } from '../utils/esportsLive'
import { GAMES_LIST } from '../data/esportsData'
import TeamLogo from '../components/esports/TeamLogo'
import AddMatchModal from '../components/esports/AddMatchModal'
import MatchDetailsModal from '../components/esports/MatchDetailsModal'

export default function Esports() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedGame, setSelectedGame] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'running' | 'not_started' | 'finished'
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [liveSync, setLiveSync] = useState(true)
  const [lastTickMessage, setLastTickMessage] = useState('')

  // Realistic esports round events generator
  const getSimulatedPlay = (teamName, oppName, gameName) => {
    if (gameName === 'Counter-Strike 2') {
      const plays = [
        `${teamName} executes A site with synchronized flashbangs`,
        `${teamName} secures clutch 1v2 defuse on B site`,
        `${teamName} sniper finds opening pick on middle`,
        `${teamName} converts aggressive eco round on banana`,
        `${teamName} holds off late 4v5 retake attempt`,
      ]
      return plays[Math.floor(Math.random() * plays.length)]
    } else if (gameName === 'VALORANT') {
      const plays = [
        `${teamName} duelist secures 3k entry onto A site`,
        `${teamName} defuses spike in smoke with 0.4s left`,
        `${teamName} initiator detects entire enemy team rotate`,
        `${teamName} converts thrifty round with Sheriff pistols`,
        `${teamName} locks down post-plant on B site`,
      ]
      return plays[Math.floor(Math.random() * plays.length)]
    } else if (gameName === 'League of Legends') {
      const plays = [
        `${teamName} secures Baron Nashor following team fight`,
        `${teamName} mid laner catches enemy carry out of position`,
        `${teamName} claims Hextech Dragon soul point`,
        `${teamName} destroys inhibitor tower during 5v5 siege`,
        `${teamName} executes clean 3-man dive in top lane`,
      ]
      return plays[Math.floor(Math.random() * plays.length)]
    } else if (gameName === 'Apex Legends') {
      const plays = [
        `${teamName} wipes squad on ring edge with thermal scopes`,
        `${teamName} takes high ground position in final circle`,
        `${teamName} secures 12 total match points with champion finish`,
      ]
      return plays[Math.floor(Math.random() * plays.length)]
    }
    return `${teamName} outplays ${oppName} to secure key round`
  }

  // Load matches: custom + PandaScore/mock, wrapped with live OpenDota feed
  const loadMatches = useCallback(async () => {
    const data = await getEsportsMatches()
    const { live, pro } = await getEsportsLive()
    setMatches([...live, ...data, ...pro])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadMatches()
  }, [loadMatches])

  // Real-time score ticker engine
  useEffect(() => {
    if (!liveSync) return

    const interval = setInterval(() => {
      setMatches((prevMatches) => {
        const liveMatches = prevMatches.filter((m) => m.status === 'running' && !m.source?.startsWith('opendota'))
        if (liveMatches.length === 0) return prevMatches

        // Randomly choose one live match to update
        const targetIndex = Math.floor(Math.random() * liveMatches.length)
        const targetMatch = liveMatches[targetIndex]

        return prevMatches.map((match) => {
          if (match.id !== targetMatch.id) return match

          const currentLive = match.liveData || {}
          let team1Rounds = currentLive.team1Rounds ?? 0
          let team2Rounds = currentLive.team2Rounds ?? 0
          let mapScore1 = match.results?.[0]?.score ?? 0
          let mapScore2 = match.results?.[1]?.score ?? 0
          const team1Name = match.opponents[0]?.opponent?.name || 'Team 1'
          const team2Name = match.opponents[1]?.opponent?.name || 'Team 2'
          const gameName = match.videogame?.name || 'Esports'

          // Randomly decide which team scores
          const team1Scores = Math.random() > 0.48
          const scoringTeam = team1Scores ? team1Name : team2Name
          const defendingTeam = team1Scores ? team2Name : team1Name

          let eventMessage = ''
          if (team1Scores) {
            team1Rounds += 1
          } else {
            team2Rounds += 1
          }

          eventMessage = getSimulatedPlay(scoringTeam, defendingTeam, gameName)

          // Check for map finish (13 rounds for CS2/Valorant, or 25 kills for LoL/Dota)
          const targetRounds =
            gameName === 'Counter-Strike 2' || gameName === 'VALORANT' ? 13 : 25
          let updatedStatus = match.status
          let roundStatus =
            gameName === 'Counter-Strike 2'
              ? team1Scores
                ? 'Bomb Planted • Site B'
                : 'Defuse Successful'
              : gameName === 'VALORANT'
              ? team1Scores
                ? 'Spike Planted A Site'
                : 'Site Clear • Defused'
              : gameName === 'League of Legends'
              ? 'Baron Nashor Contest'
              : 'Active Contest'

          if (team1Rounds >= targetRounds && team1Rounds - team2Rounds >= 2) {
            mapScore1 += 1
            eventMessage = `🔥 ${team1Name} WINS MAP! (${team1Rounds}-${team2Rounds})`
            team1Rounds = 0
            team2Rounds = 0
            roundStatus = 'Map Complete • Next Map Veto'

            const neededMaps = Math.ceil((match.number_of_games || 3) / 2)
            if (mapScore1 >= neededMaps) {
              updatedStatus = 'finished'
              roundStatus = `MATCH COMPLETE • ${team1Name} VICTORY!`
            }
          } else if (team2Rounds >= targetRounds && team2Rounds - team1Rounds >= 2) {
            mapScore2 += 1
            eventMessage = `🔥 ${team2Name} WINS MAP! (${team1Rounds}-${team2Rounds})`
            team1Rounds = 0
            team2Rounds = 0
            roundStatus = 'Map Complete • Next Map Veto'

            const neededMaps = Math.ceil((match.number_of_games || 3) / 2)
            if (mapScore2 >= neededMaps) {
              updatedStatus = 'finished'
              roundStatus = `MATCH COMPLETE • ${team2Name} VICTORY!`
            }
          }

          setLastTickMessage(
            `${match.opponents[0]?.opponent?.acronym || 'T1'} vs ${
              match.opponents[1]?.opponent?.acronym || 'T2'
            }: ${eventMessage}`
          )

          const updatedRecent = [
            eventMessage,
            ...(currentLive.recentEvents || []).slice(0, 4),
          ]

          const updated = {
            ...match,
            status: updatedStatus,
            results: [{ score: mapScore1 }, { score: mapScore2 }],
            liveData: {
              ...currentLive,
              team1Rounds,
              team2Rounds,
              roundStatus,
              recentEvents: updatedRecent,
            },
          }

          if (selectedMatch && selectedMatch.id === match.id) {
            setSelectedMatch(updated)
          }

          return updated
        })
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [liveSync, selectedMatch])

  // Manual round simulation
  const handleSimulateRound = (matchId) => {
    setMatches((prev) =>
      prev.map((match) => {
        if (match.id !== matchId) return match

        const currentLive = match.liveData || {}
        let team1Rounds = (currentLive.team1Rounds ?? 0) + 1
        const team1Name = match.opponents[0]?.opponent?.name || 'Team 1'
        const team2Name = match.opponents[1]?.opponent?.name || 'Team 2'
        const gameName = match.videogame?.name || 'Esports'
        const eventMessage = getSimulatedPlay(team1Name, team2Name, gameName)

        const updated = {
          ...match,
          liveData: {
            ...currentLive,
            team1Rounds,
            roundStatus: 'Live Action In Progress',
            recentEvents: [eventMessage, ...(currentLive.recentEvents || []).slice(0, 4)],
          },
        }

        if (selectedMatch && selectedMatch.id === matchId) {
          setSelectedMatch(updated)
        }

        return updated
      })
    )
  }

  // Update score from modal
  const handleUpdateScore = (matchId, round1, round2) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId) return m
        const updated = {
          ...m,
          liveData: {
            ...m.liveData,
            team1Rounds: round1,
            team2Rounds: round2,
          },
        }
        if (selectedMatch && selectedMatch.id === matchId) {
          setSelectedMatch(updated)
        }
        return updated
      })
    )
  }

  // Add new match
  const handleAddMatch = (newMatch) => {
    saveCustomMatch(newMatch)
    setMatches((prev) => [newMatch, ...prev])
  }

  // Delete match
  const handleDeleteMatch = (matchId) => {
    deleteCustomMatch(matchId)
    setMatches((prev) => prev.filter((m) => m.id !== matchId))
  }

  // Filter matches
  const filteredMatches = matches.filter((match) => {
    if (selectedGame !== 'all') {
      const matchGame = (match.videogame?.name || '').toLowerCase()
      const selectedGameObj = GAMES_LIST.find((g) => g.id === selectedGame)
      if (
        selectedGameObj &&
        !matchGame.includes(selectedGameObj.name.toLowerCase()) &&
        !matchGame.includes(selectedGameObj.slug.toLowerCase())
      ) {
        return false
      }
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'running' && match.status !== 'running') return false
      if (statusFilter === 'not_started' && match.status !== 'not_started') return false
      if (statusFilter === 'finished' && match.status !== 'finished') return false
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const t1 = match.opponents[0]?.opponent?.name?.toLowerCase() || ''
      const t2 = match.opponents[1]?.opponent?.name?.toLowerCase() || ''
      const league = match.league?.name?.toLowerCase() || ''
      const game = match.videogame?.name?.toLowerCase() || ''
      if (
        !t1.includes(query) &&
        !t2.includes(query) &&
        !league.includes(query) &&
        !game.includes(query)
      ) {
        return false
      }
    }

    return true
  })

  // Format time
  const formatMatchTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Game badge colors
  const getGameAccent = (gameName = '') => {
    const g = gameName.toLowerCase()
    if (g.includes('counter-strike') || g.includes('cs2'))
      return { border: 'border-sky-500/40', bg: 'bg-sky-500/10', text: 'text-sky-400', color: '#38BDF8' }
    if (g.includes('valorant'))
      return { border: 'border-rose-500/40', bg: 'bg-rose-500/10', text: 'text-rose-400', color: '#FF4655' }
    if (g.includes('league'))
      return { border: 'border-blue-500/40', bg: 'bg-blue-500/10', text: 'text-blue-400', color: '#0284C7' }
    if (g.includes('apex'))
      return { border: 'border-red-500/40', bg: 'bg-red-500/10', text: 'text-red-400', color: '#DA291C' }
    if (g.includes('dota'))
      return { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-400', color: '#F59E0B' }
    return { border: 'border-brand-primary/40', bg: 'bg-brand-primary/10', text: 'text-brand-accent', color: '#2563EB' }
  }

  const liveCount = matches.filter((m) => m.status === 'running').length
  const upcomingCount = matches.filter((m) => m.status === 'not_started').length
  const finishedCount = matches.filter((m) => m.status === 'finished').length

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1600px] 2xl:max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-10 space-y-8">
        {/* Arena Header */}
        <header className="relative overflow-hidden rounded-3xl border border-surface-700 bg-brand-surface p-6 sm:p-10 shadow-xl">
          <PixelPatternBg />
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-rose-500/15 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="mb-2.5 inline-flex items-center gap-2 rounded-lg border border-brand-primary/30 bg-brand-primary/10 px-3 py-1 text-brand-accent">
                <Trophy className="h-3.5 w-3.5" />
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest">
                  Live Global Esports Circuit
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-brand-text">
                Pro Esports Arena
              </h1>
              <p className="mt-2 text-sm text-brand-muted max-w-2xl leading-relaxed">
                Official high-resolution vector team emblems, real-time live scoreboards, map schedule breakdowns, and customizable tournament fixtures.
              </p>
            </div>

            {/* Quick Actions & Live Simulator Status */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Live Sync Toggle */}
              <button
                onClick={() => setLiveSync(!liveSync)}
                className={`flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-mono font-bold border transition-all ${
                  liveSync
                    ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300'
                    : 'border-surface-700 bg-surface-900 text-brand-muted hover:text-brand-text'
                }`}
                title={liveSync ? 'Real-time score engine active' : 'Click to enable real-time score engine'}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      liveSync ? 'bg-emerald-400' : 'bg-brand-muted'
                    }`}
                  ></span>
                </span>
                <span>Live Scores: {liveSync ? 'STREAMING' : 'PAUSED'}</span>
              </button>

              {/* Add Match Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-brand-primary hover:bg-brand-primary/90 px-4 py-2 text-xs font-mono font-bold text-white transition-all active:scale-[0.98] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add Match</span>
              </button>
            </div>
          </div>

          {/* Live Engine Broadcast Ticker */}
          {liveSync && lastTickMessage && (
            <div className="relative z-10 mt-6 flex items-center gap-3 rounded-2xl border border-brand-primary/30 bg-surface-900/90 backdrop-blur-md px-4 py-2.5 text-xs font-mono shadow-inner">
              <Radio className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                BROADCAST FEED:
              </span>
              <span className="text-brand-text truncate font-medium">{lastTickMessage}</span>
            </div>
          )}
        </header>

        {/* Filter & Navigation Bar */}
        <section className="space-y-4">
          {/* Game Discipline Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {GAMES_LIST.map((game) => {
              const isActive = selectedGame === game.id
              const count =
                game.id === 'all'
                  ? matches.length
                  : matches.filter((m) =>
                      (m.videogame?.name || '').toLowerCase().includes(game.name.toLowerCase())
                    ).length

              return (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`group flex items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-primary text-white'
                      : 'border border-surface-700 bg-surface-900 text-brand-muted hover:border-brand-primary/50 hover:text-brand-text'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                    style={{ backgroundColor: game.badgeColor || '#60A5FA' }}
                  />
                  <span>{game.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-brand-surface text-brand-muted border border-surface-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Status Pills & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Status Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`rounded-xl px-3.5 py-2 text-xs font-mono font-bold border transition-colors ${
                  statusFilter === 'all'
                    ? 'border-brand-accent bg-brand-accent/15 text-brand-accent'
                    : 'border-surface-700 bg-surface-900 text-brand-muted hover:text-brand-text'
                }`}
              >
                All ({matches.length})
              </button>

              <button
                onClick={() => setStatusFilter('running')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-mono font-bold border transition-colors ${
                  statusFilter === 'running'
                    ? 'border-red-500/70 bg-red-500/20 text-red-300'
                    : 'border-surface-700 bg-surface-900 text-brand-muted hover:text-brand-text'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                LIVE NOW ({liveCount})
              </button>

              <button
                onClick={() => setStatusFilter('not_started')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-mono font-bold border transition-colors ${
                  statusFilter === 'not_started'
                    ? 'border-blue-500/60 bg-blue-500/20 text-blue-300'
                    : 'border-surface-700 bg-surface-900 text-brand-muted hover:text-brand-text'
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                Upcoming ({upcomingCount})
              </button>

              <button
                onClick={() => setStatusFilter('finished')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-mono font-bold border transition-colors ${
                  statusFilter === 'finished'
                    ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-300'
                    : 'border-surface-700 bg-surface-900 text-brand-muted hover:text-brand-text'
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Finished ({finishedCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team or tournament..."
                className="w-full rounded-2xl border border-surface-700 bg-surface-900 pl-10 pr-4 py-2.5 text-xs font-mono text-brand-text placeholder:text-brand-muted focus:border-brand-primary focus:outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Match Cards Grid */}
        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            <p className="text-sm font-mono text-brand-muted">Loading tournament fixtures...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="flex min-h-[35vh] flex-col items-center justify-center rounded-3xl border border-dashed border-surface-700 bg-surface-900 p-8 text-center">
            <Shield className="mb-4 h-12 w-12 text-brand-muted" />
            <h2 className="mb-2 font-display text-xl font-bold text-brand-text">No Matches Found</h2>
            <p className="max-w-md text-sm text-brand-muted mb-4">
              No esports matches match your selected filters. Try choosing another game discipline or add a custom match.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl bg-brand-primary px-5 py-2.5 text-xs font-mono font-bold text-white shadow-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Match Now
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredMatches.map((match, i) => {
              const team1 = match.opponents[0]?.opponent
              const team2 = match.opponents[1]?.opponent
              const t1Color = team1?.color || '#38BDF8'
              const t2Color = team2?.color || '#F43F5E'
              const mapScore1 = match.results?.[0]?.score ?? 0
              const mapScore2 = match.results?.[1]?.score ?? 0
              const isRunning = match.status === 'running'
              const isFinished = match.status === 'finished'
              const live = match.liveData || {}
              const gameStyle = getGameAccent(match.videogame?.name)

              return (
                <motion.article
                  key={match.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 100 }}
                  className={`group relative flex flex-col overflow-hidden rounded-[2rem] border transition-all duration-300 ${
                    isRunning
                      ? 'border-red-500/30 bg-surface-900/40'
                      : 'border-white/5 bg-surface-900/30 hover:bg-surface-900/50 hover:border-white/10 hover:shadow-xl'
                  } backdrop-blur-2xl`}
                >
                  {/* League Header - Sleek */}
                  <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      {match.league?.image_url ? (
                        <img
                          src={match.league.image_url}
                          alt={match.league.name}
                          className="h-8 w-8 object-contain"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                          <Gamepad2 className="h-4 w-4 text-brand-muted" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-display font-bold text-white tracking-wide">
                          {match.league?.name || 'Tournament'}
                        </p>
                        <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">
                          {match.serie?.full_name || 'Competitive Fixture'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Live Status Floating Badge */}
                  {isRunning && (
                    <div className="absolute top-4 right-6 z-20 flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-[10px] font-bold tracking-widest text-red-400 uppercase">Live</span>
                    </div>
                  )}

                  {/* Matchup Body */}
                  <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-6">
                      {/* Team 1 */}
                      <div className="flex flex-1 flex-col items-center gap-4">
                        <div className="relative group-hover:scale-110 transition-transform duration-500">
                          <TeamLogo
                            src={team1?.image_url}
                            name={team1?.name}
                            acronym={team1?.acronym}
                            color={t1Color}
                            size="lg"
                          />
                        </div>
                        <div className="text-center">
                          <span className="block text-base font-display font-bold text-white tracking-tight">
                            {team1?.name || 'TBD'}
                          </span>
                        </div>
                      </div>

                      {/* Score / VS Center */}
                      <div className="flex flex-col items-center justify-center">
                        {isRunning || isFinished ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex items-center gap-4 font-display text-4xl sm:text-5xl font-black tracking-tighter">
                              <span className={mapScore1 > mapScore2 ? 'text-white' : 'text-white/40'}>
                                {mapScore1}
                              </span>
                              <span className="text-white/20 font-light">:</span>
                              <span className={mapScore2 > mapScore1 ? 'text-white' : 'text-white/40'}>
                                {mapScore2}
                              </span>
                            </div>
                            {isRunning && (
                              <div className="rounded-full bg-white/5 border border-white/10 px-4 py-1 text-xs font-mono text-white/70">
                                {live.team1Rounds ?? 0} - {live.team2Rounds ?? 0}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-2xl font-display italic font-black text-white/20">
                            VS
                          </div>
                        )}
                      </div>

                      {/* Team 2 */}
                      <div className="flex flex-1 flex-col items-center gap-4">
                        <div className="relative group-hover:scale-110 transition-transform duration-500">
                          <TeamLogo
                            src={team2?.image_url}
                            name={team2?.name}
                            acronym={team2?.acronym}
                            color={t2Color}
                            size="lg"
                          />
                        </div>
                        <div className="text-center">
                          <span className="block text-base font-display font-bold text-white tracking-tight">
                            {team2?.name || 'TBD'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Meta Info & Actions */}
                    <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                      <div className="flex items-center gap-2 text-white/50 text-xs">
                        <Calendar className="h-4 w-4" />
                        <span>{formatMatchTime(match.begin_at)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isRunning && (
                          <button
                            onClick={() => handleSimulateRound(match.id)}
                            className="flex items-center justify-center gap-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3 py-2 text-xs font-bold text-red-400 transition-colors"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            +Round
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedMatch(match)}
                          className="flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 text-xs font-bold text-white transition-colors"
                        >
                          Details
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}

        {/* Add Match Modal */}
        <AddMatchModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddMatch={handleAddMatch}
        />

        {/* Match Details & Simulator Modal */}
        <MatchDetailsModal
          match={selectedMatch}
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSimulateRound={handleSimulateRound}
          onUpdateScore={handleUpdateScore}
          onDeleteMatch={handleDeleteMatch}
        />
      </div>
    </PageTransition>
  )
}
