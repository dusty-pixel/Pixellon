import { useState, useEffect } from 'react'
import PageTransition from '../components/PageTransition'
import SectionHeader from '../components/SectionHeader'

export default function Deals() {
 const [deals, setDeals] = useState([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState(null)

 useEffect(() => {
 async function fetchDeals() {
 try {
 const res = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1&sortBy=DealRating')
 if (!res.ok) throw new Error('Failed to fetch deals')
 const data = await res.json()
 // CheapShark API returns 60 deals by default, let's take top 24
 setDeals(data.slice(0, 24))
 } catch (err) {
 setError(err.message)
 } finally {
 setLoading(false)
 }
 }

 fetchDeals()
 }, [])

 return (
 <PageTransition className="mx-auto max-w-7xl px-6 py-10 space-y-10">
 <section id="deals-header" className="animate-fade-up">
 <h1 className="font-display text-4xl font-bold tracking-tight text-text-primary">
 Real-Time Deals
 </h1>
 <p className="mt-2 text-base text-text-secondary">
 Live PC game deals powered by CheapShark.
 </p>
 </section>

 {loading && (
 <div className="flex justify-center py-20">
 <div className="h-8 w-8 animate-spin rounded-full border-4 border-surface-700 border-t-pixel-blue"></div>
 </div>
 )}

 {error && (
 <div className="rounded-none border-2 border-red-900 bg-red-900/20 px-6 py-4 text-center text-red-200">
 Error: {error}
 </div>
 )}

 {!loading && !error && (
 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
 {deals.map((deal) => (
 <a
 key={deal.dealID}
 href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
 target="_blank"
 rel="noopener noreferrer"
 className="group flex flex-col overflow-hidden rounded-2xl border border-surface-700 shadow-lg bg-surface-800 transition-all hover:border-pixel-blue hover:bg-surface-800"
 >
 <div className="relative aspect-[16/9] overflow-hidden bg-surface-900">
 <img
 src={deal.thumb}
 alt={deal.title}
 className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
 loading="lazy"
 />
 <div className="absolute right-2 top-2 rounded bg-signal-blue px-2 py-1 text-xs font-bold text-surface-950 shadow-lg">
 -{Math.round(deal.savings)}%
 </div>
 </div>
 
 <div className="flex flex-1 flex-col justify-between p-4">
 <h3 className="mb-2 font-display text-sm font-bold text-text-primary group-hover:text-pixel-blue line-clamp-2">
 {deal.title}
 </h3>
 
 <div className="flex items-end justify-between mt-auto">
 <div className="flex flex-col">
 <span className="text-xs text-text-muted line-through">${deal.normalPrice}</span>
 <span className="text-lg font-bold text-signal-blue">${deal.salePrice}</span>
 </div>
 <span className="text-xs font-medium text-text-secondary group-hover:text-white transition-colors">
 View Deal →
 </span>
 </div>
 </div>
 </a>
 ))}
 </div>
 )}
 </PageTransition>
 )
}
