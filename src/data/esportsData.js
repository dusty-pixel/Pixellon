/**
 * Curated Esports Data & Presets
 * Official Vector Logos, Verified Tournament Circuits, Real Teams, and Live Match Schemas
 */

export const GAMES_LIST = [
  { id: 'all', name: 'All Games', slug: 'all', icon: 'Gamepad2' },
  { id: 'cs2', name: 'Counter-Strike 2', slug: 'cs2', icon: 'Crosshair', badgeColor: '#38BDF8' },
  { id: 'valorant', name: 'VALORANT', slug: 'valorant', icon: 'Flame', badgeColor: '#FF4655' },
  { id: 'lol', name: 'League of Legends', slug: 'league-of-legends', icon: 'Sword', badgeColor: '#0284C7' },
  { id: 'apex', name: 'Apex Legends', slug: 'apex-legends', icon: 'Zap', badgeColor: '#DA291C' },
  { id: 'dota2', name: 'Dota 2', slug: 'dota2', icon: 'Shield', badgeColor: '#DC2626' },
  { id: 'rl', name: 'Rocket League', slug: 'rocket-league', icon: 'Trophy', badgeColor: '#0284C7' },
];

export const PRESET_TEAMS = [
  // CS2
  { id: 'navi', name: 'Natus Vincere', acronym: 'NAVI', game: 'Counter-Strike 2', logo: '/esports/teams/navi.svg', color: '#FFE600', region: 'EU' },
  { id: 'faze', name: 'FaZe Clan', acronym: 'FAZE', game: 'Counter-Strike 2', logo: '/esports/teams/faze.svg', color: '#E41B26', region: 'NA/EU' },
  { id: 'vitality', name: 'Team Vitality', acronym: 'VIT', game: 'Counter-Strike 2', logo: '/esports/teams/vitality.svg', color: '#FEE000', region: 'EU' },
  { id: 'g2', name: 'G2 Esports', acronym: 'G2', game: 'Counter-Strike 2', logo: '/esports/teams/g2.svg', color: '#FFFFFF', region: 'EU' },
  { id: 'liquid', name: 'Team Liquid', acronym: 'TL', game: 'Counter-Strike 2', logo: '/esports/teams/liquid.svg', color: '#0E274D', region: 'NA' },
  
  // VALORANT
  { id: 'sentinels', name: 'Sentinels', acronym: 'SEN', game: 'VALORANT', logo: '/esports/teams/sentinels.svg', color: '#CE0037', region: 'Americas' },
  { id: 'fnatic', name: 'Fnatic', acronym: 'FNC', game: 'VALORANT', logo: '/esports/teams/fnatic.svg', color: '#FF5900', region: 'EMEA' },
  { id: 'paperrex', name: 'Paper Rex', acronym: 'PRX', game: 'VALORANT', logo: '/esports/teams/paperrex.svg', color: '#F43F5E', region: 'Pacific' },
  { id: 'cloud9', name: 'Cloud9', acronym: 'C9', game: 'VALORANT', logo: '/esports/teams/cloud9.svg', color: '#00AEEF', region: 'Americas' },
  { id: 'geng-val', name: 'Gen.G', acronym: 'GEN', game: 'VALORANT', logo: '/esports/teams/geng.svg', color: '#AA8A59', region: 'Pacific' },

  // League of Legends
  { id: 't1', name: 'T1', acronym: 'T1', game: 'League of Legends', logo: '/esports/teams/t1.svg', color: '#E2012D', region: 'LCK' },
  { id: 'geng-lol', name: 'Gen.G', acronym: 'GEN', game: 'League of Legends', logo: '/esports/teams/geng.svg', color: '#AA8A59', region: 'LCK' },
  { id: 'g2-lol', name: 'G2 Esports', acronym: 'G2', game: 'League of Legends', logo: '/esports/teams/g2.svg', color: '#FFFFFF', region: 'LEC' },
  { id: 'fnatic-lol', name: 'Fnatic', acronym: 'FNC', game: 'League of Legends', logo: '/esports/teams/fnatic.svg', color: '#FF5900', region: 'LEC' },
  { id: 'liquid-lol', name: 'Team Liquid', acronym: 'TL', game: 'League of Legends', logo: '/esports/teams/liquid.svg', color: '#0E274D', region: 'LCS' },

  // Apex Legends
  { id: 'darkzero', name: 'DarkZero', acronym: 'DZ', game: 'Apex Legends', logo: '/esports/teams/darkzero.png', color: '#9333EA', region: 'NA' },
  { id: 'moist', name: 'Moist Esports', acronym: 'MST', game: 'Apex Legends', logo: '/esports/teams/moist.png', color: '#06B6D4', region: 'NA' },
  { id: 'faze-apex', name: 'FaZe Clan', acronym: 'FAZE', game: 'Apex Legends', logo: '/esports/teams/faze.svg', color: '#E41B26', region: 'NA' },

  // Dota 2
  { id: 'spirit', name: 'Team Spirit', acronym: 'TS', game: 'Dota 2', logo: '/esports/teams/spirit.svg', color: '#FFFFFF', region: 'EEU' },
  { id: 'liquid-dota', name: 'Team Liquid', acronym: 'TL', game: 'Dota 2', logo: '/esports/teams/liquid.svg', color: '#0E274D', region: 'WEU' },
  { id: 'g2-dota', name: 'G2 x iG', acronym: 'G2', game: 'Dota 2', logo: '/esports/teams/g2.svg', color: '#FFFFFF', region: 'CN' },

  // Rocket League
  { id: 'karmine', name: 'Karmine Corp', acronym: 'KC', game: 'Rocket League', logo: '/esports/teams/karmine.svg', color: '#2563EB', region: 'EU' },
  { id: 'vitality-rl', name: 'Team Vitality', acronym: 'VIT', game: 'Rocket League', logo: '/esports/teams/vitality.svg', color: '#FEE000', region: 'EU' },
  { id: 'g2-rl', name: 'G2 Stride', acronym: 'G2', game: 'Rocket League', logo: '/esports/teams/g2.svg', color: '#FFFFFF', region: 'NA' },
];

