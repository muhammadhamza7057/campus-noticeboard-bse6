import { BellRing, LogOut, LogIn, Sparkles, UserCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

function Navbar({ onOpenAuth, onOpenForm, user, profile, onSignOut }) {
  const displayName = profile?.display_name ?? user?.email ?? 'Guest'
  const displayEmail = profile?.email ?? user?.email ?? ''
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2)

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-20 pt-4"
    >
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/55 px-4 py-4 shadow-lg shadow-slate-950/30 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-white shadow-lg shadow-indigo-950/30 ring-1 ring-white/10">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-300/90">
              CampusFlow
            </p>
            <p className="text-sm text-slate-300">Campus notices, streamlined</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {user ? (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-xs font-bold text-white shadow-inner shadow-slate-950/20 ring-1 ring-white/10">
                {initials || <UserCircle2 className="h-4 w-4 text-white" />}
              </div>
              <div className="min-w-0">
                <p className="max-w-[8rem] truncate text-sm font-semibold text-white sm:max-w-[12rem]">
                  {displayName}
                </p>
                <p className="max-w-[8rem] truncate text-xs text-slate-400 sm:max-w-[12rem]">
                  {displayEmail}
                </p>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 bg-slate-950/60 px-3 text-xs font-medium text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                <LogOut className="mr-1 h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </button>
          )}
          <button
            type="button"
            onClick={onOpenForm}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100"
          >
            <Sparkles className="h-4 w-4 text-indigo-600" />
            Post Notice
          </button>
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar
