function FilterBar({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="sticky top-[5.4rem] z-10 flex flex-wrap items-center gap-2 rounded-3xl border border-white/10 bg-slate-950/55 p-2 backdrop-blur-xl">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelectCategory(category)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeCategory === category
              ? 'bg-white text-slate-950 shadow-lg shadow-slate-950/20'
              : 'border border-white/10 bg-white/5 text-slate-200 hover:-translate-y-0.5 hover:bg-white/10'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
