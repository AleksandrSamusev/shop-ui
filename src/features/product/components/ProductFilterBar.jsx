import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, RotateCcw } from "lucide-react";
import Dropdown from "../../../shared/components/ui/Dropdown";
import { CATEGORIES } from "../../../shared/constants/categories";

export default function ProductFilterBar({ filters, onFilterChange, onReset }) {

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortRef = useRef(null);
  const dropdownRef = useRef(null);

  const categoryOptions = [
    { label: "All Categories", value: "" },
    ...CATEGORIES.map((cat) => ({ label: cat, value: cat })),
  ];

  const sortOptions = [
    { label: "Newest First", value: "id,desc" },
    { label: "Price: Low to High", value: "price,asc" },
    { label: "Price: High to Low", value: "price,desc" },
    { label: "Stock: Low to High", value: "quantityInStock,asc" },
    { label: "Name: A-Z", value: "name,asc" },
  ];

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4 p-5 bg-slate-900/40 border border-slate-800/60 rounded-3xl backdrop-blur-xl">
      {/* LEFT: FILTERS */}
      <div className="flex flex-wrap items-center gap-4 flex-1">
        {/* 1. CATEGORY */}
        <Dropdown
          value={filters.category}
          options={categoryOptions}
          placeholder="All Categories"
          onChange={(val) => onFilterChange("category", val)}
          className="flex-1 min-w-[220px] max-w-[280px]"
        />

        {/* 2. MIN PRICE */}
        <div className="relative w-[140px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700">
            $
          </span>
          <input
            type="number"
            placeholder="MIN PRICE"
            value={filters.minPrice || ""}
            onChange={(e) => onFilterChange("minPrice", e.target.value)}
            className="w-full h-[48px] bg-slate-950 border border-slate-800 rounded-2xl pl-8 pr-4 text-[10px] font-bold text-white uppercase tracking-wide outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* 3. MAX PRICE */}
        <div className="relative w-[140px]">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700">
            $
          </span>
          <input
            type="number"
            placeholder="MAX PRICE"
            value={filters.maxPrice || ""}
            onChange={(e) => onFilterChange("maxPrice", e.target.value)}
            className="w-full h-[48px] bg-slate-950 border border-slate-800 rounded-2xl pl-8 pr-4 text-[10px] font-bold text-white uppercase tracking-wide outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-4 ml-auto">
        {/* 4. SORT */}
        <Dropdown
          value={filters.sortBy || "id,desc"}
          options={sortOptions}
          onChange={(val) => onFilterChange("sortBy", val)}
          className="min-w-[180px] max-w-[220px]"
        />

        {/* 5. RESET */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 h-[48px] text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all group"
        >
          <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
          Reset
        </button>
      </div>
    </div>
  );
}
