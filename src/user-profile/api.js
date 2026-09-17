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
