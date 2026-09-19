import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCodex } from '../context/CodexContext';
import WikiNavbar from '../components/WikiNavbar';
import Infobox from '../components/Infobox';
import WikiSidebar from '../components/WikiSidebar';
import PageTransition from '../components/PageTransition';
import { getGameDetails, getSteamAppId, getSteamDetails, getIGDBDetails, getTopStreams } from '../utils/api';
import { formatINR } from '../utils/currency';
import { Trash2, Edit3, Plus, Save, X, Eye, Loader2 } from 'lucide-react';

export default function GameWiki() {
 const { gameId, pageId = 'home' } = useParams();
 const { customPages, addPage, deletePage, updatePage } = useCodex();
 const navigate = useNavigate();

 const [loading, setLoading] = useState(true);
 const [wikiData, setWikiData] = useState(null);

 const [isEditing, setIsEditing] = useState(false);
 const [isAddingPage, setIsAddingPage] = useState(false);
 const [editTitle, setEditTitle] = useState('');
 const [editContent, setEditContent] = useState('');
 const [previewMode, setPreviewMode] = useState(false);

 const formatSteamReqs = (htmlString) => {
 if (!htmlString) return '';
 return htmlString
 .replace(/<br\s*\/?>/gi, '\n')
 .replace(/<li[^>]*>/gi, '\n- ')
 .replace(/<[^>]+>/g, '') 
 .replace(/\n\s*\n/g, '\n') 
 .trim();
 };

 useEffect(() => {
 async function loadGame() {
 setLoading(true);
 const details = await getGameDetails(gameId);
 if (details) {
 
 let steamPrice = null;
 let steamReqsFormatted = '';
 let controllerSupport = null;

 // Fetch parallel data
 const [appId, igdbData, twitchStreams] = await Promise.all([
 getSteamAppId(gameId),
 getIGDBDetails(details.name),
 getTopStreams(details.name)
 ]);

 if (appId) {
 const steamDetails = await getSteamDetails(appId);
 if (steamDetails) {
 if (steamDetails.price_overview) {
 steamPrice = formatINR(steamDetails.price_overview.final_formatted);
 } else if (steamDetails.is_free) {
 steamPrice = "Free to Play";
 }
 
 if (steamDetails.pc_requirements) {
 if (steamDetails.pc_requirements.minimum) {
 steamReqsFormatted += `\n### Minimum Requirements\n${formatSteamReqs(steamDetails.pc_requirements.minimum)}\n`;
 }
 if (steamDetails.pc_requirements.recommended) {
 steamReqsFormatted += `\n### Recommended Requirements\n${formatSteamReqs(steamDetails.pc_requirements.recommended)}\n`;
 }
 }
 if (steamDetails.controller_support === 'full') {
 controllerSupport = 'Full Controller Support';
 }
 }
 }

 const infoData = [
 { label: 'Developer', value: details.developers?.map(d => d.name).join(', ') || 'Unknown' },
 { label: 'Publisher', value: details.publishers?.map(p => p.name).join(', ') || 'Unknown' },
 { label: 'Release Date', value: details.released || 'TBA' },
 ];

 if (details.playtime) {
 infoData.push({ label: 'Avg Playtime', value: `${details.playtime} Hours` });
 }
 if (details.esrb_rating) {
 infoData.push({ label: 'ESRB Rating', value: details.esrb_rating.name });
 }

 infoData.push(
 { label: 'Genre', value: details.genres?.map(g => g.name).join(', ') || 'Unknown' },
 { label: 'Metacritic', value: details.metacritic ? details.metacritic.toString() : 'N/A' }
 );

 if (steamPrice) {
 infoData.push({ label: 'Steam Price', value: steamPrice });
 }
 if (controllerSupport) {
 infoData.push({ label: 'Controller', value: controllerSupport });
 }
 if (details.website) {
 infoData.push({ label: 'Website', value: details.website, type: 'link' });
 }
 if (details.reddit_url) {
 infoData.push({ label: 'Reddit', value: details.reddit_url, type: 'link' });
 }
 
 if (details.tags && details.tags.length > 0) {
 const validTags = details.tags
 .filter(t => t.language === 'eng')
 .map(t => t.name)
 .slice(0, 6);
 if (validTags.length > 0) {
 infoData.push({ label: 'Tags', value: validTags, type: 'tags' });
 }
 }

 if (appId) {
 infoData.push({ label: 'Steam App ID', value: appId.toString() });
 }
 
 if (igdbData && igdbData.involved_companies) {
 const companies = igdbData.involved_companies.map(c => c.company.name).join(', ');
 infoData.push({ label: 'IGDB Companies', value: companies });
 }

 // Build base wiki data
 let contentStr = details.description_raw 
 ? `# Overview\n\n${details.description_raw}` 
 : `# Welcome to the ${details.name} Codex!\n\nInformation is currently limited. Be the first to add to this wiki!`;
 
 if (igdbData && igdbData.storyline) {
 contentStr += `\n\n## Storyline (IGDB)\n\n${igdbData.storyline}`;
 }
 
 if (steamReqsFormatted) {
 contentStr += `\n\n## PC System Requirements\n${steamReqsFormatted}`;
 }

 const baseData = {
 id: gameId,
 title: details.name,
 banner: details.background_image_additional || details.background_image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
 infoboxImage: details.background_image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
 infoboxData: infoData,
 igdbData,
 twitchStreams,
 pages: {
 'home': {
 title: 'Overview',
 content: contentStr
 }
 }
 };
 setWikiData(baseData);
 } else {
 setWikiData(null);
 }
 setLoading(false);
 }
 loadGame();
 }, [gameId]);

 // Merge base pages with custom user pages
 const allPages = wikiData ? { ...wikiData.pages, ...(customPages[gameId]?.pages || {}) } : {};
 const currentPage = allPages[pageId];

 useEffect(() => {
 if (currentPage && !isAddingPage) {
 setEditTitle(currentPage.title);
 setEditContent(currentPage.content);
 }
 }, [pageId, currentPage, isAddingPage]);

 if (loading) {
 return (
 <PageTransition className="min-h-screen bg-surface-900 flex items-center justify-center flex-col gap-4">
 <Loader2 className="animate-spin text-pixel-blue" size={48} />
 <p className="text-text-secondary animate-pulse font-bold">Decoding the Codex...</p>
 </PageTransition>
 );
 }

 if (!wikiData) {
 return (
 <PageTransition className="min-h-screen bg-surface-900 flex items-center justify-center flex-col gap-4">
 <h1 className="font-display text-4xl text-text-primary">Codex Not Found</h1>
 <p className="text-text-secondary">Could not find game data in the database.</p>
 <button onClick={() => navigate('/codex')} className="text-pixel-blue hover:underline">Return to Hub</button>
 </PageTransition>
 );
 }

 const handleDeletePage = () => {
 if (pageId === 'home') return; // Cannot delete home page
 if (confirm(`Are you sure you want to delete the ${currentPage.title} page?`)) {
 deletePage(gameId, pageId);
 navigate(`/codex/${gameId}`);
 }
 };

 const handleSavePage = (e) => {
 e.preventDefault();
 if (!editTitle) return;

 if (isAddingPage) {
 const newId = editTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
 addPage(gameId, newId, { title: editTitle, content: editContent });
 setIsAddingPage(false);
 navigate(`/codex/${gameId}/${newId}`);
 } else {
 updatePage(gameId, pageId, editContent);
 setIsEditing(false);
 }
 setPreviewMode(false);
 };

 const startAddingNewPage = () => {
 setIsAddingPage(true);
 setIsEditing(false);
 setEditTitle('');
 setEditContent('');
 setPreviewMode(false);
 };

 const cancelEdit = () => {
 setIsAddingPage(false);
 setIsEditing(false);
 setPreviewMode(false);
 if (currentPage) {
 setEditTitle(currentPage.title);
 setEditContent(currentPage.content);
 }
 };

 const showEditor = isEditing || isAddingPage;

  return (
    <PageTransition className="min-h-screen text-brand-text">
      {/* Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden group">
        <img 
          src={wikiData.banner} 
          alt={`${wikiData.title} Banner`} 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-6 flex justify-between items-end">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
            {wikiData.title}
          </h1>
        </div>
      </div>

      <WikiNavbar gameId={gameId} gameName={wikiData.title} pages={allPages} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-brand-surface rounded-xl border border-surface-700 shadow-sm p-6 sm:p-8 relative group/page hover:border-brand-primary/50 transition-colors">
            
            {/* Context Actions */}
            {!showEditor && (
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/page:opacity-100 transition-opacity z-10 bg-surface-900 p-1.5 rounded-lg border border-surface-700 shadow-lg">
                <button 
                  onClick={startAddingNewPage}
                  className="flex items-center gap-1 hover:bg-brand-surface text-brand-muted hover:text-brand-accent px-2 py-1 text-xs font-mono font-bold transition-colors cursor-pointer"
                  title="Create New Page"
                >
                  <Plus size={14} /> New
                </button>
                {currentPage && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1 hover:bg-brand-surface text-brand-muted hover:text-brand-accent px-2 py-1 text-xs font-mono font-bold transition-colors cursor-pointer"
                    title="Edit Current Page"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                )}
                {pageId !== 'home' && currentPage && (
                  <button 
                    onClick={handleDeletePage}
                    className="flex items-center gap-1 hover:bg-brand-surface text-brand-muted hover:text-red-400 px-2 py-1 text-xs font-mono font-bold transition-colors cursor-pointer"
                    title="Delete Current Page"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                )}
              </div>
            )}
            
            {/* Editor Mode */}
            {showEditor ? (
              <form onSubmit={handleSavePage} className="animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between border-b border-surface-700 pb-4 mb-6">
                  <h3 className="font-display text-2xl font-bold text-brand-text">
                    {isAddingPage ? 'Create New Page' : 'Editing Page'}
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setPreviewMode(!previewMode)}
                      className="flex items-center gap-1 rounded-lg bg-surface-900 hover:bg-surface-800 text-brand-text border border-surface-700 px-3 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer"
                    >
                      {previewMode ? <Edit3 size={14} /> : <Eye size={14} />}
                      {previewMode ? 'Edit' : 'Preview'}
                    </button>
                    <button 
                      type="submit" 
                      className="flex items-center gap-1 rounded-lg bg-brand-primary hover:bg-brand-primary/85 text-white px-3.5 py-1.5 text-xs font-mono font-bold shadow-[0_0_12px_rgba(37,99,235,0.3)] transition-colors cursor-pointer"
                    >
                      <Save size={14} /> Save
                    </button>
                    <button 
                      type="button" 
                      onClick={cancelEdit}
                      className="flex items-center gap-1 rounded-lg hover:bg-surface-900 text-brand-muted hover:text-brand-text px-3 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </div>

                {!previewMode ? (
                  <div className="space-y-4">
                    {isAddingPage && (
                      <div>
                        <label className="block text-xs font-mono font-bold text-brand-muted mb-1">Page Title</label>
                        <input 
                          type="text" 
                          required 
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full rounded-lg bg-surface-900 border border-surface-700 px-4 py-2 text-sm text-brand-text focus:border-brand-primary outline-none"
                          placeholder="e.g. Boss Guides"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-mono font-bold text-brand-muted mb-1 flex justify-between">
                        <span>Markdown Content</span>
                        <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noreferrer" className="text-brand-accent hover:underline font-normal text-xs">Formatting Guide</a>
                      </label>
                      <textarea 
                        required 
                        rows={16}
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        className="w-full rounded-lg bg-surface-900 border border-surface-700 px-4 py-3 text-brand-text focus:border-brand-primary outline-none font-mono text-sm leading-relaxed"
                        placeholder="# Heading 1&#10;**Bold text**&#10;* List item&#10;[Link](url)"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none dark:prose-invert prose-headings:font-display prose-a:text-brand-accent hover:prose-a:text-brand-accent2 prose-img:rounded-xl prose-img:border prose-img:border-surface-700 prose-hr:border-surface-700 bg-surface-900 p-6 rounded-xl border border-surface-700 min-h-[400px]">
                    <h1 className="border-b border-surface-700 pb-2 mb-6 font-display text-brand-text">{editTitle || 'Untitled'}</h1>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {editContent || '*No content yet.*'}
                    </ReactMarkdown>
                  </div>
                )}
              </form>
            ) : currentPage ? (
              /* Viewer Mode */
              <div className="prose max-w-none dark:prose-invert prose-headings:font-display prose-headings:text-brand-text prose-h1:text-4xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-surface-700 prose-h2:pb-2 prose-h3:text-xl prose-a:text-brand-accent hover:prose-a:text-brand-accent2 prose-strong:text-brand-text prose-th:bg-surface-900 prose-th:border-surface-700 prose-td:border-surface-700 prose-img:rounded-xl prose-img:border prose-img:border-surface-700 prose-hr:border-surface-700">
                <h1 className="mb-8 font-display text-brand-text">{currentPage.title}</h1>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentPage.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-900 border border-surface-700 mb-4">
                  <Edit3 className="text-brand-muted" size={24} />
                </div>
                <h2 className="text-2xl font-display font-bold text-brand-text mb-2">Page Not Found</h2>
                <p className="text-brand-muted max-w-md mx-auto mb-6 text-sm">This page doesn't exist yet, or it was deleted. You can create it now to start building the Codex.</p>
                <button 
                  onClick={startAddingNewPage}
                  className="bg-brand-primary hover:bg-brand-primary/85 text-white px-6 py-2.5 rounded-xl font-mono text-xs font-bold inline-flex items-center gap-2 shadow-[0_0_12px_rgba(37,99,235,0.3)] cursor-pointer"
                >
                  <Plus size={16} /> Create "{pageId}"
                </button>
              </div>
            )}

          </div>
        </div>

        <WikiSidebar gameId={gameId} pages={allPages} wikiData={wikiData} />
        
      </div>
    </PageTransition>
  );
}
