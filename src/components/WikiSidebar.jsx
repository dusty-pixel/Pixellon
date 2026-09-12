import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import Infobox from './Infobox';

export default function WikiSidebar({ gameId, pages, wikiData }) {
 const [steamData, setSteamData] = useState(null);
 const [loadingSteam, setLoadingSteam] = useState(false);

 // Look for a "Steam ID" or "App ID" in the infobox data
 const steamIdField = wikiData?.infoboxData?.find(field => 
 field.label.toLowerCase().includes('steam app id') || field.label.toLowerCase() === 'app id'
 );
 const appId = steamIdField ? steamIdField.value : null;

 useEffect(() => {
 if (!appId) return;
 
 async function fetchSteamData() {
 setLoadingSteam(true);
 try {
 const res = await fetch(`https://steamspy.com/api.php?request=appdetails&appid=${appId}`);
 if (res.ok) {
 const data = await res.json();
 setSteamData(data);
 }
 } catch (err) {
 console.error("Failed to fetch SteamSpy data", err);
 } finally {
 setLoadingSteam(false);
 }
 }

 fetchSteamData();
 }, [appId]);

 const trendingPages = [
 { title: 'Shadow of the Erdtree', views: '1.2M' },
 { title: 'Messmer the Impaler', views: '850K' },
 { title: 'Scadutree Fragments', views: '640K' },
 { title: 'Rellana, Twin Moon Knight', views: '520K' },
 { title: 'Revered Spirit Ash', views: '490K' },
 ];

 return (
 <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
 
 {/* Dynamic Infobox injected from WikiData */}
 {wikiData && (
 <Infobox 
 title={wikiData.title} 
 image={wikiData.infoboxImage} 
 data={wikiData.infoboxData} 
 />
 )}

 {/* Live Steam Stats (if applicable) */}
 {appId && (
 <div className="bg-surface-800 border-2 border-signal-blue/50 shadow-[4px_4px_0_var(--color-signal-blue)] p-4 relative overflow-hidden">
 <div className="absolute top-0 right-0 p-2 opacity-10">
 <Activity size={64} />
 </div>
 <h3 className="font-display font-bold text-signal-blue text-lg mb-4 border-b border-surface-700 pb-2 flex items-center gap-2">
 <span className="relative flex h-3 w-3">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-blue opacity-75"></span>
 <span className="relative inline-flex rounded-full h-3 w-3 bg-signal-blue"></span>
 </span>
 Live PC Stats
 </h3>
 
 {loadingSteam ? (
 <div className="animate-pulse space-y-3">
 <div className="h-4 bg-surface-700 rounded w-3/4"></div>
 <div className="h-4 bg-surface-700 rounded w-1/2"></div>
 </div>
 ) : steamData ? (
 <div className="grid grid-cols-2 gap-4">
 <div>
 <div className="text-xl font-bold text-white">{steamData.ccu?.toLocaleString() || 'N/A'}</div>
 <div className="text-[10px] text-text-muted uppercase font-bold">Players Right Now</div>
 </div>
 <div>
 <div className="text-xl font-bold text-white">{steamData.positive ? Math.round((steamData.positive / (steamData.positive + steamData.negative)) * 100) : 'N/A'}%</div>
 <div className="text-[10px] text-text-muted uppercase font-bold">Positive Reviews</div>
 </div>
 <div className="col-span-2 mt-2">
 <div className="text-sm font-bold text-pixel-blue">{steamData.owners || 'N/A'}</div>
 <div className="text-[10px] text-text-muted uppercase font-bold">Estimated Owners</div>
 </div>
 </div>
 ) : (
 <p className="text-xs text-text-muted">Stats currently unavailable.</p>
 )}
 </div>
 )}

 {/* Trending Pages */}
 <div className="bg-surface-800 rounded-2xl border border-surface-700 shadow-lg p-4">
 <h3 className="font-display font-bold text-text-primary text-lg mb-4 border-b border-surface-700 pb-2">
 Trending Pages
 </h3>
 <ul className="space-y-3">
 {trendingPages.map((page, i) => (
 <li key={i} className="flex items-center justify-between group cursor-pointer">
 <div className="flex items-center gap-3 overflow-hidden">
 <span className="text-text-muted font-bold text-sm">{i + 1}</span>
 <span className="text-sm font-medium text-text-secondary group-hover:text-pixel-blue truncate">
 {page.title}
 </span>
 </div>
 <span className="text-xs text-text-muted shrink-0 ml-2">
 {page.views}
 </span>
 </li>
 ))}
 </ul>
 </div>

 {/* Twitch Streams */}
 {wikiData?.twitchStreams?.length > 0 && (
 <div className="bg-surface-800 border-2 border-purple-500/50 shadow-[4px_4px_0_rgba(168,85,247,0.5)] p-4">
 <h3 className="font-display font-bold text-purple-400 text-lg mb-4 border-b border-surface-700 pb-2 flex items-center gap-2">
 Live on Twitch
 </h3>
 <ul className="space-y-4">
 {wikiData.twitchStreams.slice(0, 3).map((stream) => (
 <li key={stream.id} className="group">
 <a 
 href={`https://twitch.tv/${stream.user_login}`} 
 target="_blank" 
 rel="noopener noreferrer"
 className="flex gap-3"
 >
 <div className="relative w-20 shrink-0 aspect-video overflow-hidden border border-surface-600">
 <img 
 src={stream.thumbnail_url.replace('{width}', 160).replace('{height}', 90)} 
 alt={stream.user_name}
 className="w-full h-full object-cover transition-transform group-hover:scale-110"
 />
 <div className="absolute bottom-1 right-1 bg-red-600 text-[8px] font-bold text-white px-1 rounded shadow-sm">
 LIVE
 </div>
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-sm font-bold text-text-primary truncate group-hover:text-purple-400 transition-colors">
 {stream.user_name}
 </p>
 <p className="text-[10px] text-text-muted mt-0.5 flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
 {new Intl.NumberFormat().format(stream.viewer_count)} viewers
 </p>
 </div>
 </a>
 </li>
 ))}
 </ul>
 </div>
 )}

 {/* Community Stats */}
 <div className="bg-surface-800 rounded-2xl border border-surface-700 shadow-lg p-4">
 <h3 className="font-display font-bold text-text-primary text-lg mb-4 border-b border-surface-700 pb-2">
 Wiki Activity
 </h3>
 <div className="grid grid-cols-2 gap-4 text-center">
 <div>
 <div className="text-2xl font-bold text-pixel-blue">{Object.keys(pages || {}).length}</div>
 <div className="text-xs text-text-muted uppercase tracking-wider font-semibold mt-1">Pages</div>
 </div>
 <div>
 <div className="text-2xl font-bold text-signal-blue">24.5K</div>
 <div className="text-xs text-text-muted uppercase tracking-wider font-semibold mt-1">Images</div>
 </div>
 </div>
 </div>
 </aside>
 );
}
