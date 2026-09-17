import { curatedStreams } from '../data/mockStreams.js';
import { initialEsportsMatches } from '../data/esportsData.js';

const API_KEY = import.meta.env?.VITE_RAWG_API_KEY || '';
const BASE_URL = 'https://api.rawg.io/api';

/**
 * Maps RAWG API game object to our GameCard format
 */
const mapGameData = (game) => {
 return {
 id: game.id,
 title: game.name,
 genre: game.genres?.[0]?.name || 'Action',
 platform: game.parent_platforms?.map((p) => p.platform.name).slice(0, 3) || ['PC'],
 rating: game.metacritic ? (game.metacritic / 10).toFixed(1) : null,
 image: game.background_image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
 excerpt: game.name, // RAWG list endpoints don't return description by default without hitting game details
 date: game.released,
 // Add some random/derived tags for UI purposes if missing
 developer: game.developers?.[0]?.name,
 };
};

/**
 * Fetch generic list of games with specific params
 */
const fetchGames = async (params = '') => {
 try {
 const res = await fetch(`${BASE_URL}/games?key=${API_KEY}&${params}`);
 if (!res.ok) throw new Error('Failed to fetch games');
 const data = await res.json();
 return data.results.map(mapGameData);
 } catch (error) {
 console.error('Error fetching RAWG data:', error);
 return [];
 }
};

// ── Specific Queries ─────────────────────────────────────────────

export const getTrendingGames = async () => {
 // Get recently popular games (ordering by -added)
 // Get date range for last 6 months
 const end = new Date().toISOString().split('T')[0];
 const start = new Date();
 start.setMonth(start.getMonth() - 6);
 const startStr = start.toISOString().split('T')[0];
 
 return fetchGames(`dates=${startStr},${end}&ordering=-added&page_size=3`);
};

export const getHighlyRatedGames = async () => {
 // Replace "Recent Reviews" with highly rated games from this year
 const year = new Date().getFullYear();
 return fetchGames(`dates=${year}-01-01,${year}-12-31&ordering=-metacritic&page_size=4`);
};

export const getUpcomingGames = async () => {
 // Get upcoming games (release dates in the future)
 const start = new Date().toISOString().split('T')[0];
 const end = new Date();
 end.setFullYear(end.getFullYear() + 2); // Look ahead 2 years
 const endStr = end.toISOString().split('T')[0];
 
 return fetchGames(`dates=${start},${endStr}&ordering=released&page_size=12`);
};

export const getIndieGames = async () => {
 // Get top indie games
 return fetchGames(`genres=indie&ordering=-rating&page_size=12`);
};

export const getAllTimeTopGames = async () => {
 // Get highest Metacritic scored games of all time
 return fetchGames(`ordering=-metacritic&page_size=20`);
};

export const searchGames = async (query) => {
 return fetchGames(`search=${encodeURIComponent(query)}&page_size=5`);
};

export const getGameDetails = async (id) => {
 try {
 const res = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
 if (!res.ok) throw new Error('Failed to fetch game details');
 return await res.json();
 } catch (error) {
 console.error('Error fetching game details:', error);
 return null;
 }
};

export const getGamesByGenre = async (genreSlug) => {
 return fetchGames(`genres=${genreSlug}&ordering=-rating&page_size=6`);
};

export const getSteamAppId = async (gameId) => {
 try {
 const res = await fetch(`${BASE_URL}/games/${gameId}/stores?key=${API_KEY}`);
 if (!res.ok) return null;
 const data = await res.json();
 
 // Look for store_id === 1 (Steam)
 const steamStore = data.results?.find(s => s.store_id === 1);
 if (!steamStore || !steamStore.url) return null;
 
 // URL usually looks like https://store.steampowered.com/app/1091500/
 const match = steamStore.url.match(/app\/(\d+)/);
 return match ? match[1] : null;
 } catch (err) {
 return null;
 }
};

export const getSteamDetails = async (appId) => {
 try {
 // Uses the Vite proxy we just configured
 const res = await fetch(`/api/steam/appdetails?appids=${appId}`);
 if (!res.ok) return null;
 const data = await res.json();
 if (data[appId] && data[appId].success) {
 return data[appId].data;
 }
 return null;
 } catch (err) {
 console.error("Error fetching steam details:", err);
 return null;
 }
};

// ── New External APIs ─────────────────────────────────────────────

export const getWeeklyGiveaways = async (platform = '') => {
  try {
    let url = 'https://www.gamerpower.com/api/giveaways?type=game';
    if (platform && platform !== 'all') {
      url += `&platform=${platform}`;
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch weekly giveaways');
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map((g) => ({
      ...g,
      hdImage: g.image || g.thumbnail,
    }));
  } catch (error) {
    console.error('Error fetching weekly giveaways:', error);
    return [];
  }
};

export const getFreeGames = async (platform = 'all', sortBy = 'release-date', category = '') => {
  try {
    let url = `https://www.freetogame.com/api/games?platform=${platform}`;
    if (sortBy) url += `&sort-by=${sortBy}`;
    if (category) url += `&category=${category}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch free games');
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    // Parallel fetch high-resolution 1080p screenshots for the top spotlight games
    const topSpotlight = data.slice(0, 6);
    await Promise.all(
      topSpotlight.map(async (g) => {
        try {
          const detailRes = await fetch(`https://www.freetogame.com/api/game?id=${g.id}`);
          if (detailRes.ok) {
            const detail = await detailRes.json();
            if (detail.screenshots && detail.screenshots.length > 0) {
              g.hdImage = detail.screenshots[0].image;
              g.screenshots = detail.screenshots.map((s) => s.image);
            }
          }
        } catch (_) {
          // fallback gracefully to thumbnail
        }
      })
    );

    return data;
  } catch (error) {
    console.error('Error fetching free games:', error);
    return [];
  }
};

