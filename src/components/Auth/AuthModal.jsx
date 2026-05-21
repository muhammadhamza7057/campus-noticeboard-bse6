import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Lock, UserRound, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login')

  const handleSubmit = (event) => {
    event.preventDefault()
    toast.success(mode === 'login' ? 'Welcome back' : 'Account created')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
                  Authentication
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {mode === 'login' ? 'Sign in to CampusFlow' : 'Create your account'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 rounded-2xl border border-white/10 bg-white/5 p-1">
              {['login', 'signup'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMode(item)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                    mode === item ? 'bg-white text-slate-950' : 'text-slate-300'
                  }`}
                >
                  {item === 'login' ? 'Login' : 'Sign up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === 'signup' && (
                <InputRow icon={UserRound} placeholder="Full name" type="text" />
              )}
              <InputRow icon={Mail} placeholder="Email address" type="email" />
              <InputRow icon={Lock} placeholder="Password" type="password" />
              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-4 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-cyan-950/30"
              >
                {mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function InputRow({ icon: Icon, ...props }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-cyan-300" />
      <input
        {...props}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
      />
    </div>
  )
}

export default AuthModal
