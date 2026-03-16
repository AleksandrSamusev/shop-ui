import React from "react";
import { useState } from "react";
import { ShoppingBasket, MoreVertical, Settings } from "lucide-react";
import { authService } from "../services/authService";
import { useNavigate } from 'react-router-dom'; 

export default function ProductCard({
  product,
  isAdmin, // 🛡️ Added: To toggle Admin vs Customer UI
  onViewSpecs, // 🚀 THE NEW TRIGGER: Maps to setSelectedProduct(product)
  onEdit, // Existing Admin Forge prop
  onDelete, // Existing Admin Forge prop
  openMenuId, // Existing Admin Forge prop
  setOpenMenuId, // Existing Admin Forge prop
}) {
  const navigate = useNavigate();
  return (
    <div
      key={product.id}
      className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col"
    >
      {/* 🚀 IMAGE SECTION: The "Technical Spec" Trigger */}
      <div
        onClick={onViewSpecs} // 🛡️ SYMMETRY: Ignites the ProductDetailsDrawer
        className="relative h-48 -mx-6 -mt-6 mb-6 bg-white overflow-hidden cursor-pointer group/img border-b border-slate-800/50"
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

        {/* Visual Hint Overlay (Showroom Style) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 bg-slate-950/40 backdrop-blur-[2px]">
          <div className="bg-blue-600/90 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-2xl">
            View Specs
          </div>
        </div>
      </div>

      <div className="flex justify-between items-start mb-4 px-0">
        {/* 1. LEFT COLUMN: IDENTITY (SKU + Category) */}
        <div className="flex flex-col gap-1">
          <span className="px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-[9px] font-mono text-slate-400 uppercase w-fit">
            {product.sku}
          </span>
          <span className="text-[8px] font-bold text-blue-600 uppercase tracking-[0.1em] px-0.5 mt-0.5">
            {product.category}
          </span>
        </div>

        {/* 2. RIGHT GROUP: DATA CLUSTER (QTY + Status) */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-xl text-[8px] font-bold text-slate-500 tracking-wider uppercase whitespace-nowrap">
            QTY: {product.quantityInStock}
          </span>

          <span
            className={`px-2 py-0.5 rounded-xl text-[8px] font-bold uppercase tracking-widest border whitespace-nowrap transition-all duration-500 ${
              product.quantityInStock <= product.lowStockThreshold
                ? "text-red-500 border-red-500/20 bg-red-500/5 animate-pulse"
                : "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
            }`}
          >
            {product.quantityInStock <= product.lowStockThreshold ? "CRITICAL" : "IN_STOCK"}
          </span>
        </div>
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
                <span className="text-[10px] font-bold text-slate-500 tracking-wide whitespace-nowrap">
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
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
            + Additional Specs Available
          </p>
        )}
      </div>

      <div className="flex-grow" />
      {/* FOOTER: Price and Symmetrical Actions */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/50">
        {/* PRICE: High-density italic currency display */}
        <p className="text-2xl font-black text-white italic">
          ${" "}
          {Number(product.price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>

        {/* 🚀 THE ACTION SECTOR: Role-Based Intelligence */}
        <div className="relative h-10 flex items-center justify-end min-w-[60px]">
          {isAdmin ? (
            /* 🛡️ 1. ADMIN FORGE MODE: Full Power Tools (Edit/Delete) */
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === product.id ? null : product.id);
                }}
                className={`p-2 rounded-xl transition-all duration-200 border ${
                  openMenuId === product.id
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40"
                    : "bg-slate-950/50 border-slate-800 text-slate-500 hover:text-white hover:border-slate-700"
                }`}
              >
                <MoreVertical size={20} />
              </button>

              {/* DROPDOWN MENU */}
              {openMenuId === product.id && (
                <div className="absolute right-0 bottom-full mb-3 w-40 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(product);
                    }}
                    className="w-full px-4 py-3 text-left text-[10px] font-black text-slate-400 hover:bg-slate-800 hover:text-white transition-all uppercase tracking-widest flex items-center justify-between group"
                  >
                    Edit Details
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(product.id);
                    }}
                    className="w-full px-4 py-3 text-left text-[10px] font-black text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest border-t border-slate-800/50 flex items-center justify-between group"
                  >
                    Delete SKU
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              )}
            </div>
          ) : /* 🚀 2. SHOWROOM MODE: Split Logic for Customer vs Admin */
          authService.getCurrentUser()?.roles?.includes("ROLE_ADMIN") ? (
            /* 🛡️ ADMIN VIEWING SHOWROOM: Show "Manage" Portal */
            <button
              onClick={(e) => {
                e.stopPropagation(); // 🛡️ Prevents opening the specs drawer
                navigate("/admin/products"); // 🚀 THE VORTEX: Jump back to management
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition-all group"
              title="Jump to Admin Dashboard"
            >
              <Settings
                size={14}
                className="group-hover:rotate-90 transition-transform duration-500"
              />
              <span className="text-[9px] font-black uppercase tracking-widest">Manage</span>
            </button>
          ) : (
            /* 🛒 GUEST/CUSTOMER VIEWING SHOWROOM: Show "Add to Basket" */
            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Adding ${product.name} to Basket...`);
                // addToBasket(product);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-500/20 hover:border-blue-500 hover:bg-blue-600/10 transition-all active:scale-95 group"
            >
              <ShoppingBasket
                size={14}
                className="text-blue-500 group-hover:scale-110 transition-transform"
              />
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.1em]">
                Add
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
