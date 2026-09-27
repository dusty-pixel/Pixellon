/**
 * Vault Price Matrix — CheapShark offers + historical low.
 * Renders nothing when no deal data is available.
 */
export default function DealsPanel({ deals }) {
  if (!deals?.deals?.length) return null

  return (
    <section className="mt-6 rounded-xl border border-surface-700 bg-brand-surface p-6 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-brand-text">Price Matrix</h2>
        <span className="font-mono text-[10px] uppercase tracking-widest text-brand-muted">
          via CheapShark
        </span>
      </div>

      {deals.historicalLow != null && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
            Historical low
          </span>
          <span className="font-mono text-sm font-bold text-emerald-300">
            ${deals.historicalLow.toFixed(2)}
            {deals.historicalLowDate && (
              <span className="ml-2 text-[11px] font-medium text-emerald-400/70">
                on {deals.historicalLowDate}
              </span>
            )}
          </span>
        </div>
      )}

      <ul className="divide-y divide-surface-700">
        {deals.deals.map((d, i) => (
          <li key={`${d.store}-${i}`} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-text">{d.store}</p>
              <p className="font-mono text-[11px] text-brand-muted">
                <span className="line-through">${d.retail.toFixed(2)}</span>
                <span className="ml-2 font-bold text-emerald-400">−{Math.round(d.savings)}%</span>
              </p>
            </div>
            <span className="font-mono text-base font-bold text-brand-accent">
              ${d.price.toFixed(2)}
            </span>
            <a
              href={d.url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-lg border border-brand-primary/50 bg-brand-primary/10 px-3 py-1.5 font-mono text-xs font-bold text-brand-accent transition-colors hover:bg-brand-primary/20"
            >
              Get deal →
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 font-mono text-[10px] text-brand-muted">
        Prices in USD via CheapShark. Checkout completes on the retailer's store.
      </p>
    </section>
  )
}
