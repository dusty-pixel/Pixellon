import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, Loader2, ExternalLink, Calendar } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { getGamingNews } from '../utils/api'

export default function News() {
 const [articles, setArticles] = useState([])
 const [loading, setLoading] = useState(true)

 useEffect(() => {
 async function fetchData() {
 const data = await getGamingNews()
 setArticles(data)
 setLoading(false)
 }
 fetchData()
 }, [])

 const formatDate = (dateString) => {
 const options = { year: 'numeric', month: 'short', day: 'numeric' }
 return new Date(dateString).toLocaleDateString(undefined, options)
 }

 return (
 <PageTransition>
 <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
 <header className="mb-10 flex items-center justify-between border-b border-surface-700 pb-6">
 <div>
 <div className="mb-2 inline-flex items-center gap-2 text-pixel-blue">
 <Newspaper className="h-5 w-5" />
 <span className="text-sm font-semibold uppercase tracking-widest">The Daily Feed</span>
 </div>
 <h1 className="font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
 Gaming News
 </h1>
 </div>
 </header>

 {loading ? (
 <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
 <Loader2 className="h-10 w-10 animate-spin text-pixel-blue" />
 <p className="text-text-secondary">Loading latest news...</p>
 </div>
 ) : (
 <div className="grid gap-6">
 {articles.map((article, i) => (
 <motion.article
 key={article.guid || i}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: i * 0.05 }}
 className="group relative flex flex-col gap-6 rounded-xl border border-surface-700 bg-surface-800 p-4 transition-all hover:border-pixel-blue hover:bg-surface-800 sm:flex-row"
 >
 {/* Thumbnail */}
 {(article.enclosure?.link || article.thumbnail) && (
 <div className="relative aspect-video w-full flex-shrink-0 overflow-hidden rounded-lg sm:w-64 sm:aspect-[4/3]">
 <img
 src={article.enclosure?.link || article.thumbnail}
 alt={article.title}
 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
 loading="lazy"
 />
 </div>
 )}
 
 {/* Content */}
 <div className="flex flex-1 flex-col justify-center">
 <div className="mb-3 flex flex-wrap items-center gap-4 text-xs font-medium text-text-muted">
 <span className="flex items-center gap-1.5 rounded-full bg-surface-700/50 px-2.5 py-1">
 <Calendar className="h-3.5 w-3.5" />
 {formatDate(article.pubDate)}
 </span>
 {article.author && <span>By {article.author}</span>}
 </div>
 
 <h2 className="mb-3 font-display text-xl font-bold text-text-primary transition-colors group-hover:text-pixel-blue lg:text-2xl">
 <a href={article.link} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
 {article.title}
 </a>
 </h2>
 
 {/* description might have HTML from RSS, we'll strip or limit it. rss2json gives a snippet in some fields, or we just render text */}
 <div 
 className="mb-4 line-clamp-3 text-sm leading-relaxed text-text-secondary"
 dangerouslySetInnerHTML={{ __html: article.description }} 
 />

 <div className="mt-auto flex items-center text-sm font-semibold text-pixel-blue opacity-0 transition-opacity group-hover:opacity-100">
 Read Full Article <ExternalLink className="ml-1 h-4 w-4" />
 </div>
 </div>
 </motion.article>
 ))}
 </div>
 )}
 </div>
 </PageTransition>
 )
}
