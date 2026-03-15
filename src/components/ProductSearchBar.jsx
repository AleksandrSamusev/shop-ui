export default function ProductSearchBar({value, onChange, onClick}) {
  return (
    <div className="relative flex-1 max-w-md group">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>

      <input
        type="text"
        placeholder="Search by SKU, Name, or Category..."
        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-10 py-2 text-xs text-white focus:border-blue-500 outline-none transition-all"
        value={value}
        onChange={onChange}
      />

      {/* THE CLEAR BUTTON*/}
      {value && (
        <button
          onClick={onClick}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md transition-all animate-in fade-in zoom-in-75 duration-200"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
