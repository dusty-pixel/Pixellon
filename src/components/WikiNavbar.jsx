import { Link } from 'react-router-dom';

export default function WikiNavbar({ gameId, gameName, pages = {} }) {
 const pageKeys = Object.keys(pages);

 return (
 <div className="border-b border-surface-700 bg-surface-800 sticky top-[65px] z-40 shadow-sm">
 <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div className="flex h-12 items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
 <div className="font-display font-bold text-pixel-blue shrink-0">
 {gameName} Wiki
 </div>
 <div className="h-4 w-px bg-surface-700/50 shrink-0"></div>
 <nav className="flex items-center gap-6">
 {pageKeys.map((key) => (
 <Link
 key={key}
 to={`/codex/${gameId}/${key}`}
 className="text-sm font-medium text-text-secondary transition-colors hover:text-pixel-blue"
 >
 {pages[key].title}
 </Link>
 ))}
 </nav>
 </div>
 </div>
 </div>
 );
}
