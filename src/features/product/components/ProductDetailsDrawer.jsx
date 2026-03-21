import React from "react";
import { X, Shield } from "lucide-react";

export default function ProductDetailsDrawer({ product, isOpen, onClose }) {
  if (!product) return null;

  return (
    <>
      {/* 🚀 1. THE VORTEX OVERLAY: Blurs the showroom background */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-all duration-500 ${
          isOpen ? "opacity-100 z-[450]" : "opacity-0 pointer-events-none -z-10"
        }`}
      />

      {/* 🚀 2. THE DRAWER PANEL: Set to fixed + z-[500] to beat the Filter Bar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-slate-900 border-l border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out flex flex-col z-[500] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER: Classification & Status */}
        <header className="p-8 border-b border-slate-800 flex justify-between items-start shrink-0 bg-slate-900/50 backdrop-blur-xl">
          <div className="space-y-2 pr-16">
            <div className="flex items-center gap-3">
              {/* SKU Tag */}
              <span className="text-[10px] font-mono text-blue-500 uppercase tracking-widest bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/20">
                {product.sku}
              </span>

              {/* THE CATEGORY: High-context classification */}
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
                {product.category}
              </span>

              {/* Status Badge */}
              <span
                className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase border ${
                  product.status === "IN_STOCK"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {product.status}
              </span>
            </div>

            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mt-2">
              {product.name}
            </h2>
          </div>

          {/* Close Button: High-intent exit port */}
          <button
            onClick={onClose}
            className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white hover:border-slate-700 transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-0 custom-scrollbar">
          {/* IMAGE PREVIEW: Full-Bleed Hero shot */}
          <div className="relative h-64 -mx-8 -mt-8 bg-white overflow-hidden border-b border-slate-800 flex items-center justify-center shrink-0 group/preview">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover/preview:scale-105 transition-all duration-700"
              />
            ) : (
              <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                <span className="text-[10px] font-black text-slate-800 uppercase italic tracking-widest">
                  No Visual Data
                </span>
              </div>
            )}

            <div className="absolute bottom-4 left-4">
              <span className="text-[10px] font-bold text-white bg-slate-900/60 backdrop-blur-md px-2 py-1 rounded-md uppercase tracking-wider border border-white/10">
                Ref: {product.sku}
              </span>
            </div>
          </div>

          <div className="h-12" />

          {/* INVENTORY SECTION */}
          <section className="pt-2">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] whitespace-nowrap">
                Inventory Status
              </h3>
              <div className="h-[1px] w-full bg-blue-500/20" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Unit Price Box */}
              <div className="bg-slate-950/80 p-6 rounded-[2rem] border border-slate-800 shadow-lg">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
                  Unit Price
                </p>
                <div className="flex items-baseline gap-2 leading-none">
                  <span className="text-sm font-black text-blue-500 italic">$</span>
                  <p className="text-3xl font-black text-white italic tracking-tighter">
                    {Number(product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Current Stock Box */}
              <div className="bg-slate-950/80 p-6 rounded-[2rem] border border-slate-800 hover:border-blue-500/40 transition-all duration-500 shadow-lg group">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
                  Current Stock
                </p>
                <p
                  className={`text-3xl font-black italic tracking-tighter ${
                    product.quantityInStock <= product.lowStockThreshold
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {product.quantityInStock}{" "}
                  <span className="text-[10px] uppercase not-italic tracking-normal text-slate-600 ml-1">
                    Units
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* SPECIFICATIONS SECTION */}
          <section className="mt-16 pt-10 border-t border-slate-800/60 pb-20">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] whitespace-nowrap">
                Full Specifications
              </h3>
              <div className="h-[1px] w-full bg-blue-500/20" />
            </div>

            <div className="bg-slate-950/40 rounded-[2.5rem] border border-slate-800/40 p-8 space-y-6">
              {Object.entries(product.attributes || {}).map(([key, value]) => (
                <div key={key} className="flex items-end gap-3 group/spec">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
                    {key}
                  </span>
                  <div className="flex-1 border-b border-dotted border-slate-800/60 mb-1.5 opacity-40 group-hover/spec:opacity-100 transition-opacity" />
                  <span className="text-[12px] font-bold text-slate-400 tracking-tight text-right">
                    {value.toString()}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