export const initialEsportsMatches = [
  {
    id: 'match-01',
    name: 'NAVI vs FaZe Clan',
    status: 'running', // running, not_started, finished
    begin_at: new Date(Date.now() - 3600000).toISOString(),
    league: {
      name: 'IEM Cologne 2026',
      image_url: '/esports/tournaments/iem.svg',
      tier: 'S-Tier Premier',
    },
    serie: { full_name: 'Grand Finals - Best of 5' },
    videogame: { name: 'Counter-Strike 2', slug: 'cs2' },
    number_of_games: 5,
    opponents: [
      {
        opponent: {
          id: 'navi',
          name: 'Natus Vincere',
          acronym: 'NAVI',
          image_url: '/esports/teams/navi.svg',
          color: '#FFE600',
        },
      },
      {
        opponent: {
          id: 'faze',
          name: 'FaZe Clan',
          acronym: 'FAZE',
          image_url: '/esports/teams/faze.svg',
          color: '#E41B26',
        },
      },
    ],
    results: [{ score: 1 }, { score: 1 }],
    liveData: {
      currentMap: 'Inferno (Map 3 of 5)',
      mapIndex: 3,
      team1Rounds: 12,
      team2Rounds: 10,
      roundStatus: 'Bomb Planted • Site B',
      roundTime: '0:32',
      recentEvents: [
        'Round 22: b1t 2k spraydown secures B site hold',
        'Round 21: broky AWP collateral entry on banana',
        'Round 20: NAVI eco pistol turnaround on A apartment',
      ],
      maps: [
        { name: 'Mirage', score1: 13, score2: 9, winner: 'NAVI', status: 'finished' },
        { name: 'Nuke', score1: 10, score2: 13, winner: 'FaZe Clan', status: 'finished' },
        { name: 'Inferno', score1: 12, score2: 10, status: 'live' },
        { name: 'Ancient', score1: 0, score2: 0, status: 'pending' },
        { name: 'Dust II', score1: 0, score2: 0, status: 'pending' },
      ],
    },
  },
  {
    id: 'match-02',
    name: 'Sentinels vs Fnatic',
    status: 'running',
    begin_at: new Date(Date.now() - 1800000).toISOString(),
    league: {
      name: 'VCT Masters Bangkok',
      image_url: '/esports/tournaments/vct.svg',
      tier: 'International Major',
    },
    serie: { full_name: 'Upper Bracket Finals' },
    videogame: { name: 'VALORANT', slug: 'valorant' },
    number_of_games: 3,
    opponents: [
      {
        opponent: {
          id: 'sentinels',
          name: 'Sentinels',
          acronym: 'SEN',
          image_url: '/esports/teams/sentinels.svg',
          color: '#CE0037',
        },
      },
      {
        opponent: {
          id: 'fnatic',
          name: 'Fnatic',
          acronym: 'FNC',
          image_url: '/esports/teams/fnatic.svg',
          color: '#FF5900',
        },
      },
    ],
    results: [{ score: 1 }, { score: 0 }],
    liveData: {
      currentMap: 'Bind (Map 2 of 3)',
      mapIndex: 2,
      team1Rounds: 10,
      team2Rounds: 8,
      roundStatus: 'Spike Planted • Hookah Push',
      roundTime: '0:24',
      recentEvents: [
        'Round 18: zekken 3k Raze entry onto A site lamps',
        'Round 17: Derke Operator triple kill holding long B',
        'Round 16: TenZ 1v2 clutch defuse with 0.12s left',
      ],
      maps: [
        { name: 'Ascent', score1: 13, score2: 11, winner: 'Sentinels', status: 'finished' },
        { name: 'Bind', score1: 10, score2: 8, status: 'live' },
        { name: 'Sunset', score1: 0, score2: 0, status: 'pending' },
      ],
    },
  },
  {
    id: 'match-03',
    name: 'T1 vs Gen.G',
    status: 'running',
    begin_at: new Date(Date.now() - 2700000).toISOString(),
    league: {
      name: 'LCK Summer Split',
      image_url: '/esports/tournaments/lck.svg',
      tier: 'Regional Championship',
    },
    serie: { full_name: 'Playoffs Round 2' },
    videogame: { name: 'League of Legends', slug: 'lol' },
    number_of_games: 5,
    opponents: [
      {
        opponent: {
          id: 't1',
          name: 'T1',
          acronym: 'T1',
          image_url: '/esports/teams/t1.svg',
          color: '#E2012D',
        },
      },
      {
        opponent: {
          id: 'geng',
          name: 'Gen.G',
          acronym: 'GEN',
          image_url: '/esports/teams/geng.svg',
          color: '#AA8A59',
        },
      },
    ],
    results: [{ score: 1 }, { score: 1 }],
    liveData: {
      currentMap: 'Game 3 of 5 (28:45)',
      mapIndex: 3,
      team1Rounds: 15, // Kills
      team2Rounds: 13, // Kills
      roundStatus: 'Baron Nashor Contest',
      roundTime: '28:45',
      recentEvents: [
        '28:15: Faker Azir Shurima Shuffle catches Chovy',
        '24:10: Gen.G secures Chemtech Dragon soul point',
        '19:40: Oner Vi flash-assaults bot lane tower',
      ],
      maps: [
        { name: 'Game 1', score1: 1, score2: 0, winner: 'T1', status: 'finished' },
        { name: 'Game 2', score1: 0, score2: 1, winner: 'Gen.G', status: 'finished' },
        { name: 'Game 3', score1: 15, score2: 13, status: 'live' },
        { name: 'Game 4', score1: 0, score2: 0, status: 'pending' },
        { name: 'Game 5', score1: 0, score2: 0, status: 'pending' },
      ],
    },
  },
  {
    id: 'match-04',
    name: 'DarkZero vs Moist Esports',
    status: 'running',
    begin_at: new Date(Date.now() - 1200000).toISOString(),
    league: {
      name: 'ALGS Championship',
      image_url: '/esports/tournaments/algs.svg',
      tier: 'Global Championship',
    },
    serie: { full_name: 'Group A vs Group B' },
    videogame: { name: 'Apex Legends', slug: 'apex' },
    number_of_games: 6,
    opponents: [
      {
        opponent: {
          id: 'darkzero',
          name: 'DarkZero',
          acronym: 'DZ',
          image_url: '/esports/teams/darkzero.png',
          color: '#9333EA',
        },
      },
      {
        opponent: {
          id: 'moist',
          name: 'Moist Esports',
          acronym: 'MST',
          image_url: '/esports/teams/moist.png',
          color: '#06B6D4',
        },
      },
    ],
    results: [{ score: 2 }, { score: 1 }],
    liveData: {
      currentMap: 'Storm Point (Match 4 of 6)',
      mapIndex: 4,
      team1Rounds: 9, // Kills in match 4
      team2Rounds: 7,
      roundStatus: 'Ring 4 Closing • 6 Squads Left',
      roundTime: '17:20',
      recentEvents: [
        'Match 4: Genburten wipes full squad with Nemesis burst',
        'Match 3: Moist Esports finishes 2nd with 12 team kills',
        'Match 2: DarkZero takes the Champion screen',
      ],
      maps: [
        { name: 'Match 1 (World\'s Edge)', score1: 18, score2: 12, winner: 'DarkZero', status: 'finished' },
        { name: 'Match 2 (Storm Point)', score1: 14, score2: 16, winner: 'Moist Esports', status: 'finished' },
        { name: 'Match 3 (World\'s Edge)', score1: 16, score2: 14, winner: 'DarkZero', status: 'finished' },
        { name: 'Match 4 (Storm Point)', score1: 9, score2: 7, status: 'live' },
        { name: 'Match 5 (World\'s Edge)', score1: 0, score2: 0, status: 'pending' },
        { name: 'Match 6 (Storm Point)', score1: 0, score2: 0, status: 'pending' },
      ],
    },
  },
  {
    id: 'match-05',
    name: 'Team Vitality vs G2 Esports',
    status: 'not_started',
    begin_at: new Date(Date.now() + 7200000).toISOString(),
    league: {
      name: 'BLAST Premier World Final',
      image_url: '/esports/tournaments/blast.svg',
      tier: 'S-Tier LAN',
    },
    serie: { full_name: 'Upper Semifinals - Best of 3' },
    videogame: { name: 'Counter-Strike 2', slug: 'cs2' },
    number_of_games: 3,
    opponents: [
      {
        opponent: {
          id: 'vitality',
          name: 'Team Vitality',
          acronym: 'VIT',
          image_url: '/esports/teams/vitality.svg',
          color: '#FEE000',
        },
      },
      {
        opponent: {
          id: 'g2',
          name: 'G2 Esports',
          acronym: 'G2',
          image_url: '/esports/teams/g2.svg',
          color: '#FFFFFF',
        },
      },
    ],
    results: [{ score: 0 }, { score: 0 }],
    liveData: {
      currentMap: 'Veto in Progress',
      mapIndex: 1,
      team1Rounds: 0,
      team2Rounds: 0,
      roundStatus: 'Scheduled to broadcast live',
      roundTime: 'Starts in 2h',
      recentEvents: ['Pre-match analysis show will start 30m prior to veto'],
      maps: [
        { name: 'Map 1 (Pick Team Vitality)', score1: 0, score2: 0, status: 'pending' },
        { name: 'Map 2 (Pick G2 Esports)', score1: 0, score2: 0, status: 'pending' },
        { name: 'Map 3 (Decider)', score1: 0, score2: 0, status: 'pending' },
      ],
    },
  },
  {
    id: 'match-06',
    name: 'Paper Rex vs Cloud9',
    status: 'not_started',
    begin_at: new Date(Date.now() + 18000000).toISOString(),
    league: {
      name: 'VCT Champions 2026',
      image_url: '/esports/tournaments/vct.svg',
      tier: 'World Championship',
    },
    serie: { full_name: 'Group Stage - Decider Match' },
    videogame: { name: 'VALORANT', slug: 'valorant' },
    number_of_games: 3,
    opponents: [
      {
        opponent: {
          id: 'paperrex',
          name: 'Paper Rex',
          acronym: 'PRX',
          image_url: '/esports/teams/paperrex.svg',
          color: '#F43F5E',
        },
      },
      {
        opponent: {
          id: 'cloud9',
          name: 'Cloud9',
          acronym: 'C9',
          image_url: '/esports/teams/cloud9.svg',
          color: '#00AEEF',
        },
      },
    ],
    results: [{ score: 0 }, { score: 0 }],
    liveData: {
      currentMap: 'Sunset (Predicted Map 1)',
      mapIndex: 1,
      team1Rounds: 0,
      team2Rounds: 0,
      roundStatus: 'Warmup & Tactical Setup',
      roundTime: 'Starts in 5h',
      recentEvents: ['PRX locks in aggressive double-duelist composition preview'],
      maps: [
        { name: 'Sunset', score1: 0, score2: 0, status: 'pending' },
        { name: 'Lotus', score1: 0, score2: 0, status: 'pending' },
        { name: 'Haven', score1: 0, score2: 0, status: 'pending' },
      ],
    },
  },
  {
    id: 'match-07',
    name: 'Team Spirit vs Team Liquid',
    status: 'finished',
    begin_at: new Date(Date.now() - 86400000).toISOString(),
    league: {
      name: 'The International 2026',
      image_url: '/esports/tournaments/ti.svg',
      tier: 'Dota 2 World Championship',
    },
    serie: { full_name: 'Grand Finals - Best of 5' },
    videogame: { name: 'Dota 2', slug: 'dota2' },
    number_of_games: 5,
    opponents: [
      {
        opponent: {
          id: 'spirit',
          name: 'Team Spirit',
          acronym: 'TS',
          image_url: '/esports/teams/spirit.svg',
          color: '#FFFFFF',
        },
      },
      {
        opponent: {
          id: 'liquid',
          name: 'Team Liquid',
          acronym: 'TL',
          image_url: '/esports/teams/liquid.svg',
          color: '#0E274D',
        },
      },
    ],
    results: [{ score: 3 }, { score: 1 }],
    liveData: {
      currentMap: 'Game 4 (Final)',
      mapIndex: 4,
      team1Rounds: 38,
      team2Rounds: 21,
      roundStatus: 'Match Complete • Team Spirit Champions',
      roundTime: '44:12',
      recentEvents: [
        'Team Spirit lifts the Aegis of Champions (3-1)',
        'Yatoro rampages through enemy base on Faceless Void',
        'Collapse Magnus Reverse Polarity seals Game 4',
      ],
      maps: [
        { name: 'Game 1', score1: 1, score2: 0, winner: 'Team Spirit', status: 'finished' },
        { name: 'Game 2', score1: 0, score2: 1, winner: 'Team Liquid', status: 'finished' },
        { name: 'Game 3', score1: 1, score2: 0, winner: 'Team Spirit', status: 'finished' },
        { name: 'Game 4', score1: 1, score2: 0, winner: 'Team Spirit', status: 'finished' },
      ],
    },
  },
  {
    id: 'match-08',
    name: 'Karmine Corp vs Team Vitality',
    status: 'not_started',
    begin_at: new Date(Date.now() + 25200000).toISOString(),
    league: {
      name: 'RLCS World Championship',
      image_url: '/esports/tournaments/rlcs.svg',
      tier: 'Major World Finals',
    },
    serie: { full_name: 'Quarterfinals - Best of 7' },
    videogame: { name: 'Rocket League', slug: 'rl' },
    number_of_games: 7,
    opponents: [
      {
        opponent: {
          id: 'karmine',
          name: 'Karmine Corp',
          acronym: 'KC',
          image_url: '/esports/teams/karmine.svg',
          color: '#2563EB',
        },
      },
      {
        opponent: {
          id: 'vitality',
          name: 'Team Vitality',
          acronym: 'VIT',
          image_url: '/esports/teams/vitality.svg',
          color: '#FEE000',
        },
      },
    ],
    results: [{ score: 0 }, { score: 0 }],
    liveData: {
      currentMap: 'DFH Stadium',
      mapIndex: 1,
      team1Rounds: 0,
      team2Rounds: 0,
      roundStatus: 'Scheduled Broadcast',
      roundTime: 'Starts in 7h',
      recentEvents: ['French Derby showdown on LAN stage'],
      maps: [
        { name: 'Game 1 (DFH Stadium)', score1: 0, score2: 0, status: 'pending' },
        { name: 'Game 2 (Mannfield)', score1: 0, score2: 0, status: 'pending' },
        { name: 'Game 3 (Champions Field)', score1: 0, score2: 0, status: 'pending' },
      ],
    },
  },
];
