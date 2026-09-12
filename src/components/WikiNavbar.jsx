import { Link } from 'react-router-dom';

export default function WikiNavbar({ gameId, gameName, pages = {} }) {
  const pageKeys = Object.keys(pages);

  return (
    <div className="border-b border-[#1E2638] bg-[#0B0F17]/95 backdrop-blur-md sticky top-[61px] z-40 shadow-sm w-full">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex h-12 items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          <div className="font-display font-bold text-brand-accent shrink-0 flex items-center gap-2">
            <span className="h-2 w-2 rounded-none bg-brand-primary" />
            {gameName} Wiki
          </div>
          <div className="h-4 w-px bg-[#1E2638] shrink-0"></div>
          <nav className="flex items-center gap-6">
            {pageKeys.map((key) => (
              <Link
                key={key}
                to={`/codex/${gameId}/${key}`}
                className="text-sm font-medium text-brand-muted transition-colors hover:text-brand-text"
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
