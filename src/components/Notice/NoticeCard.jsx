import { motion } from 'framer-motion'
import { CalendarDays, CircleAlert, Tag, User } from 'lucide-react'
import { formatDate } from '../../utils/formatDate'

const categoryStyles = {
  General: 'from-indigo-500/20 to-indigo-500/5 text-indigo-200 border-indigo-400/20',
  Academics: 'from-cyan-500/20 to-cyan-500/5 text-cyan-200 border-cyan-400/20',
  Events: 'from-violet-500/20 to-violet-500/5 text-violet-200 border-violet-400/20',
  Exams: 'from-amber-500/20 to-amber-500/5 text-amber-200 border-amber-400/20',
  Hostel: 'from-emerald-500/20 to-emerald-500/5 text-emerald-200 border-emerald-400/20',
}

function NoticeCard({ notice }) {
  const accent = categoryStyles[notice.category] ?? categoryStyles.General

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_16px_48px_rgba(2,6,23,0.34)] backdrop-blur-xl transition hover:border-white/15 hover:bg-white/[0.07]"
    >
      <div className={`rounded-2xl border bg-gradient-to-br p-4 shadow-inner ${accent}`}>
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-100">
            <Tag className="h-3.5 w-3.5" />
            {notice.category}
          </span>
          {notice.priority === 'High' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-200">
              <CircleAlert className="h-3.5 w-3.5" />
              High priority
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 text-xl font-semibold leading-snug text-white">{notice.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-200/90">{notice.description}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-300">
        <div className="inline-flex items-center gap-2">
          <User className="h-4 w-4 text-cyan-300" />
          {notice.author}
        </div>
        <div className="inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-cyan-300" />
          {formatDate(notice.date)}
        </div>
      </div>
    </motion.article>
  )
}

export default NoticeCard
