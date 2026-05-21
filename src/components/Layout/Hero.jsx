import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Users, Zap } from 'lucide-react'

function Hero({ onPrimaryAction, onSecondaryAction, isSignedIn }) {
  return (
    <section className="grid items-center gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
      <div className="space-y-6 lg:pr-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200 backdrop-blur"
        >
          <Zap className="h-4 w-4" />
          Real-time campus communication hub
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="space-y-4"
        >
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Keep every department aligned with a clean notice board experience.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Publish urgent updates, filter by category, and surface the latest campus
            announcements in a polished interface designed for students, faculty, and admins.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={onPrimaryAction}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:-translate-y-0.5 hover:shadow-indigo-950/60"
          >
            Publish a notice
            <ArrowRight className="h-4 w-4" />
          </button>
          {!isSignedIn ? (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Explore sign in
            </button>
          ) : null}
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Departments connected', value: '18+', icon: Users },
            { label: 'Secure publishing', value: 'RLS ready', icon: ShieldCheck },
            { label: 'Average update speed', value: '< 2m', icon: Zap },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_12px_36px_rgba(2,6,23,0.28)] backdrop-blur-xl"
            >
              <item.icon className="mb-3 h-5 w-5 text-cyan-300" />
              <p className="text-2xl font-semibold text-white">{item.value}</p>
              <p className="text-sm text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.1 }}
        className="relative"
      >
        <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-indigo-500/30 via-violet-500/20 to-cyan-400/20 blur-3xl" />
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.52)] backdrop-blur-xl sm:p-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-5 ring-1 ring-white/5">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">
              Today&apos;s board
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Important notices are surfaced first.
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Smooth card transitions, category filters, and a floating create action keep the
              experience fast on every screen size.
            </p>

            <div className="mt-6 space-y-3">
              {['Exam schedule updated', 'Library hours extended', 'New hostel maintenance slot'].map(
                (item, index) => (
                  <div key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/10">
                    <span className="text-sm text-slate-100">{item}</span>
                    <span className="text-xs text-cyan-300">0{index + 1}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
