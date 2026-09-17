import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, CheckCircle, AlertCircle, Loader2, Send, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react'
import {
  getWebhookUrl,
  setWebhookUrl,
  isValidDiscordWebhookUrl,
  testDiscordWebhook,
} from '../utils/discordWebhook'

export default function DiscordWebhookModal({ isOpen, onClose, onWebhookUpdated }) {
  const [webhookInput, setWebhookInput] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' })
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const current = getWebhookUrl()
      setWebhookInput(current)
      setIsSaved(Boolean(current))
      setStatusMessage({ type: '', text: '' })
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    const trimmed = webhookInput.trim()
    if (trimmed && !isValidDiscordWebhookUrl(trimmed)) {
      setStatusMessage({
        type: 'error',
        text: 'Invalid Discord Webhook URL. It must start with https://discord.com/api/webhooks/...',
      })
      return
    }

    setWebhookUrl(trimmed)
    setIsSaved(Boolean(trimmed))
    setStatusMessage({
      type: 'success',
      text: trimmed ? 'Webhook URL saved successfully!' : 'Webhook URL cleared.',
    })
    if (onWebhookUpdated) onWebhookUpdated(trimmed)
  }

  const handleTest = async () => {
    const trimmed = webhookInput.trim()
    if (!trimmed) {
      setStatusMessage({ type: 'error', text: 'Please enter a Discord Webhook URL first.' })
      return
    }

    if (!isValidDiscordWebhookUrl(trimmed)) {
      setStatusMessage({
        type: 'error',
        text: 'Invalid Discord Webhook URL. Double check the copied link.',
      })
      return
    }

    setIsTesting(true)
    setStatusMessage({ type: '', text: '' })

    try {
      await testDiscordWebhook(trimmed)
      setStatusMessage({
        type: 'success',
        text: 'Test message sent! Check your Discord channel 🎉',
      })
      // Auto save on successful test
      setWebhookUrl(trimmed)
      setIsSaved(true)
      if (onWebhookUpdated) onWebhookUpdated(trimmed)
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: `Failed to post to Discord: ${err.message}`,
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleClear = () => {
    setWebhookInput('')
    setWebhookUrl('')
    setIsSaved(false)
    setStatusMessage({ type: 'info', text: 'Webhook disconnected.' })
    if (onWebhookUpdated) onWebhookUpdated('')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#1E2638] bg-[#121722] p-6 sm:p-8 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-brand-muted hover:bg-[#1E2638] hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#5865F2]">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                Connect Discord Bot
                {isSaved && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Active
                  </span>
                )}
              </h2>
              <p className="text-xs text-brand-muted mt-1 leading-relaxed">
                Broadcast free game drops, massive deals, and gaming updates directly to your Discord server channel.
              </p>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="rounded-xl border border-[#1E2638] bg-[#0B0F17] p-4 mb-5 text-xs text-brand-muted space-y-2">
            <div className="flex items-center gap-1.5 font-mono font-semibold text-brand-text">
              <ShieldCheck className="h-4 w-4 text-[#5865F2]" />
              <span>How to get your Webhook URL in 3 steps:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] leading-relaxed">
              <li>In Discord, right-click your text channel and select <strong className="text-white">Edit Channel</strong>.</li>
              <li>Go to <strong className="text-white">Integrations</strong> → <strong className="text-white">Webhooks</strong> → click <strong className="text-white">New Webhook</strong>.</li>
              <li>Click <strong className="text-[#5865F2]">Copy Webhook URL</strong> and paste it below.</li>
            </ol>
          </div>

          {/* Input field */}
          <div className="space-y-3 mb-6">
            <label className="block text-xs font-mono font-medium text-brand-text">
              DISCORD WEBHOOK URL
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://discord.com/api/webhooks/123456789/abcdef..."
                value={webhookInput}
                onChange={(e) => setWebhookInput(e.target.value)}
                className="w-full rounded-xl border border-[#1E2638] bg-[#0B0F17] py-3 pl-3.5 pr-10 text-xs font-mono text-brand-text placeholder:text-brand-muted/50 focus:border-[#5865F2] focus:outline-none focus:ring-1 focus:ring-[#5865F2] transition-all"
              />
              {webhookInput && (
                <button
                  type="button"
                  onClick={() => setWebhookInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Status alerts */}
            {statusMessage.text && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 rounded-lg p-3 text-xs font-mono ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : statusMessage.type === 'error'
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : 'bg-[#1E2638] text-brand-muted'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </motion.div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1E2638]">
            {isSaved && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs font-mono font-medium text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Disconnect
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting || !webhookInput.trim()}
                className="inline-flex items-center gap-2 rounded-xl border border-[#5865F2]/40 bg-[#5865F2]/20 px-4 py-2.5 text-xs font-mono font-medium text-[#7983f5] hover:bg-[#5865F2]/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isTesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {isTesting ? 'Sending...' : 'Test Ping'}
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={!webhookInput.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-xs font-mono font-semibold text-white hover:bg-brand-primary/85 shadow-[0_0_12px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle className="h-4 w-4" />
                Save Webhook
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
