import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Clock3, LogOut, PencilLine, Settings, ShieldCheck, X } from 'lucide-react'

function SettingsModal({ isOpen, onClose, profile, isSignedIn, onOpenEditProfile, onSignOut }) {
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
                  Account
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Settings</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-200">
              <SettingRow icon={Settings} label="Display name" value={profile?.display_name ?? 'Not set'} />
              <SettingRow icon={Bell} label="Email" value={profile?.email ?? 'Not set'} />
              <SettingRow icon={ShieldCheck} label="Signed in" value={isSignedIn ? 'Yes' : 'No'} />
              <SettingRow icon={Clock3} label="Last updated" value={new Date().toLocaleString()} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenEditProfile?.()
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-slate-100 transition hover:bg-white/10"
              >
                <PencilLine className="h-4 w-4 text-cyan-300" />
                Edit profile
              </button>
              <button
                type="button"
                onClick={async () => {
                  onClose()
                  await onSignOut?.()
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 font-semibold text-rose-100 transition hover:bg-rose-500/20"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function SettingRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-cyan-300" />
        <span className="text-slate-300">{label}</span>
      </div>
      <span className="max-w-[55%] truncate text-right font-medium text-white">{value}</span>
    </div>
  )
}

export default SettingsModal