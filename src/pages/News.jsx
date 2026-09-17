import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, Loader2, ExternalLink, Calendar } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { PixelPatternBg, PixelCross } from '../components/BrandDecorations'
import { getGamingNews } from '../utils/api'
import { isWebhookConfigured, sendGameUpdateToDiscord } from '../utils/discordWebhook'
import DiscordWebhookModal from '../components/DiscordWebhookModal'
import ToastNotification from '../components/ToastNotification'

export default function News() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [sharingGuid, setSharingGuid] = useState(null)
  const [isDiscordModalOpen, setIsDiscordModalOpen] = useState(false)
  const [toast, setToast] = useState(null)

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

  const showToast = (type, title, message) => {
    setToast({ type, title, message })
    setTimeout(() => {
      setToast(null)
    }, 4500)
  }

  const handleShareToDiscord = async (article, e) => {
    e.stopPropagation()
    if (!isWebhookConfigured()) {
      setIsDiscordModalOpen(true)
      return
    }

    const key = article.guid || article.link
    setSharingGuid(key)
    try {
      await sendGameUpdateToDiscord({
        title: article.title,
        link: article.link,
        description: article.description,
        thumbnail: article.enclosure?.link || article.thumbnail,
        pubDate: formatDate(article.pubDate),
      })
      showToast('success', 'Posted to Discord!', `"${article.title}" sent to your Discord channel.`)
    } catch (err) {
      showToast('error', 'Discord Error', err.message || 'Failed to post news update.')
    } finally {
      setSharingGuid(null)
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl border border-[#1E2638] bg-[#151A24] p-8 sm:p-10">
          <PixelPatternBg />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-brand-accent">
                <Newspaper className="h-5 w-5" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest">
                  The Daily Feed • Pixellon Dispatch
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-text">
                Gaming News & Updates
              </h1>
              <p className="mt-1 text-sm text-brand-muted">
                Real-time updates, industry insights, and breaking headlines.
              </p>
            </div>
            <div className="hidden sm:block">
              <PixelCross size={24} />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            <p className="text-sm font-mono text-brand-muted">Loading latest news...</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {articles.map((article, i) => (
              <motion.article
                key={article.guid || i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group relative flex flex-col gap-6 rounded-xl border border-[#1E2638] bg-[#151A24] p-5 transition-all hover:border-brand-primary hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] sm:flex-row"
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
                  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-brand-muted">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded bg-[#0B0F17] px-2.5 py-1 border border-[#1E2638]">
                        <Calendar className="h-3.5 w-3.5 text-brand-accent" />
                        {formatDate(article.pubDate)}
                      </span>
                      {article.author && <span>By {article.author}</span>}
                    </div>

                    {/* Discord Share Button */}
                    <button
                      type="button"
                      onClick={(e) => handleShareToDiscord(article, e)}
                      disabled={sharingGuid === (article.guid || article.link)}
                      title="Post game update to Discord"
                      className="relative z-10 inline-flex items-center gap-1.5 rounded-lg border border-[#5865F2]/40 bg-[#5865F2]/15 px-2.5 py-1 text-[11px] font-mono text-[#8a94fd] hover:bg-[#5865F2] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                    >
                      {sharingGuid === (article.guid || article.link) ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                      )}
                      <span>Post to Discord</span>
                    </button>
                  </div>

                  <h2 className="mb-2 font-display text-xl font-bold text-brand-text transition-colors group-hover:text-brand-accent lg:text-2xl line-clamp-2">
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h2>

                  <div
                    className="mb-4 line-clamp-2 text-sm leading-relaxed text-brand-muted"
                    dangerouslySetInnerHTML={{ __html: article.description }}
                  />

                  <div className="mt-auto flex items-center text-xs font-mono font-semibold text-brand-accent transition-all group-hover:text-brand-accent2">
                    <a href={article.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                      Read Full Article <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Discord Setup Modal */}
        <DiscordWebhookModal
          isOpen={isDiscordModalOpen}
          onClose={() => setIsDiscordModalOpen(false)}
        />

        {/* Floating Toast Notification */}
        <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
      </div>
    </PageTransition>
  )
}
