export default function InventoryMetrics({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-sm">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
          Total SKUs
        </p>
        <p className="text-3xl font-black text-white italic tracking-wide">{stats.totalSkus}</p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-sm">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
          Stock Value
        </p>
        <p className="text-3xl font-black text-blue-400 italic tracking-tighter">
          ${stats.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>

      <div
        className={`p-6 rounded-3xl border transition-all duration-500 ${
          stats.lowStockCount > 0
            ? "bg-amber-500/10 border-amber-500/40"
            : "bg-slate-900/40 border-slate-800/60"
        }`}
      >
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
          Low Stock
        </p>
        <p
          className={`text-3xl font-black italic tracking-tighter ${
            stats.lowStockCount > 0 ? "text-amber-400" : "text-white"
          }`}
        >
          {stats.lowStockCount}
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-sm">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
          Top Item
        </p>
        <p className="text-lg font-bold text-white italic truncate mt-1 tracking-wide">
          {stats.topSeller}
        </p>
      </div>
    </div>
  );
}
