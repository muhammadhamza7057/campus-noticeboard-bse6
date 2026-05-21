import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileText, MessageSquare, Tag, X } from 'lucide-react'

const initialForm = {
  title: '',
  body: '',
  category: 'General',
}

function NoticeForm({ isOpen, onClose, onSubmit, profile, isSignedIn, onOpenAuth }) {
  const [formData, setFormData] = useState(initialForm)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isSignedIn) {
      onClose()
      onOpenAuth?.('signup')
      return
    }

    await onSubmit({
      ...formData,
      description: formData.body,
    })
    setFormData(initialForm)
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/70 px-4 pb-4 pt-16 backdrop-blur-sm sm:items-center sm:pb-0"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950/96 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.7)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
                  Create notice
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Publish a new announcement</h3>
                <p className="mt-2 max-w-lg text-sm text-slate-300">
                  {isSignedIn
                    ? `Posting as ${profile?.display_name ?? profile?.email ?? 'Campus User'}`
                    : 'Sign in or create an account to publish a notice.'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Field icon={FileText}>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Notice title"
                  required
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                />
              </Field>

              <Field icon={MessageSquare}>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  placeholder="Notice details"
                  rows="4"
                  required
                  className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field icon={Tag}>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-transparent text-sm text-white outline-none"
                  >
                    {['General', 'Academics', 'Events', 'Exams', 'Hostel'].map((option) => (
                      <option key={option} value={option} className="bg-slate-950">
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {!isSignedIn ? (
                <button
                  type="button"
                  onClick={() => onOpenAuth?.('signup')}
                  className="w-full rounded-2xl border border-dashed border-cyan-400/30 bg-cyan-400/5 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/10"
                >
                  Sign in to continue
                </button>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-4 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-indigo-950/40 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!isSignedIn}
              >
                Post notice
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function Field({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <Icon className="mt-1 h-4 w-4 shrink-0 text-cyan-300" />
      <div className="w-full">{children}</div>
    </div>
  )
}

export default NoticeForm
