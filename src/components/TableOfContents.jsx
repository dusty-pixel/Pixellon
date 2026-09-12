export default function TableOfContents({ sections }) {
 return (
 <div className="bg-surface-800 border-2 border-deep-ink shadow-[2px_2px_0_var(--color-deep-ink)] p-4 mb-8 inline-block min-w-[250px]">
 <h3 className="font-display font-bold text-text-primary mb-3 border-b border-surface-700 pb-2">
 Contents
 </h3>
 <ul className="space-y-1.5 text-sm">
 {sections.map((section, idx) => (
 <li key={idx}>
 <a 
 href={`#${section.id}`} 
 className="text-pixel-blue hover:underline hover:text-signal-blue block"
 >
 <span className="text-text-muted mr-2">{idx + 1}</span>
 {section.title}
 </a>
 {section.subsections && section.subsections.length > 0 && (
 <ul className="ml-4 mt-1.5 space-y-1.5">
 {section.subsections.map((sub, subIdx) => (
 <li key={subIdx}>
 <a 
 href={`#${sub.id}`} 
 className="text-text-secondary hover:underline hover:text-pixel-blue block"
 >
 <span className="text-text-muted mr-1.5">{idx + 1}.{subIdx + 1}</span>
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
