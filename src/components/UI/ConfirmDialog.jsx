import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  tone = 'primary',
  onClose,
  onConfirm,
}) {
  const confirmStyles =
    tone === 'danger'
      ? 'bg-rose-500 text-white hover:bg-rose-400'
      : 'bg-white text-slate-950 hover:bg-cyan-100'

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.72)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
                  Confirm action
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`inline-flex flex-1 items-center justify-center rounded-2xl px-4 py-3 font-semibold transition ${confirmStyles}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default ConfirmDialog