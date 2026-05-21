import { useEffect, useRef, useState } from 'react'
import { BellRing, Edit3, LogOut, LogIn, Settings, Sparkles, UserCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

function Navbar({ onOpenAuth, onOpenForm, user, profile, onSignOut, onOpenEditProfile, onOpenSettings }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const displayName = profile?.display_name ?? user?.email ?? 'Guest'
  const displayEmail = profile?.email ?? user?.email ?? ''
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
    .slice(0, 2)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleMenuAction = (action) => {
    setIsMenuOpen(false)
    action?.()
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="sticky top-0 z-20 pt-4"
    >
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-slate-950/55 px-4 py-4 shadow-lg shadow-slate-950/30 backdrop-blur-xl sm:px-5">
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

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onOpenForm}
            className="inline-flex min-w-0 items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100 sm:px-5 sm:py-2.5"
          >
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span className="truncate">Post Notice</span>
          </button>

          {user ? (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 shadow-lg shadow-slate-950/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/10"
                aria-expanded={isMenuOpen}
                aria-haspopup="menu"
                aria-label="Open profile menu"
              >
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-xs font-bold text-white shadow-inner shadow-slate-950/20 ring-1 ring-white/10">
                  {initials || <UserCircle2 className="h-5 w-5 text-white" />}
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
                </span>
              </button>

              {isMenuOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  role="menu"
                  className="absolute right-0 top-[calc(100%+0.75rem)] z-30 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/98 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl"
                >
                  <div className="border-b border-white/10 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-xs font-bold text-white shadow-inner shadow-slate-950/20 ring-1 ring-white/10">
                        {initials || <UserCircle2 className="h-5 w-5 text-white" />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/90">Signed in</p>
                        <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                        <p className="truncate text-xs text-slate-400">{displayEmail}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenEditProfile)}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/10"
                      role="menuitem"
                    >
                      <Edit3 className="h-4 w-4 text-cyan-300" />
                      Edit profile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onOpenSettings)}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-100 transition hover:bg-white/10"
                      role="menuitem"
                    >
                      <Settings className="h-4 w-4 text-cyan-300" />
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMenuAction(onSignOut)}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-rose-200 transition hover:bg-rose-500/10"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-100 shadow-lg shadow-slate-950/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/10"
              aria-label="Sign in"
            >
              <LogIn className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Navbar
