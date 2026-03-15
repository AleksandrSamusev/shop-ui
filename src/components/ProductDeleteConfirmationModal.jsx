export default function ProductDeleteConfirmationModal({productToDelete, setProductToDelete, confirmDelete}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* WARNING ICON */}
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>

          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            Confirm Destruction
          </h3>
          <p className="text-[11px] text-slate-500 uppercase tracking-widest leading-relaxed">
            You are about to permanently remove{" "}
            <span className="text-white font-bold">{productToDelete}</span> from the fleet
            database. This action cannot be reversed.
          </p>

          {/* ACTIONS: Symmetrical h-[48px] buttons */}
          <div className="grid grid-cols-2 gap-4 w-full pt-4">
            <button
              onClick={setProductToDelete}
              className="h-[48px] rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Abort
            </button>
            <button
              onClick={confirmDelete}
              className="h-[48px] bg-red-600 hover:bg-red-500 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-red-900/20 transition-all active:scale-95"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
