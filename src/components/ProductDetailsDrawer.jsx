export default function ProductDetailsDrawer({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* 1. BACKDROP (Click to close) */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* 2. THE DRAWER PANEL */}
      <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col h-full">
        {/* HEADER */}
        <header className="p-8 border-b border-slate-800 flex justify-between items-start shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                {product.sku}
              </span>
              {/* ADDED: Status Badge in Drawer */}
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                  product.status === "IN_STOCK"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {product.status}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">
              {product.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* IMAGE PREVIEW: Full-Bleed Hero shot */}
          <div className="relative h-64 -mx-8 -mt-8 mb-10 bg-white overflow-hidden border-b border-slate-800 flex items-center justify-center shrink-0 group/preview">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                /* 🚀 'object-cover' fills the width perfectly to match the 'Premium' feel */
                className="w-full h-full object-cover group-hover/preview:scale-105 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                <span className="text-[10px] font-black text-slate-800 uppercase italic tracking-widest">
                  No Visual Data
                </span>
              </div>
            )}

            {/* Subtle Spec Overlay */}
            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] font-bold text-white bg-slate-900/60 backdrop-blur-md px-2 py-1 rounded-md uppercase tracking-wider border border-white/10">
                Ref: {product.sku}
              </span>
            </div>
          </div>

          {/* FINANCIALS & STOCK SECTION */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Inventory Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-[9px] font-bold text-slate-600 uppercase mb-1">Unit Price</p>
                <p className="text-xl font-black text-white italic">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-[9px] font-bold text-slate-600 uppercase mb-1">Current Stock</p>
                <p
                  className={`text-xl font-black italic ${product.quantityInStock <= product.lowStockThreshold ? "text-amber-500" : "text-emerald-500"}`}
                >
                  {product.quantityInStock} Units
                </p>
              </div>
            </div>
          </section>

          {/* DYNAMIC ATTRIBUTES (THE FULL LIST) */}
          <section className="space-y-4 pb-10">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Full Specifications
            </h3>
            <div className="bg-slate-950 rounded-3xl border border-slate-800/50 overflow-hidden">
              {Object.entries(product.attributes || {}).length > 0 ? (
                Object.entries(product.attributes).map(([key, value], index) => (
                  <div
                    key={key}
                    className={`flex justify-between p-4 text-[11px] ${index !== 0 ? "border-t border-slate-900/50" : ""}`}
                  >
                    <span className="text-slate-500 font-bold uppercase">{key}</span>
                    <span className="text-slate-200 font-medium text-right ml-4">
                      {value.toString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-[10px] text-slate-700 italic text-center">
                  No additional specifications provided
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