export const getGamingNews = async () => {
 try {
 // Using rss2json to convert IGN's RSS feed to JSON
 const rssUrl = encodeURIComponent('https://feeds.feedburner.com/ign/news');
 const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&api_key=`);
 if (!res.ok) throw new Error('Failed to fetch news');
 const data = await res.json();
 return data.items || [];
 } catch (error) {
 console.error('Error fetching news:', error);
 return [];
 }
};

export const getTopStreams = async (gameName = '') => {
  try {
    const clientId = import.meta.env?.VITE_TWITCH_CLIENT_ID;
    const token = import.meta.env?.VITE_TWITCH_APP_TOKEN;
    if (!clientId || !token) {
      if (gameName) {
        const filtered = curatedStreams.filter(s => s.game_name.toLowerCase().includes(gameName.toLowerCase()));
        return filtered.length > 0 ? filtered : curatedStreams;
      }
      return curatedStreams;
    }

    let url = 'https://api.twitch.tv/helix/streams?first=20';
    
    // If a gameName is provided, we first need to get the game ID from Twitch
    if (gameName) {
      const gameRes = await fetch(`https://api.twitch.tv/helix/games?name=${encodeURIComponent(gameName)}`, {
        headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` }
      });
      if (gameRes.ok) {
        const gameData = await gameRes.json();
        if (gameData.data.length > 0) {
          url += `&game_id=${gameData.data[0].id}`;
        }
      }
    }

    const res = await fetch(url, {
      headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch streams');
    const data = await res.json();
    return data.data && data.data.length > 0 ? data.data : curatedStreams;
  } catch (error) {
    return curatedStreams;
  }
};

export const getEsportsMatches = async () => {
  try {
    const savedCustom = localStorage.getItem('pixellon_custom_esports_matches');
    const customMatches = savedCustom ? JSON.parse(savedCustom) : [];

    const apiKey = import.meta.env?.VITE_PANDASCORE_API_KEY;
    if (!apiKey) {
      return [...customMatches, ...initialEsportsMatches];
    }
    const res = await fetch(`https://api.pandascore.co/matches/upcoming?sort=begin_at&per_page=10`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (!res.ok) throw new Error('Failed to fetch esports matches');
    const data = await res.json();
    const serverMatches = data && data.length > 0 ? data : initialEsportsMatches;
    return [...customMatches, ...serverMatches];
  } catch (error) {
    const savedCustom = localStorage.getItem('pixellon_custom_esports_matches');
    const customMatches = savedCustom ? JSON.parse(savedCustom) : [];
    return [...customMatches, ...initialEsportsMatches];
  }
};

export const saveCustomMatch = (newMatch) => {
  try {
    const saved = localStorage.getItem('pixellon_custom_esports_matches');
    const list = saved ? JSON.parse(saved) : [];
    const updated = [newMatch, ...list];
    localStorage.setItem('pixellon_custom_esports_matches', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save custom match', e);
    return [];
  }
};

export const deleteCustomMatch = (matchId) => {
  try {
    const saved = localStorage.getItem('pixellon_custom_esports_matches');
    const list = saved ? JSON.parse(saved) : [];
    const updated = list.filter((m) => m.id !== matchId);
    localStorage.setItem('pixellon_custom_esports_matches', JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete custom match', e);
    return [];
  }
};

export const getIGDBDetails = async (gameName) => {
 try {
 const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
 const token = import.meta.env.VITE_TWITCH_APP_TOKEN;
 if (!clientId || !token) {
 console.warn("IGDB API keys missing.");
 return null;
 }
 const res = await fetch('/api/igdb/games', {
 method: 'POST',
 headers: {
 'Client-ID': clientId,
 'Authorization': `Bearer ${token}`,
 'Accept': 'application/json'
 },
 body: `search "${gameName}"; fields name, storyline, summary, cover.url, involved_companies.company.name; limit 1;`
 });
 if (!res.ok) throw new Error('Failed to fetch IGDB details');
 const data = await res.json();
 return data.length > 0 ? data[0] : null;
 } catch (error) {
 console.error('Error fetching IGDB details:', error);
 return null;
 }
};

export const getSteamProfile = async (steamId) => {
 try {
 const apiKey = import.meta.env.VITE_STEAM_WEB_API_KEY;
 if (!apiKey) {
 console.warn("Steam Web API key missing.");
 return null;
 }
 const res = await fetch(`/api/steamapi/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`);
 if (!res.ok) throw new Error('Failed to fetch Steam profile');
 const data = await res.json();
 return data.response.players[0] || null;
 } catch (error) {
 console.error('Error fetching Steam profile:', error);
 return null;
 }
};

export const getSteamOwnedGames = async (steamId) => {
 try {
 const apiKey = import.meta.env.VITE_STEAM_WEB_API_KEY;
 if (!apiKey) {
 console.warn("Steam Web API key missing.");
 return [];
 }
 const res = await fetch(`/api/steamapi/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`);
 if (!res.ok) throw new Error('Failed to fetch owned games');
 const data = await res.json();
 return data.response.games || [];
 } catch (error) {
 console.error('Error fetching owned games:', error);
 return [];
 }
};
