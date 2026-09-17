import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trophy, Clock, Sparkles, Check } from 'lucide-react'
import { PRESET_TEAMS, GAMES_LIST } from '../../data/esportsData'
import TeamLogo from './TeamLogo'

export default function AddMatchModal({ isOpen, onClose, onAddMatch }) {
  const [selectedGame, setSelectedGame] = useState('Counter-Strike 2')
  const [tournamentName, setTournamentName] = useState('IEM Masters 2026')
  const [stageName, setStageName] = useState('Grand Finals - Best of 5')
  const [bestOf, setBestOf] = useState(5)
  const [status, setStatus] = useState('running') // 'running' | 'not_started' | 'finished'

  // Team 1
  const [team1Name, setTeam1Name] = useState('Natus Vincere')
  const [team1Acronym, setTeam1Acronym] = useState('NAVI')
  const [team1Logo, setTeam1Logo] = useState('/esports/teams/navi.svg')
  const [team1Color, setTeam1Color] = useState('#FFE600')
  const [team1MapScore, setTeam1MapScore] = useState(1)
  const [team1RoundScore, setTeam1RoundScore] = useState(12)

  // Team 2
  const [team2Name, setTeam2Name] = useState('FaZe Clan')
  const [team2Acronym, setTeam2Acronym] = useState('FAZE')
  const [team2Logo, setTeam2Logo] = useState('/esports/teams/faze.svg')
  const [team2Color, setTeam2Color] = useState('#E41B26')
  const [team2MapScore, setTeam2MapScore] = useState(1)
  const [team2RoundScore, setTeam2RoundScore] = useState(10)

  // Match details
  const [currentMap, setCurrentMap] = useState('Inferno')
  const [roundStatus, setRoundStatus] = useState('Bomb Planted • Site B')
  const [matchDate, setMatchDate] = useState(new Date().toISOString().slice(0, 16))

  // Presets filtered by current game
  const availablePresets = PRESET_TEAMS.filter(
    (t) => t.game.toLowerCase() === selectedGame.toLowerCase()
  )

  const handleSelectPreset = (team, slot) => {
    if (slot === 1) {
      setTeam1Name(team.name)
      setTeam1Acronym(team.acronym)
      setTeam1Logo(team.logo)
      setTeam1Color(team.color)
    } else {
      setTeam2Name(team.name)
      setTeam2Acronym(team.acronym)
      setTeam2Logo(team.logo)
      setTeam2Color(team.color)
    }
  }

  const handleGameChange = (gameName) => {
    setSelectedGame(gameName)
    const matching = PRESET_TEAMS.filter((t) => t.game.toLowerCase() === gameName.toLowerCase())
    if (matching.length >= 2) {
      handleSelectPreset(matching[0], 1)
      handleSelectPreset(matching[1], 2)
    }
    // Set appropriate tournament suggestions
    if (gameName === 'Counter-Strike 2') {
      setTournamentName('IEM Cologne 2026')
      setCurrentMap('Inferno')
    } else if (gameName === 'VALORANT') {
      setTournamentName('VCT Masters Bangkok')
      setCurrentMap('Ascent')
    } else if (gameName === 'League of Legends') {
      setTournamentName('LCK Summer Split')
      setCurrentMap('Game 3')
    } else if (gameName === 'Apex Legends') {
      setTournamentName('ALGS Championship')
      setCurrentMap('World\'s Edge')
    } else if (gameName === 'Dota 2') {
      setTournamentName('The International 2026')
      setCurrentMap('Game 2')
    } else if (gameName === 'Rocket League') {
      setTournamentName('RLCS World Championship')
      setCurrentMap('DFH Stadium')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newMatch = {
      id: `custom-match-${Date.now()}`,
      name: `${team1Name} vs ${team2Name}`,
      status: status,
      begin_at: new Date(matchDate).toISOString(),
      league: {
        name: tournamentName || 'Pro Esports Circuit',
        image_url:
          selectedGame === 'Counter-Strike 2'
            ? '/esports/tournaments/iem.svg'
            : selectedGame === 'VALORANT'
            ? '/esports/tournaments/vct.svg'
            : selectedGame === 'League of Legends'
            ? '/esports/tournaments/lck.svg'
            : selectedGame === 'Apex Legends'
            ? '/esports/tournaments/algs.svg'
            : selectedGame === 'Dota 2'
            ? '/esports/tournaments/ti.svg'
            : selectedGame === 'Rocket League'
            ? '/esports/tournaments/rlcs.svg'
            : '/esports/tournaments/blast.svg',
        tier: 'Featured Match',
      },
      serie: { full_name: stageName || `Best of ${bestOf}` },
      videogame: {
        name: selectedGame,
        slug: selectedGame.toLowerCase().replace(/\s+/g, '-'),
      },
      number_of_games: parseInt(bestOf, 10) || 3,
      opponents: [
        {
          opponent: {
            id: `team-1-${Date.now()}`,
            name: team1Name || 'Team 1',
            acronym: team1Acronym || 'T1',
            image_url: team1Logo,
            color: team1Color,
          },
        },
        {
          opponent: {
            id: `team-2-${Date.now()}`,
            name: team2Name || 'Team 2',
            acronym: team2Acronym || 'T2',
            image_url: team2Logo,
            color: team2Color,
          },
        },
      ],
      results: [
        { score: status === 'not_started' ? 0 : parseInt(team1MapScore, 10) || 0 },
        { score: status === 'not_started' ? 0 : parseInt(team2MapScore, 10) || 0 },
      ],
      liveData: {
        currentMap: currentMap || 'Map 1',
        mapIndex: 1,
        team1Rounds: status === 'not_started' ? 0 : parseInt(team1RoundScore, 10) || 0,
        team2Rounds: status === 'not_started' ? 0 : parseInt(team2RoundScore, 10) || 0,
        roundStatus:
          status === 'running'
            ? roundStatus || 'Active Round'
            : status === 'finished'
            ? 'Match Finished'
            : 'Scheduled Match',
        roundTime: status === 'running' ? '0:45' : 'Upcoming',
        recentEvents: [
          `Match scheduled: ${team1Name} vs ${team2Name} in ${tournamentName}`,
        ],
        maps: [
          {
            name: currentMap || 'Map 1',
            score1: parseInt(team1RoundScore, 10) || 0,
            score2: parseInt(team2RoundScore, 10) || 0,
            status: status === 'running' ? 'live' : status === 'finished' ? 'finished' : 'pending',
          },
        ],
      },
      isCustom: true,
    }

    onAddMatch(newMatch)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#1E2638] bg-[#151A24] shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1E2638] bg-[#0B0F17] px-6 py-4">
            <div className="flex items-center gap-2 text-brand-primary">
              <Trophy className="h-5 w-5 text-brand-accent" />
              <h2 className="font-display text-lg font-bold text-brand-text">
                Add New Esports Match
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-brand-muted hover:bg-[#1E2638] hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* 1. Game Selection */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-brand-accent mb-2">
                1. Select Game Discipline
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GAMES_LIST.filter((g) => g.id !== 'all').map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleGameChange(g.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono font-semibold border transition-all ${
                      selectedGame === g.name
                        ? 'border-brand-primary bg-brand-primary/20 text-brand-text shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                        : 'border-[#1E2638] bg-[#0B0F17] text-brand-muted hover:border-[#2C3549] hover:text-brand-text'
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: g.badgeColor || '#2563EB' }}
                    />
                    <span className="truncate">{g.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Tournament & Stage Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono font-semibold text-brand-muted mb-1.5">
                  Tournament / League Name
                </label>
                <input
                  type="text"
                  required
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  className="w-full rounded-lg border border-[#1E2638] bg-[#0B0F17] px-3.5 py-2 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                  placeholder="e.g. IEM Cologne 2026, VCT Masters"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-semibold text-brand-muted mb-1.5">
                  Format
                </label>
                <select
                  value={bestOf}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setBestOf(val)
                    setStageName(`Best of ${val}`)
                  }}
                  className="w-full rounded-lg border border-[#1E2638] bg-[#0B0F17] px-3 py-2 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                >
                  <option value={1}>Best of 1</option>
                  <option value={3}>Best of 3</option>
                  <option value={5}>Best of 5</option>
                  <option value={7}>Best of 7</option>
                </select>
              </div>
            </div>

            {/* 3. Match Status */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-brand-accent mb-2">
                2. Match Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('running')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-mono font-bold border transition-all ${
                    status === 'running'
                      ? 'border-red-500 bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                      : 'border-[#1E2638] bg-[#0B0F17] text-brand-muted hover:border-[#2C3549]'
                  }`}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  🔴 Live Now
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('not_started')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-mono font-bold border transition-all ${
                    status === 'not_started'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                      : 'border-[#1E2638] bg-[#0B0F17] text-brand-muted hover:border-[#2C3549]'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  ⏳ Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('finished')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-mono font-bold border transition-all ${
                    status === 'finished'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'border-[#1E2638] bg-[#0B0F17] text-brand-muted hover:border-[#2C3549]'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                  🏆 Finished
                </button>
              </div>
            </div>

            {/* Quick Presets for Selected Game */}
            {availablePresets.length > 0 && (
              <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-3">
                <div className="flex items-center gap-1.5 mb-2 text-xs font-mono text-brand-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Quick Presets for {selectedGame}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availablePresets.map((p) => (
                    <div key={p.id} className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSelectPreset(p, 1)}
                        className="text-[11px] font-mono px-2 py-1 rounded bg-[#151A24] border border-[#1E2638] text-brand-text hover:border-brand-primary hover:text-white"
                        title={`Set as Team 1`}
                      >
                        Set as T1: <span className="font-bold">{p.acronym}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectPreset(p, 2)}
                        className="text-[11px] font-mono px-2 py-1 rounded bg-[#151A24] border border-[#1E2638] text-brand-muted hover:border-brand-primary hover:text-white"
                        title={`Set as Team 2`}
                      >
                        T2: <span className="font-bold">{p.acronym}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Teams Setup (Side by Side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Team 1 */}
              <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <TeamLogo
                    src={team1Logo}
                    name={team1Name}
                    acronym={team1Acronym}
                    color={team1Color}
                    size="sm"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-brand-accent uppercase">
                      Team 1 (Blue Side / Home)
                    </span>
                    <p className="text-sm font-display font-bold text-brand-text truncate">
                      {team1Name}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-brand-muted">Team Name</label>
                  <input
                    type="text"
                    required
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#151A24] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-mono text-brand-muted">Acronym</label>
                    <input
                      type="text"
                      value={team1Acronym}
                      onChange={(e) => setTeam1Acronym(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#151A24] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-brand-muted">Logo Path/URL</label>
                    <input
                      type="text"
                      value={team1Logo}
                      onChange={(e) => setTeam1Logo(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#151A24] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                </div>

                {status !== 'not_started' && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1E2638]">
                    <div>
                      <label className="text-[11px] font-mono text-brand-accent font-semibold">
                        Maps Won
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={bestOf}
                        value={team1MapScore}
                        onChange={(e) => setTeam1MapScore(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#151A24] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-brand-accent font-semibold">
                        Round / Kills
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={team1RoundScore}
                        onChange={(e) => setTeam1RoundScore(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#151A24] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Team 2 */}
              <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <TeamLogo
                    src={team2Logo}
                    name={team2Name}
                    acronym={team2Acronym}
                    color={team2Color}
                    size="sm"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-brand-accent uppercase">
                      Team 2 (Red Side / Away)
                    </span>
                    <p className="text-sm font-display font-bold text-brand-text truncate">
                      {team2Name}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-brand-muted">Team Name</label>
                  <input
                    type="text"
                    required
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#151A24] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-mono text-brand-muted">Acronym</label>
                    <input
                      type="text"
                      value={team2Acronym}
                      onChange={(e) => setTeam2Acronym(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#151A24] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-brand-muted">Logo Path/URL</label>
                    <input
                      type="text"
                      value={team2Logo}
                      onChange={(e) => setTeam2Logo(e.target.value)}
                      className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#151A24] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                    />
                  </div>
                </div>

                {status !== 'not_started' && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1E2638]">
                    <div>
                      <label className="text-[11px] font-mono text-brand-accent font-semibold">
                        Maps Won
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={bestOf}
                        value={team2MapScore}
                        onChange={(e) => setTeam2MapScore(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#151A24] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono text-brand-accent font-semibold">
                        Round / Kills
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={team2RoundScore}
                        onChange={(e) => setTeam2RoundScore(e.target.value)}
                        className="w-full mt-1 rounded-lg border border-[#1E2638] bg-[#151A24] px-3 py-1.5 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Active Map & Schedule */}
            <div className={`grid grid-cols-1 ${status === 'running' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
              <div>
                <label className="block text-xs font-mono font-semibold text-brand-muted mb-1.5">
                  Current Map / Stage
                </label>
                <input
                  type="text"
                  value={currentMap}
                  onChange={(e) => setCurrentMap(e.target.value)}
                  placeholder="e.g. Inferno, Bind, Game 3"
                  className="w-full rounded-lg border border-[#1E2638] bg-[#0B0F17] px-3.5 py-2 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                />
              </div>

              {status === 'running' && (
                <div>
                  <label className="block text-xs font-mono font-semibold text-brand-muted mb-1.5">
                    Live Status / Objective
                  </label>
                  <input
                    type="text"
                    value={roundStatus}
                    onChange={(e) => setRoundStatus(e.target.value)}
                    placeholder="e.g. Bomb Planted, Baron Contest"
                    className="w-full rounded-lg border border-[#1E2638] bg-[#0B0F17] px-3.5 py-2 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-mono font-semibold text-brand-muted mb-1.5">
                  Scheduled Start Time
                </label>
                <input
                  type="datetime-local"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="w-full rounded-lg border border-[#1E2638] bg-[#0B0F17] px-3.5 py-2 text-xs font-mono text-brand-text focus:border-brand-primary focus:outline-none"
                />
              </div>
            </div>

            {/* 6. Live Card Preview */}
            <div className="rounded-xl border border-brand-primary/30 bg-[#0B0F17] p-4">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-accent mb-3 flex items-center justify-between">
                <span>Match Preview</span>
                <span className="text-xs text-brand-muted">{selectedGame}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <TeamLogo
                    src={team1Logo}
                    name={team1Name}
                    acronym={team1Acronym}
                    color={team1Color}
                    size="sm"
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-brand-text">{team1Name}</span>
                    <p className="text-[10px] font-mono text-brand-muted">{team1Acronym}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  {status === 'running' ? (
                    <div className="text-center">
                      <div className="font-mono text-base font-extrabold text-brand-text">
                        {team1MapScore} : {team2MapScore}
                      </div>
                      <span className="text-[10px] font-mono text-red-400 font-bold">
                        {team1RoundScore} - {team2RoundScore} ({currentMap})
                      </span>
                    </div>
                  ) : status === 'finished' ? (
                    <div className="text-center">
                      <div className="font-mono text-base font-extrabold text-brand-text">
                        {team1MapScore} : {team2MapScore}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">FINAL</span>
                    </div>
                  ) : (
                    <span className="font-mono text-sm font-black italic text-brand-accent">VS</span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="text-xs font-mono font-bold text-brand-text">{team2Name}</span>
                    <p className="text-[10px] font-mono text-brand-muted">{team2Acronym}</p>
                  </div>
                  <TeamLogo
                    src={team2Logo}
                    name={team2Name}
                    acronym={team2Acronym}
                    color={team2Color}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2638]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[#1E2638] bg-[#0B0F17] text-xs font-mono font-semibold text-brand-muted hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-primary hover:bg-blue-600 text-xs font-mono font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Match to Circuit
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
