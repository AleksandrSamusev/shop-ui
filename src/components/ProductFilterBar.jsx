import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, RotateCcw } from "lucide-react";

export default function ProductFilterBar({ filters, onFilterChange, onReset }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);
  const categories = [
    "Communication Systems",
    "Data Systems",
    "Defensive Systems",
    "Diagnostics",
    "Docking Systems",
    "Electrical Systems",
    "Emergency Systems",
    "Energy Storage",
    "Fuel Systems",
    "Hull Repair Systems",
    "Hull Systems",
    "Maintenance Tools",
    "Misc",
    "Navigation Systems",
    "Power Systems",
    "Propulsion Systems",
    "Repair Kits",
    "Sensor Systems",
    "Structural Components",
    "Thermal Systems",
  ];

  // Close dropdown if clicking outside the 1400px horizon
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4 mb-10 p-4 bg-slate-900/40 border border-slate-800/60 rounded-3xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-500">
      {/* 1. CUSTOM CATEGORY SELECT */}
      <div className="flex-1 max-w-[260px] relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full h-[48px] bg-slate-950 border border-slate-800 rounded-2xl px-4 flex items-center justify-between text-[10px] font-bold text-white uppercase tracking-wide hover:border-blue-500/50 transition-all outline-none"
        >
          <span className="truncate">{filters.category || "All Categories"}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-600 transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* 🚀 THE SCROLLABLE LIST: Limited to 300px with Custom Scrollbar */}
        {isCategoryOpen && (
          <div className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
              <button
                onClick={() => {
                  onFilterChange("category", "");
                  setIsCategoryOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-[10px] font-black text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-colors uppercase tracking-widest"
              >
                All Categories
              </button>

              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onFilterChange("category", cat);
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-[10px] font-bold rounded-xl transition-colors uppercase tracking-widest flex items-center justify-between group ${
                    filters.category === cat
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  } ${cat === "Misc" ? "border-t border-slate-800/40 mt-1 pt-4" : ""}`}
                >
                  {cat}
                  {filters.category === cat && <Check size={12} className="text-white" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. PRICE RANGE: MIN */}
      <div className="relative w-[130px]">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700">
          $
        </span>
        <input
          type="number"
          placeholder="MIN PRICE"
          value={filters.minPrice || ""}
          onChange={(e) => onFilterChange("minPrice", e.target.value)}
          className="w-full h-[48px] bg-slate-950 border border-slate-800 rounded-2xl pl-8 pr-4 text-[10px] font-bold text-white uppercase tracking-wide outline-none focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {/* 3. PRICE RANGE: MAX */}
      <div className="relative w-[130px]">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700">
          $
        </span>
        <input
          type="number"
          placeholder="MAX PRICE"
          value={filters.maxPrice || ""}
          onChange={(e) => onFilterChange("maxPrice", e.target.value)}
          className="w-full h-[48px] bg-slate-950 border border-slate-800 rounded-2xl pl-8 pr-4 text-[10px] font-bold text-white uppercase tracking-wide outline-none focus:border-blue-500 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {/* 4. DYNAMIC SORT ENGINE */}
      <div className="flex-1 max-w-[200px] relative">
        <select
          value={filters.sortBy || "id,desc"}
          onChange={(e) => onFilterChange("sortBy", e.target.value)}
          className="w-full h-[48px] bg-slate-950 border border-slate-800 rounded-2xl px-4 text-[10px] font-bold text-white uppercase tracking-widest outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
        >
          <option value="id,desc">Newest First</option>
          <option value="price,asc">Price: Low to High</option>
          <option value="price,desc">Price: High to Low</option>
          <option value="quantityInStock,asc">Stock: Low to High</option>
          <option value="name,asc">Name: A-Z</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 pointer-events-none" />
      </div>

      {/* 5. RESET ACTION */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 h-[48px] text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all group"
      >
        <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
        Reset
      </button>
    </div>
  );
}
