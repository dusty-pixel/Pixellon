import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Loader2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { getGamesByGenre, searchGames } from '../utils/api';

const CATEGORIES = [
 { id: 'role-playing-games-rpg', title: 'Role-Playing Games' },
 { id: 'action', title: 'Action & Adventure' },
 { id: 'shooter', title: 'Shooters' },
 { id: 'strategy', title: 'Strategy & Tactics' },
];

export default function CodexHub() {
 const navigate = useNavigate();
 const [searchQuery, setSearchQuery] = useState('');
 const [searchResults, setSearchResults] = useState([]);
 const [isSearching, setIsSearching] = useState(false);
 const [categoryData, setCategoryData] = useState({});
 const [loadingCategories, setLoadingCategories] = useState(true);

 useEffect(() => {
 async function loadCategories() {
 const data = {};
 try {
 await Promise.all(
 CATEGORIES.map(async (cat) => {
 const games = await getGamesByGenre(cat.id);
 data[cat.id] = games;
 })
 );
 setCategoryData(data);
 } catch (err) {
 console.error('Failed to load codex categories', err);
 } finally {
 setLoadingCategories(false);
 }
 }
 loadCategories();
 }, []);

 useEffect(() => {
 const delayDebounceFn = setTimeout(async () => {
 if (searchQuery.length > 2) {
 setIsSearching(true);
 const results = await searchGames(searchQuery);
 setSearchResults(results);
 setIsSearching(false);
 } else {
 setSearchResults([]);
 }
 }, 500);

 return () => clearTimeout(delayDebounceFn);
 }, [searchQuery]);

 const GameGrid = ({ games }) => (
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {games.map(game => (
 <Link
 key={game.id}
 to={`/codex/${game.id}`}
 className="group block bg-surface-800 border-2 border-surface-700 hover:border-pixel-blue transition-all overflow-hidden shadow-sm hover:shadow-[4px_4px_0_var(--color-pixel-blue)]"
 >
 <div className="relative h-56 w-full overflow-hidden border-b-2 border-surface-700 group-hover:border-pixel-blue transition-colors">
 <img src={game.image} alt={game.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
 <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
 <h2 className="font-display text-2xl font-bold text-white drop-shadow-md group-hover:text-pixel-blue transition-colors">
 {game.title}
 </h2>
 </div>
 </div>
 <div className="p-4">
 <div className="flex flex-wrap gap-2 mt-2">
 <span className="text-xs bg-surface-900 text-text-muted px-2 py-1 border border-surface-700">
 {game.genre}
 </span>
 {game.developer && (
 <span className="text-xs bg-surface-900 text-text-muted px-2 py-1 border border-surface-700">
 {game.developer}
 </span>
 )}
 </div>
 </div>
 </Link>
 ))}
 </div>
 );

 return (
 <PageTransition className="mx-auto max-w-7xl px-6 py-12 lg:px-8 min-h-screen">
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-surface-700 gap-4">
 <div>
 <h1 className="flex items-center gap-3 font-display text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
 <BookOpen size={40} className="text-pixel-blue" />
 The Codex
 </h1>
 <p className="mt-2 text-lg text-text-secondary">
 The definitive API-driven encyclopedia of games.
 </p>
 </div>
 <div className="flex items-center gap-4 w-full md:w-auto">
 <div className="relative flex-1 md:w-80">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" size={18} />
 <input 
 type="text" 
 placeholder="Search for any game..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full bg-surface-800 border-2 border-deep-ink pl-10 pr-10 py-2.5 text-sm text-text-primary focus:outline-none focus:border-pixel-blue transition-colors shadow-[2px_2px_0_var(--color-deep-ink)] placeholder:text-surface-500"
 />
 {isSearching && (
 <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-pixel-blue animate-spin" size={18} />
 )}
 </div>
 </div>
 </div>

 {searchQuery.length > 2 ? (
 <section className="animate-fade-up">
 <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
 Search Results for "{searchQuery}"
 </h2>
 {searchResults.length > 0 ? (
 <GameGrid games={searchResults} />
 ) : !isSearching ? (
 <div className="py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-surface-700 bg-surface-800">
 <Search className="text-surface-600 mb-4" size={48} />
 <h3 className="text-xl font-bold text-text-primary mb-2">No games found</h3>
 <p className="text-text-secondary">Try adjusting your search terms.</p>
 </div>
 ) : null}
 </section>
 ) : loadingCategories ? (
 <div className="flex justify-center items-center py-32">
 <Loader2 className="animate-spin text-pixel-blue" size={48} />
 </div>
 ) : (
 <div className="space-y-16">
 {CATEGORIES.map(cat => (
 <section key={cat.id} className="animate-fade-up">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-2xl font-display font-bold text-text-primary">
 {cat.title}
 </h2>
 </div>
 <GameGrid games={categoryData[cat.id] || []} />
 </section>
 ))}
 </div>
 )}
 </PageTransition>
 );
}
