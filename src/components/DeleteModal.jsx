export default function DeleteModal({ isOpen, onConfirm, onCancel, itemName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 1. BLURRED BACKDROP (Click to cancel) */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onCancel}
      />

      {/* 2. THE MODAL CARD */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* DANGER ICON */}
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 border border-red-500/20">
          <svg className="w-8 h-8 text-red-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">
          Purge SKU?
        </h2>
        <p className="text-slate-400 text-[10px] font-bold leading-relaxed mb-8 uppercase tracking-widest">
          Are you sure you want to permanently remove <span className="text-red-400">"{itemName}"</span>? This cannot be undone.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-4 rounded-2xl bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all"
          >
            Abort
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-500 shadow-lg shadow-red-900/20 active:scale-95 transition-all"
          >
            Confirm Purge
          </button>
        </div>
      </div>
    </div>
  );
}