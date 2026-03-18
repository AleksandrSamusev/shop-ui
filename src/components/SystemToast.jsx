export default function SystemToast({ toast, onClick }) {
  const isSuccess = toast?.type === "success";
  const isError = toast?.type === "error";
  return (
    <div className="fixed top-8 right-8 z-[9999] animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/50 rounded-2xl p-4 shadow-2xl shadow-blue-900/20 flex items-center gap-4 min-w-[320px]">
        <div className="w-1.5 h-8 bg-blue-500 rounded-full animate-pulse" />
        <div className="flex-1">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">
            {isSuccess && "Order Successful"}
            {isError && "System Error"}
            {!toast?.type && "System Notification"}
          </p>
          <div className="mt-1">
            <p className="text-sm font-bold text-white uppercase tracking-tight">{toast.message}</p>

            {toast.reference && (
              <p className="text-[11px] text-blue-400 font-bold mt-1">Ref: {toast.reference}</p>
            )}
          </div>
        </div>
        <button onClick={onClick} className="p-1 text-slate-500 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
