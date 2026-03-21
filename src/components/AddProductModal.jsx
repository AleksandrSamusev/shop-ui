import { useState, useEffect } from "react";
import { CATEGORIES } from "../shared/constants/categories";

// GLOBAL CONFIGURATION (Moved outside to prevent re-renders)
const FORGE_CONFIG = {
  MAX_ATTRIBUTES: 20,
  MIN_ATTRIBUTES: 1,
  VISIBLE_ON_CARD: 3,
  NAME_MAX_LENGTH: 150,
  DEFAULT_CATEGORY: "Keyboards",
  DEFAULT_MANUFACTURER: "Veloce Forge",
  CATEGORIES: ["Keyboards", "Mice", "Audio", "Desk Aesthetics"],
};

export default function AddProductModal({ isOpen, onClose, onSave, isSaving, product = null }) {
  const isEditMode = !!product; // Boolean helper for UI logic

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: FORGE_CONFIG.DEFAULT_CATEGORY,
    manufacturer: FORGE_CONFIG.DEFAULT_MANUFACTURER,
    price: "",
    costPrice: "",
    quantityInStock: "",
    lowStockThreshold: 10,
    imageUrl: "",
    attributes: {},
  });

  const [errors, setErrors] = useState({});
  const [attributeRows, setAttributeRows] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        // 🕵️ EDIT MODE: Fill the form with existing data
        setFormData({
          ...product,
          // 🚀 THE FIX: Use '??' (Nullish Coalescing) instead of '||'
          // This ensures that if the value is 0, it stays 0, but if it's null, it becomes ""
          price: product.price?.toString() ?? "",
          costPrice: product.costPrice?.toString() ?? "",
          quantityInStock: product.quantityInStock?.toString() ?? "",
          lowStockThreshold: product.lowStockThreshold?.toString() ?? "10",
        });

        // Map the technical attributes back into our row structure
        if (product.attributes) {
          const rows = Object.entries(product.attributes).map(([key, value]) => ({
            id: crypto.randomUUID(),
            key,
            value: String(value),
          }));
          setAttributeRows(rows);
        }
      } else {
        // 🆕 CREATE MODE: Reset to empty (Your existing reset logic)
        setFormData({
          sku: "",
          name: "",
          category: FORGE_CONFIG.DEFAULT_CATEGORY,
          manufacturer: FORGE_CONFIG.DEFAULT_MANUFACTURER,
          price: "",
          costPrice: "",
          quantityInStock: "",
          lowStockThreshold: 10,
          imageUrl: "",
          attributes: {},
        });
        setAttributeRows([]);
      }
      setErrors({});
    }
  }, [isOpen, product]);

  // LOGIC HANDLERS
  const handleAddAttribute = () => {
    if (attributeRows.length < FORGE_CONFIG.MAX_ATTRIBUTES) {
      // 🚀 THE FIX: Add a unique 'id' to every new row
      setAttributeRows((prev) => [...prev, { id: crypto.randomUUID(), key: "", value: "" }]);
    }
  };

  const updateAttributeRow = (index, field, val) => {
    const updated = [...attributeRows];
    updated[index][field] = val;
    setAttributeRows(updated);
  };

  const removeAttributeRow = (index) => {
    setAttributeRows(attributeRows.filter((_, i) => i !== index));
  };

  // 2. THE HANDLER: Replaces the 'alert' with localized state mapping
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔥 Submit Triggered!");

    // 1. 🚀 RESET: Clear old errors before the new attempt
    setErrors({});

    // 2. 🛡️ CLIENT-SIDE GUARD (The Address Pattern): Instant validation
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "PRODUCT NAME IS REQUIRED";
    if (!formData.sku.trim()) newErrors.sku = "SKU IDENTIFIER IS REQUIRED";
    if (!formData.category) newErrors.category = "CATEGORY SELECTION REQUIRED";

    // Numeric checks: Ensure they exist and are not negative
    if (formData.price === "" || parseFloat(formData.price) <= 0) {
      newErrors.price = "VALID UNIT PRICE REQUIRED";
    }
    if (formData.costPrice === "" || parseFloat(formData.costPrice) <= 0) {
      newErrors.costPrice = "VALID COST PRICE REQUIRED";
    }
    if (formData.quantityInStock === "") {
      newErrors.quantityInStock = "INITIAL STOCK IS REQUIRED";
    }

    // 3. 🚀 UPDATE UI: Set local errors immediately
    setErrors(newErrors);

    // 4. 🛑 STOP: If we have local errors, do NOT send the request (prevents flickering)
    if (Object.keys(newErrors).length > 0) {
      console.log("🛑 Guard Blocked Submission:", newErrors); // 🚀 STEP 2: Check if validation is stopping you.
      setErrors(newErrors);
      return;
    }

    // 5. 🛠️ DATA PREPARATION: Transform attribute rows to Map
    const attributesMap = attributeRows.reduce((acc, row) => {
      const key = row.key.trim();
      if (key) acc[key] = row.value.trim();
      return acc;
    }, {});

    console.log("📤 Sending Data:", { ...formData, attributes: attributesMap }); // 🚀 STEP 3: Verify the payload.

    // 6. 🌐 BACKEND SYNC: Deep validation (e.g. Duplicate SKU)
    try {
      // We 'await' here so we can catch server-side @Valid errors
      await onSave({ ...formData, attributes: attributesMap });
      console.log("✅ Save Successful");
    } catch (err) {
      console.error("❌ Save Failed:", err);
      if (err.response?.data?.errors) {
        const backendErrors = { ...newErrors };

        // 🕵️ STABILITY SORT: Shortest messages first to prevent "flipping"
        const sorted = [...err.response.data.errors].sort((a, b) => a.length - b.length);

        sorted.forEach((msg) => {
          const lowerMsg = msg.toLowerCase();
          const parts = msg.split(":");
          const cleanMsg = (parts.length > 1 ? parts[1] : msg).trim().toUpperCase();

          // Map server-side findings to the correct UI field
          if (lowerMsg.includes("sku") && !backendErrors.sku) backendErrors.sku = cleanMsg;
          if (lowerMsg.includes("name") && !backendErrors.name) backendErrors.name = cleanMsg;
          if (lowerMsg.includes("costprice") && !backendErrors.costPrice)
            backendErrors.costPrice = cleanMsg;
          if (lowerMsg.includes("price") && !backendErrors.price) backendErrors.price = cleanMsg;
          if (lowerMsg.includes("quantityinstock") && !backendErrors.quantityInStock)
            backendErrors.quantityInStock = cleanMsg;
          if (lowerMsg.includes("lowstockthreshold") && !backendErrors.lowStockThreshold)
            backendErrors.lowStockThreshold = cleanMsg;
          if (lowerMsg.includes("imageurl") && !backendErrors.imageUrl)
            backendErrors.imageUrl = cleanMsg;
        });

        setErrors(backendErrors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
      {/* LAYER 2: THE PHYSICAL BOX (Panel Wrapper) */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* LAYER 3: THE HEADER (Static) */}
        <header className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900 shrink-0">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              {/* 🚀 THE DYNAMIC TITLE: Professional Toggle */}
              {isEditMode ? "Update Product" : "Add New Product"}
            </h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Product Specification Form v1.0
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
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

        {/* LAYER 4: THE FORM CONTENT */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-10 p-8 max-h-[75vh] overflow-y-auto custom-scrollbar"
        >
          {/* ROW 1: PRIMARY IDENTITY (Name, Price, Cost) */}
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-6 items-end">
            {/* 1. PRODUCT NAME */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Product Name
                </label>
              </div>

              <div className="relative">
                <input
                  placeholder="e.g. NEXUS-7 ION THRUSTER"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  /* 🚀 THE SYMMETRY LOCK: h-[48px] ensures Row 1 remains perfectly level */
                  className={`w-full h-[48px] bg-slate-950 border rounded-2xl px-4 text-sm text-white focus:border-blue-500 outline-none transition-all ${
                    errors.name
                      ? "border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                      : "border-slate-800"
                  }`}
                />

                {/* 🚀 THE TOP-ANCHOR FIX: 'top-full mt-1' ensures the first line is always the same distance from the box */}
                {errors.name && (
                  <span className="absolute top-full left-0 w-full px-2 mt-1 text-[9px] font-bold text-red-500 uppercase animate-in fade-in slide-in-from-top-1 tracking-tighter leading-tight">
                    {errors.name}
                  </span>
                )}
              </div>
            </div>

            {/* 2. UNIT PRICE */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Unit Price ($)
                </label>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({ ...formData, price: e.target.value });
                    if (errors.price) setErrors({ ...errors, price: null });
                  }}
                  /* 🚀 THE SYMMETRY LOCK: h-[48px] ensures the grid remains perfectly level */
                  className={`w-full h-[48px] bg-slate-950 border rounded-2xl px-4 text-sm text-white focus:border-blue-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    errors.price
                      ? "border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                      : "border-slate-800"
                  }`}
                />

                {/* 🚀 THE TOP-ANCHOR FIX: 'top-full mt-1' ensures the first line is always tight to the box */}
                {errors.price && (
                  <span className="absolute top-full left-0 w-full px-2 mt-1 text-[9px] font-bold text-red-500 uppercase animate-in fade-in slide-in-from-top-1 tracking-tighter leading-tight">
                    {errors.price}
                  </span>
                )}
              </div>
            </div>

            {/* 3. COST PRICE */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Cost Price ($)
                </label>
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.costPrice}
                  onChange={(e) => {
                    setFormData({ ...formData, costPrice: e.target.value });
                    if (errors.costPrice) setErrors({ ...errors, costPrice: null });
                  }}
                  /* 🚀 THE SYMMETRY LOCK: h-[48px] ensures the grid remains perfectly level */
                  className={`w-full h-[48px] bg-slate-950 border rounded-2xl px-4 text-sm text-white focus:border-blue-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    errors.costPrice
                      ? "border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                      : "border-slate-800"
                  }`}
                />

                {/* 🚀 THE TOP-ANCHOR FIX: 'top-full mt-1' ensures the gap is consistent regardless of line count */}
                {errors.costPrice && (
                  <span className="absolute top-full left-0 w-full px-2 mt-1 text-[9px] font-bold text-red-500 uppercase animate-in fade-in slide-in-from-top-1 tracking-tighter leading-tight">
                    {errors.costPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ROW 2: THE LOGISTICS (A balanced 4-column grid) */}
          <div className="grid grid-cols-4 gap-6 items-end">
            {/* 🚀 1. SKU IDENTIFIER: Symmetrical High-Density Input */}
            <div className="space-y-2 relative">
              {" "}
              {/* 🛡️ Added relative to the parent for absolute positioning */}
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  SKU Identifier
                  {product && <span className="ml-2 text-blue-500/50 italic">[Locked]</span>}
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="VF-SP-001"
                  value={formData.sku}
                  readOnly={!!product}
                  onChange={(e) => {
                    if (!product) {
                      setFormData({ ...formData, sku: e.target.value.toUpperCase() });
                      if (errors.sku) setErrors({ ...errors, sku: null });
                    }
                  }}
                  className={`w-full h-[48px] bg-slate-950 border rounded-2xl px-4 text-sm font-bold text-white focus:border-blue-500 outline-none transition-all uppercase ${
                    product
                      ? "opacity-60 cursor-not-allowed border-slate-900 bg-slate-900/50"
                      : "border-slate-800"
                  } ${
                    errors.sku
                      ? "border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                      : ""
                  }`}
                />

                {/* 🚀 THE SYMMETRICAL SIGNAL: Using your standardized absolute format */}
                {errors.sku && (
                  <span className="absolute top-full left-0 w-full px-2 mt-1 text-[9px] font-bold text-red-500 uppercase animate-in fade-in slide-in-from-top-1 tracking-tighter leading-tight">
                    {errors.sku}
                  </span>
                )}
              </div>
            </div>

            {/* 2. CATEGORY DROPDOWN */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Category
              </label>
              <div className="relative group">
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  /* 🚀 THE SYMMETRY FIX: 'h-[48px]' ensures the select is NOT shorter than the SKU input */
                  className="w-full h-[48px] bg-slate-950 border border-slate-800 rounded-2xl px-4 text-sm text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer hover:bg-slate-900"
                >
                  <option value="" disabled className="bg-slate-900 text-slate-500">
                    Select Category
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-slate-900 text-white">
                      {cat}
                    </option>
                  ))}
                </select>
                {/* Custom Chevron - Centered within the forced 48px height */}
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 group-hover:text-blue-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 3. INITIAL STOCK */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Initial Stock
                </label>
              </div>

              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  value={formData.quantityInStock}
                  onChange={(e) => {
                    setFormData({ ...formData, quantityInStock: e.target.value });
                    if (errors.quantityInStock) setErrors({ ...errors, quantityInStock: null });
                  }}
                  /* 🚀 THE SYMMETRY LOCK: h-[48px] ensures the grid remains perfectly level */
                  className={`w-full h-[48px] bg-slate-950 border rounded-2xl px-4 text-sm text-white focus:border-blue-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                    errors.quantityInStock
                      ? "border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                      : "border-slate-800"
                  }`}
                />

                {/* 🚀 THE TOP-ANCHOR FIX: 'top-full mt-1' and 'w-full' for consistent wrapping under the field */}
                {errors.quantityInStock && (
                  <span className="absolute top-full left-0 w-full px-2 mt-1 text-[9px] font-bold text-red-500 uppercase animate-in fade-in slide-in-from-top-1 tracking-tighter leading-tight">
                    {errors.quantityInStock}
                  </span>
                )}
              </div>
            </div>

            {/* 4. LOW THRESHOLD */}
            <div className="space-y-2">
              {/* HEADER: Label + Dynamic Error Message */}
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Low Threshold
                </label>
                {/* 🚀 THE ERROR LABEL: Fires if threshold is negative or invalid */}
                {errors.lowStockThreshold && (
                  <span className="text-[9px] font-bold text-red-500 uppercase animate-in fade-in slide-in-from-right-2">
                    {errors.lowStockThreshold}
                  </span>
                )}
              </div>

              <input
                type="number"
                placeholder="10"
                value={formData.lowStockThreshold}
                onChange={(e) => {
                  setFormData({ ...formData, lowStockThreshold: e.target.value });
                  if (errors.lowStockThreshold) setErrors({ ...errors, lowStockThreshold: null }); // 🚀 Clear on type
                }}
                /* 🚀 THE SYNC + ERROR FIX: Locked h-[48px], red border/glow if error exists */
                className={`w-full h-[48px] bg-slate-950 border rounded-2xl px-4 text-sm text-white focus:border-blue-500 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  errors.lowStockThreshold
                    ? "border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    : "border-slate-800"
                }`}
              />
            </div>
          </div>

          {/* ROW 3: THE TECHNICAL ASSETS (Symmetrical 2-column grid) */}
          {/* 🚀 FIXED: Tightened pt-10 to pt-6 for a cleaner transition */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-800/50 items-start">
            {/* 1. IMAGE BASE64 ASSET */}
            {/* 🚀 FIXED: space-y-2 to space-y-1.5 to pull the label closer to the box */}
            <div className="space-y-1.5 flex flex-col">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                Image Base64 String
              </label>
              <textarea
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full h-[160px] bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[10px] font-mono text-slate-400 focus:border-blue-500 outline-none resize-none custom-scrollbar"
                placeholder="data:image/webp;base64,..."
              />
            </div>

            {/* 2. TECHNICAL SPECIFICATIONS ASSET */}
            {/* 🚀 FIXED: space-y-1.5 matches the left side for perfect symmetry */}
            <div className="space-y-1.5 flex flex-col">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Technical Specifications
                </label>
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  className="text-[10px] font-black text-blue-400 hover:text-white uppercase transition-colors tracking-widest"
                >
                  + Add Spec
                </button>
              </div>

              {/* Specification Container */}
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl h-[160px] overflow-y-auto custom-scrollbar">
                {attributeRows.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-[10px] text-slate-800 italic uppercase tracking-widest">
                      No custom attributes defined
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attributeRows.map((row, index) => (
                      <div
                        key={row.id}
                        className="grid grid-cols-[1fr_1.5fr_auto] gap-3 items-center group animate-in slide-in-from-left-2"
                      >
                        <input
                          placeholder="Key"
                          value={row.key}
                          onChange={(e) => updateAttributeRow(index, "key", e.target.value)}
                          className="bg-transparent border-b border-slate-800 text-[10px] text-slate-500 p-1 outline-none focus:border-blue-500 transition-colors uppercase font-bold"
                        />
                        <input
                          placeholder="Value"
                          value={row.value}
                          onChange={(e) => updateAttributeRow(index, "value", e.target.value)}
                          className="bg-transparent border-b border-slate-800 text-[10px] text-white p-1 outline-none focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttributeRow(index)}
                          className="text-slate-700 hover:text-red-500 transition-colors p-1"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LAYER 4: ACTIONS */}
          <div className="flex justify-end items-center gap-4 mt-2 pt-6 border-t border-slate-800/40">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white hover:bg-slate-800 rounded-2xl transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="w-[200px] h-[48px] bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              {isSaving ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                /* 🚀 THE DYNAMIC BUTTON TEXT */
                <span>{isEditMode ? "Update Product" : "Save Product"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
