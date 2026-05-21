import { Inbox, RotateCcw } from 'lucide-react'

function EmptyState({ onReset }) {
  return (
    <div className="flex min-h-[18rem] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-white/15 bg-white/5 px-6 text-center shadow-[0_16px_48px_rgba(2,6,23,0.24)]">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-300/20">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">No notices found</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
        Try another category or clear the filter to see the full notice feed.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-100"
      >
        <RotateCcw className="h-4 w-4" />
        Show all notices
      </button>
    </div>
  )
}

export default EmptyState
