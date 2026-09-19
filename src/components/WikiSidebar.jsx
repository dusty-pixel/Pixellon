import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import Infobox from './Infobox';

export default function WikiSidebar({ gameId, pages, wikiData }) {
  const [steamData, setSteamData] = useState(null);
  const [loadingSteam, setLoadingSteam] = useState(false);

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

      {/* Live Steam Stats */}
      {appId && (
        <div className="bg-brand-surface border border-brand-primary/50 rounded-xl p-4 relative overflow-hidden shadow-[0_0_16px_rgba(37,99,235,0.2)]">
          <div className="absolute top-0 right-0 p-2 opacity-10 text-brand-primary">
            <Activity size={64} />
          </div>
          <h3 className="font-display font-bold text-brand-accent text-base mb-4 border-b border-surface-700 pb-2 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-accent"></span>
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
                <div className="text-xl font-bold font-mono text-brand-text">{steamData.ccu?.toLocaleString() || 'N/A'}</div>
                <div className="text-[10px] text-brand-muted uppercase font-mono font-bold">Players Right Now</div>
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-brand-text">{steamData.positive ? Math.round((steamData.positive / (steamData.positive + steamData.negative)) * 100) : 'N/A'}%</div>
                <div className="text-[10px] text-brand-muted uppercase font-mono font-bold">Positive Reviews</div>
              </div>
              <div className="col-span-2 mt-2">
                <div className="text-sm font-bold font-mono text-brand-accent">{steamData.owners || 'N/A'}</div>
                <div className="text-[10px] text-brand-muted uppercase font-mono font-bold">Estimated Owners</div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-brand-muted">Stats currently unavailable.</p>
          )}
        </div>
      )}

      {/* Trending Pages */}
      <div className="bg-brand-surface rounded-xl border border-surface-700 shadow-lg p-4">
        <h3 className="font-display font-bold text-brand-text text-base mb-4 border-b border-surface-700 pb-2">
          Trending Pages
        </h3>
        <ul className="space-y-3">
          {trendingPages.map((page, i) => (
            <li key={i} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="text-brand-muted font-mono font-bold text-xs">{i + 1}</span>
                <span className="text-sm font-medium text-brand-muted group-hover:text-brand-accent transition-colors truncate">
                  {page.title}
                </span>
              </div>
              <span className="text-xs font-mono text-brand-muted shrink-0 ml-2">
                {page.views}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Community Stats */}
      <div className="bg-brand-surface rounded-xl border border-surface-700 shadow-lg p-4">
        <h3 className="font-display font-bold text-brand-text text-base mb-4 border-b border-surface-700 pb-2">
          Wiki Activity
        </h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold font-mono text-brand-primary">{Object.keys(pages || {}).length}</div>
            <div className="text-xs text-brand-muted uppercase tracking-wider font-mono mt-1">Pages</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-brand-accent">24.5K</div>
            <div className="text-xs text-brand-muted uppercase tracking-wider font-mono mt-1">Images</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
