export default function GridEmptyState({onClick}) {
  return (
    <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-800/50 rounded-[3rem] bg-slate-900/10 animate-in fade-in zoom-in-95 duration-700">
      <div className="w-20 h-20 bg-blue-500/5 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/10">
        <svg
          className="w-10 h-10 text-slate-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white italic uppercase tracking-normal mb-2">
        Inventory Catalog Empty
      </h3>
      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-center max-w-xs leading-relaxed">
        There are no products currently listed.
        <br /> Add your first item to begin managing your stock.
      </p>
      <button
        onClick={() => setIsAdding(true)}
        className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all active:scale-95"
      >
        <span className="text-lg">+</span>Create New Product
      </button>
    </div>
  );
}
