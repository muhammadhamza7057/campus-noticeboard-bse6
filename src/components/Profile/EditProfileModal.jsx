import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { UserRound, Mail, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { updateProfile } from '../../services/profileService'

function EditProfileModal({ isOpen, onClose, profile, onSaved }) {
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setDisplayName(profile?.display_name ?? '')
    }
  }, [isOpen, profile])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSaving(true)
      const savedProfile = await updateProfile({
        userId: profile?.id,
        email: profile?.email,
        displayName,
      })
      toast.success('Profile updated successfully')
      onSaved?.(savedProfile)
      onClose()
    } catch (error) {
      toast.error(error.message || 'Profile update failed')
    } finally {
      setIsSaving(false)
    }
  }

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
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.72)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
                  Profile
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Edit profile</h3>
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
              <Field icon={UserRound}>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Display name"
                  className="auth-input w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                />
              </Field>

              <Field icon={Mail}>
                <input
                  value={profile?.email ?? ''}
                  readOnly
                  className="w-full bg-transparent text-sm text-slate-300 outline-none"
                />
              </Field>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-4 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-indigo-950/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
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
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-cyan-300" />
      <div className="w-full">{children}</div>
    </div>
  )
}

export default EditProfileModal