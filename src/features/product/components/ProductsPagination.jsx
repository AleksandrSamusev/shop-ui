export default function ProductsPagination({pageSize, numberOfElements, totalElements, totalPages, handleClick, first, last, currentPage, handleSelection, handleDecreaseClick, handleIncreaseClick}) {


  return (
    <footer className="flex items-center justify-between pt-10 border-t border-slate-800/50 mt-10 mb-10">
      {/* LEFT: DENSITY SELECTOR */}
      <div className="flex items-center gap-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Density</p>
        <select
          value={pageSize}
          onChange={handleSelection}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold text-white uppercase outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-800 appearance-none"
        >
          {[12, 24, 48].map((opt) => (
            <option key={opt} value={opt}>
              {opt} per page
            </option>
          ))}
        </select>
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
          Showing {numberOfElements} of {totalElements} Parts
        </p>
      </div>

      {/* RIGHT: NAVIGATION CONTROLS */}
      <div className="flex gap-3 items-center">
        <button
          disabled={first}
          onClick={handleDecreaseClick}
          className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-bold text-white uppercase hover:bg-slate-800 disabled:opacity-20 transition-all active:scale-95"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
               onClick={() => handleClick(i)}
              className={`w-10 h-10 rounded-2xl text-[10px] font-bold transition-all ${
                currentPage === i
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-900/40"
                  : "bg-slate-900 text-slate-500 border border-slate-800 hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          disabled={last}
          onClick={handleIncreaseClick}
          className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-bold text-white uppercase hover:bg-slate-800 disabled:opacity-20 transition-all active:scale-95"
        >
          Next
        </button>
      </div>
    </footer>
  );
}
