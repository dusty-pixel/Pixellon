import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertTriangle, X } from 'lucide-react'

export default function ToastNotification({ toast, onDismiss }) {
  if (!toast) return null

  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col gap-2">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`pointer-events-auto flex items-center gap-3 rounded-xl border p-4 shadow-2xl backdrop-blur-md min-w-[280px] max-w-sm ${
            toast.type === 'error'
              ? 'border-rose-500/30 bg-rose-950/80 text-rose-200'
              : 'border-[#5865F2]/40 bg-[#121722]/90 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
          ) : (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#5865F2]/30 text-[#7983f5]">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          )}

          <div className="flex-1 text-xs">
            <p className="font-semibold">{toast.title || 'Discord Broadcast'}</p>
            <p className="text-brand-muted text-[11px] mt-0.5">{toast.message}</p>
          </div>

          <button
            onClick={onDismiss}
            className="rounded p-1 text-brand-muted hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
