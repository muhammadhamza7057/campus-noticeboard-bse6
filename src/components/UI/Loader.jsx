function Loader() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_16px_48px_rgba(2,6,23,0.24)]"
        >
          <div className="h-5 w-24 rounded-full bg-white/10" />
          <div className="mt-4 h-7 w-4/5 rounded-2xl bg-white/10" />
          <div className="mt-3 h-4 w-full rounded-2xl bg-white/10" />
          <div className="mt-2 h-4 w-11/12 rounded-2xl bg-white/10" />
          <div className="mt-6 flex justify-between gap-3">
            <div className="h-4 w-24 rounded-full bg-white/10" />
            <div className="h-4 w-20 rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loader
