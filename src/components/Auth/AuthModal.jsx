import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, UserRound, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '../../services/authService'

function AuthModal({ isOpen, onClose, defaultMode = 'login', onSuccess }) {
  const isGoogleEnabled = import.meta.env.VITE_SUPABASE_GOOGLE_ENABLED === 'true'
  const [mode, setMode] = useState(defaultMode)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formState, setFormState] = useState({
    displayName: '',
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((current) => ({ ...current, [name]: value }))
  }

  const resetForm = () => {
    setFormState({ displayName: '', email: '', password: '' })
    setShowPassword(false)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode)
    }
  }, [defaultMode, isOpen])

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSubmitting(true)

      if (mode === 'login') {
        await signInWithEmail(formState.email, formState.password)
        toast.success('Signed in successfully')
      } else {
        await signUpWithEmail({
          email: formState.email,
          password: formState.password,
          displayName: formState.displayName,
        })
        toast.success('Account created successfully')
      }

      onSuccess?.()
      handleClose()
    } catch (error) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!isGoogleEnabled) {
      toast.error('Google sign-in is not enabled in Supabase yet. Enable the provider first.')
      return
    }

    try {
      setIsSubmitting(true)
      await signInWithGoogle()
      handleClose()
    } catch (error) {
      toast.error(error.message || 'Google sign-in failed')
    } finally {
      setIsSubmitting(false)
    }
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
            className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.72)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
                  Authentication
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {mode === 'login' ? 'Sign in to CampusFlow' : 'Create your account'}
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Sign in to publish notices, or create a profile in seconds.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
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
                <InputRow
                  icon={UserRound}
                  name="displayName"
                  placeholder="Full name"
                  type="text"
                  value={formState.displayName}
                  onChange={handleChange}
                />
              )}
              <InputRow
                icon={Mail}
                name="email"
                placeholder="Email address"
                type="email"
                value={formState.email}
                onChange={handleChange}
              />
              <InputRow
                icon={Lock}
                name="password"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={formState.password}
                onChange={handleChange}
                action={
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-slate-300 transition hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-4 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-cyan-950/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>

              <div className="relative py-2 text-center text-xs uppercase tracking-[0.28em] text-slate-400">
                <span className="relative z-10 bg-slate-950/95 px-3">or continue with</span>
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/10" />
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <GoogleIcon />
                {isGoogleEnabled ? 'Continue with Google' : 'Google sign-in disabled'}
              </button>

              {!isGoogleEnabled ? (
                <p className="text-xs leading-5 text-slate-400">
                  Enable Google provider in Supabase and set the redirect URL to this app before
                  using Google sign-in.
                </p>
              ) : null}
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function InputRow({ icon: Icon, action, ...props }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-cyan-300" />
      <input
        {...props}
        className="auth-input w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
      />
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.35 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.98 6.053 29.754 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.98 6.053 29.754 4 24 4c-7.818 0-14.605 4.431-17.694 10.691z" />
      <path fill="#4CAF50" d="M24 44c5.657 0 10.797-2.165 14.66-5.688l-6.78-5.742C29.838 34.091 27.073 35 24 35c-5.334 0-9.626-3.317-11.285-7.962l-6.53 5.02C9.23 39.108 16.116 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a11.98 11.98 0 0 1-4.423 5.57l.003-.002 6.78 5.742C36.989 37.85 40 32 40 24c0-1.341-.138-2.651-.389-3.917z" />
    </svg>
  )
}

export default AuthModal
