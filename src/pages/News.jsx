import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, Loader2, ExternalLink, Calendar, Flame } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { PixelPatternBg, PixelCross } from '../components/BrandDecorations'
import { getGamingNews } from '../utils/api'
import { isWebhookConfigured, sendGameUpdateToDiscord } from '../utils/discordWebhook'
import DiscordWebhookModal from '../components/DiscordWebhookModal'
import ToastNotification from '../components/ToastNotification'
import NewsSidebar from '../components/sidebar/NewsSidebar'

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

  const featuredStory = articles.length > 0 ? articles[0] : null
  const regularStories = articles.length > 1 ? articles.slice(1) : []

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1600px] 2xl:max-w-[1720px] px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-10 space-y-8">
        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface p-6 sm:p-8 shadow-sm">
          <PixelPatternBg />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-brand-accent">
                <Newspaper className="h-4 w-4" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest">
                  The Daily Feed • Pixellon Dispatch
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-text">
                Gaming News & Updates
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-brand-muted">
                Real-time updates, industry insights, and breaking headlines from across the gaming cosmos.
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
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* ── Main News Column (70%) ─────────────────────────────── */}
            <div className="xl:col-span-8 2xl:col-span-9 space-y-6">
              {/* Featured Breaking News Story */}
              {featuredStory && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative overflow-hidden rounded-2xl border border-surface-700 bg-brand-surface shadow-md transition-all hover:border-brand-primary/60 hover:shadow-xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Featured Image */}
                    {(featuredStory.enclosure?.link || featuredStory.thumbnail) && (
                      <div className="relative aspect-video lg:aspect-auto lg:col-span-7 overflow-hidden min-h-[260px] sm:min-h-[340px]">
                        <img
                          src={featuredStory.enclosure?.link || featuredStory.thumbnail}
                          alt={featuredStory.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-mono font-bold text-white shadow-lg">
                          <Flame className="h-3.5 w-3.5" />
                          BREAKING NEWS
                        </span>
                      </div>
                    )}

                    {/* Featured Body */}
                    <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
                      <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-mono text-brand-muted">
                          <span className="flex items-center gap-1.5 rounded bg-surface-900 px-2.5 py-1 border border-surface-700">
                            <Calendar className="h-3.5 w-3.5 text-brand-accent" />
                            {formatDate(featuredStory.pubDate)}
                          </span>
                          {featuredStory.author && <span>By {featuredStory.author}</span>}
                        </div>

                        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-brand-text leading-tight group-hover:text-brand-accent transition-colors">
                          <a href={featuredStory.link} target="_blank" rel="noopener noreferrer">
                            {featuredStory.title}
                          </a>
                        </h2>

                        <div
                          className="mt-3 line-clamp-3 text-xs sm:text-sm text-brand-muted leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: featuredStory.description }}
                        />
                      </div>

                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-surface-700">
                        <a
                          href={featuredStory.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-brand-accent hover:text-brand-primary transition-colors"
                        >
                          Full Story <ExternalLink className="h-3.5 w-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={(e) => handleShareToDiscord(featuredStory, e)}
                          disabled={sharingGuid === (featuredStory.guid || featuredStory.link)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#5865F2]/40 bg-[#5865F2]/15 px-3 py-1.5 text-xs font-mono text-[#7985f7] dark:text-[#8a94fd] hover:bg-[#5865F2] hover:text-white transition-all cursor-pointer"
                        >
                          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                          </svg>
                          <span>Discord</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Feed of stories */}
              <div className="grid gap-4">
                {regularStories.map((article, i) => (
                  <motion.article
                    key={article.guid || i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group relative flex flex-col gap-5 rounded-xl border border-surface-700 bg-brand-surface p-5 transition-all hover:border-brand-primary/60 hover:shadow-md sm:flex-row shadow-sm"
                  >
                    {/* Thumbnail */}
                    {(article.enclosure?.link || article.thumbnail) && (
                      <div className="relative aspect-video w-full flex-shrink-0 overflow-hidden rounded-lg sm:w-56 sm:aspect-[4/3] bg-surface-900">
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
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-brand-muted">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1.5 rounded bg-surface-900 px-2.5 py-0.5 border border-surface-700 text-[11px]">
                            <Calendar className="h-3 w-3 text-brand-accent" />
                            {formatDate(article.pubDate)}
                          </span>
                          {article.author && <span className="text-[11px]">By {article.author}</span>}
                        </div>

                        {/* Discord Share Button */}
                        <button
                          type="button"
                          onClick={(e) => handleShareToDiscord(article, e)}
                          disabled={sharingGuid === (article.guid || article.link)}
                          title="Post game update to Discord"
                          className="relative z-10 inline-flex items-center gap-1.5 rounded-lg border border-[#5865F2]/40 bg-[#5865F2]/15 px-2 py-0.5 text-[11px] font-mono text-[#8a94fd] hover:bg-[#5865F2] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                        >
                          {sharingGuid === (article.guid || article.link) ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                          )}
                          <span>Discord</span>
                        </button>
                      </div>

                      <h2 className="mb-2 font-display text-lg sm:text-xl font-bold text-brand-text transition-colors group-hover:text-brand-accent line-clamp-2">
                        <a href={article.link} target="_blank" rel="noopener noreferrer">
                          {article.title}
                        </a>
                      </h2>

                      <div
                        className="mb-3 line-clamp-2 text-xs sm:text-sm leading-relaxed text-brand-muted"
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
            </div>

            {/* ── Sticky News Sidebar (30%) ─────────────────────────────── */}
            <div className="xl:col-span-4 2xl:col-span-3 xl:sticky xl:top-20 space-y-6">
              <NewsSidebar articles={articles} />
            </div>
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
