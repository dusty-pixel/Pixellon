export default function TableOfContents({ sections }) {
  return (
    <div className="bg-[#151A24] border border-[#1E2638] rounded-xl p-4 mb-8 inline-block min-w-[250px] shadow-sm">
      <h3 className="font-display font-bold text-brand-text text-sm mb-3 border-b border-[#1E2638] pb-2">
        Contents
      </h3>
      <ul className="space-y-1.5 text-xs font-mono">
        {sections.map((section, idx) => (
          <li key={idx}>
            <a 
              href={`#${section.id}`} 
              className="text-brand-accent hover:underline hover:text-brand-accent2 block"
            >
              <span className="text-brand-muted mr-2">{idx + 1}</span>
              {section.title}
            </a>
            {section.subsections && section.subsections.length > 0 && (
              <ul className="ml-4 mt-1.5 space-y-1.5">
                {section.subsections.map((sub, subIdx) => (
                  <li key={subIdx}>
                    <a 
                      href={`#${sub.id}`} 
                      className="text-brand-muted hover:underline hover:text-brand-text block"
                    >
                      <span className="text-brand-muted/70 mr-1.5">{idx + 1}.{subIdx + 1}</span>
                      {sub.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
