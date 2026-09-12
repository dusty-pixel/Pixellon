export default function Infobox({ title, image, data }) {
 return (
 <aside className="w-full bg-surface-800 rounded-2xl border border-surface-700 shadow-lg overflow-hidden shrink-0 mb-6">
 <div className="bg-surface-900 border-b border-surface-700 px-4 py-3">
 <h2 className="font-display text-lg font-bold text-center text-text-primary">
 {title}
 </h2>
 </div>
 
 {image && (
 <div className="p-3 border-b border-surface-700 bg-surface-950">
 <div className="relative aspect-[3/4] w-full overflow-hidden border-2 border-deep-ink shadow-[2px_2px_0_var(--color-deep-ink)]">
 <img src={image} alt={title} className="h-full w-full object-cover" />
 </div>
 </div>
 )}

 <div className="p-0">
 <table className="w-full text-sm">
 <tbody>
 {data.map((item, i) => (
 <tr key={i} className="border-b border-surface-700 last:border-0">
 <th className="px-4 py-3 text-left font-semibold text-text-secondary align-top w-1/3 bg-surface-900">
 {item.label}
 </th>
 <td className="px-4 py-3 text-text-primary align-top break-words">
 {item.type === 'link' && item.value ? (
 <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-pixel-blue hover:text-signal-blue underline break-all">
 {item.label === 'Website' ? 'Official Site' : item.value}
 </a>
 ) : item.type === 'tags' && Array.isArray(item.value) ? (
 <div className="flex flex-wrap gap-1.5">
 {item.value.map((tag, idx) => (
 <span key={idx} className="bg-surface-700/50 text-text-secondary text-xs px-2 py-0.5 rounded border border-surface-600">
 {tag}
 </span>
 ))}
 </div>
 ) : (
 item.value
 )}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </aside>
 );
}
