export default function Infobox({ title, image, data }) {
  return (
    <aside className="w-full bg-[#151A24] rounded-xl border border-[#1E2638] shadow-lg overflow-hidden shrink-0 mb-6">
      <div className="bg-[#0B0F17] border-b border-[#1E2638] px-4 py-3">
        <h2 className="font-display text-lg font-bold text-center text-brand-text">
          {title}
        </h2>
      </div>
      
      {image && (
        <div className="p-3 border-b border-[#1E2638] bg-[#0B0F17]">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-[#1E2638]">
            <img src={image} alt={title} className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      <div className="p-0">
        <table className="w-full text-sm">
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b border-[#1E2638] last:border-0">
                <th className="px-4 py-2.5 text-left font-mono text-xs font-semibold text-brand-muted align-top w-1/3 bg-[#10151F]">
                  {item.label}
                </th>
                <td className="px-4 py-2.5 text-brand-text text-xs sm:text-sm align-top break-words">
                  {item.type === 'link' && item.value ? (
                    <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:text-brand-accent2 underline break-all">
                      {item.label === 'Website' ? 'Official Site' : item.value}
                    </a>
                  ) : item.type === 'tags' && Array.isArray(item.value) ? (
                    <div className="flex flex-wrap gap-1.5">
                      {item.value.map((tag, idx) => (
                        <span key={idx} className="bg-[#0B0F17] text-brand-accent2 font-mono text-[11px] px-2 py-0.5 rounded border border-[#1E2638]">
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
