import React from "react";
import { useState } from "react";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
  openMenuId,
  setOpenMenuId,
  setViewingProduct,
}) {
  return (
    <div
      key={product.id}
      className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col"
    >
      {/* 🚀 IMAGE SECTION: Single layer, high-intent hit area */}
      <div
        onClick={setViewingProduct}
        className="relative h-48 -mx-6 -mt-6 mb-6 bg-white overflow-hidden cursor-pointer group/img border-b border-slate-800/50"
        /* 💡 Note: -mx-6 and -mt-6 pull the image to the very edges of the card */
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover/img:scale-110 transition-all duration-700"
          />
        ) : (
          <div className="w-full h-full bg-slate-950 flex items-center justify-center">
            <span className="text-[10px] font-black text-slate-800 uppercase italic tracking-widest">
              No Visual Data
            </span>
          </div>
        )}

        {/* Visual Hint Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 bg-slate-950/40 backdrop-blur-[2px]">
          <div className="bg-blue-600/90 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-2xl">
            View Specs
          </div>
        </div>
      </div>

      {/* METADATA HEADER */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1">
          {" "}
          {/* Stacked SKU and Category */}
          <span className="text-[9px] font-mono bg-slate-950 px-2 py-1 rounded-lg text-slate-500 border border-slate-800 uppercase w-fit">
            {product.sku}
          </span>
          {/* 🚀 THE CATEGORY BADGE: Provides context for the search match */}
          <span className="text-[8px] font-black text-blue-500/80 uppercase tracking-widest px-1">
            {product.category}
          </span>
        </div>

        <span
          className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase ${
            product.status === "IN_STOCK"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {product.status}
        </span>
      </div>

      {/* PRODUCT TITLE */}
      <h3
        onClick={() => setViewingProduct(product)}
        className="text-xl font-black text-white italic uppercase tracking-normal truncate mb-4 cursor-pointer hover:text-blue-400 transition-all duration-300"
      >
        {product.name}
      </h3>
      {/* TECH SPECS: Precision-Engineered Layout */}
      <div className="space-y-1.5 mb-6 h-16 overflow-hidden mt-2">
        {product.attributes && Object.entries(product.attributes).length > 0 ? (
          Object.entries(product.attributes)
            .slice(0, 3)
            .map(([key, value]) => (
              <div key={key} className="flex items-end gap-2 group/spec">
                {/* 1. Label: Clean and subtle */}
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest shrink-0">
                  {key}
                </span>

                {/* 2. The Leader Line: Fills the gap and guides the eye */}
                <div className="flex-1 border-b border-dotted border-slate-800 mb-1 opacity-50" />

                {/* 3. Value: High-contrast and aligned */}
                <span className="text-[10px] font-black text-slate-300 tracking-tight whitespace-nowrap">
                  {value?.toString() || "N/A"}
                </span>
              </div>
            ))
        ) : (
          <div className="text-[10px] text-slate-700 italic uppercase tracking-widest pt-2">
            Standard Specification
          </div>
        )}
      </div>

      {/* ADDITIONAL SPECS INDICATOR */}
      <div className="h-4 mb-4">
        {Object.entries(product.attributes || {}).length > 3 && (
          <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
            + Additional Specs Available
          </p>
        )}
      </div>

      <div className="flex-grow" />

      {/* FOOTER: Price and Actions */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/50">
        <p className="text-2xl font-black text-white italic">
          {/* 🚀 THE FIX: Use toLocaleString for thousand separators */}${" "}
          {Number(product.price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === product.id ? null : product.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              openMenuId === product.id
                ? "bg-slate-800 text-white"
                : "text-slate-500 hover:text-white"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {openMenuId === product.id && (
            <div className="absolute right-0 bottom-full mb-2 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
              {/* EDIT DETAILS BUTTON */}
              <button
                onClick={onEdit}
                className="w-full px-4 py-2 text-left text-[10px] font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors uppercase tracking-widest"
              >
                Edit Details
              </button>
              <button
                onClick={onDelete}
                className="w-full px-4 py-2 text-left text-[10px] font-bold text-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-widest border-t border-slate-800/50"
              >
                Delete SKU
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
