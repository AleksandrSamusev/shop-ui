import { useState, useEffect } from "react";

// 1. GLOBAL CONFIGURATION (Moved outside to prevent re-renders)
const FORGE_CONFIG = {
  MAX_ATTRIBUTES: 20,
  MIN_ATTRIBUTES: 1,
  VISIBLE_ON_CARD: 3,
  NAME_MAX_LENGTH: 150,
  DEFAULT_CATEGORY: "Keyboards",
  DEFAULT_MANUFACTURER: "Veloce Forge",
  CATEGORIES: ["Keyboards", "Mice", "Audio", "Desk Aesthetics"],
};

export default function AddProductModal({ isOpen, onCancel, onSave, isSaving }) {
  // 2. STATE
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

  const [attributeRows, setAttributeRows] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      // 1. Reset the core form data
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

      // 2. Reset the dynamic attribute rows
      setAttributeRows([]);
    }
  }, [isOpen]); // Triggers every time the modal opens or closes

  // 3. LOGIC HANDLERS
  const handleAddAttribute = () => {
    // FIXED: Changed PRODUCT_LIMITS to FORGE_CONFIG
    if (attributeRows.length < FORGE_CONFIG.MAX_ATTRIBUTES) {
      setAttributeRows((prev) => [...prev, { key: "", value: "" }]);
    } else {
      console.warn(`[Forge] Maximum limit of ${FORGE_CONFIG.MAX_ATTRIBUTES} attributes reached.`);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const attributesMap = attributeRows.reduce((acc, row) => {
      const key = row.key.trim();
      if (key) acc[key] = row.value.trim();
      return acc;
    }, {});

    onSave({ ...formData, attributes: attributesMap });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onCancel} />

      {/* MODAL FORM */}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
      >
        <header className="mb-10">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Add New Product
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">
            Product Specification Form v1.0
          </p>
        </header>

        <div className="grid grid-cols-2 gap-10">
          {/* LEFT COLUMN: CORE DATA */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Product Name
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="e.g. Apex-Pro Mouse"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  SKU
                </label>
                <input
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none"
                  placeholder="VF-MS-001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="..."
                >
                  {FORGE_CONFIG.CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Image Base64 String
              </label>
              <textarea
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[10px] text-slate-400 focus:border-blue-500 outline-none h-24 font-mono"
                placeholder="data:image/webp;base64..."
              />
            </div>
          </div>

          {/* RIGHT COLUMN: FINANCIALS & SPECS */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Price ($)
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const formatted = parseFloat(e.target.value).toFixed(2);
                      setFormData({ ...formData, price: formatted });
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Cost ($)
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const formatted = parseFloat(e.target.value).toFixed(2);
                      setFormData({ ...formData, costPrice: formatted });
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Initial Stock
                </label>
                <input
                  required
                  type="number"
                  value={formData.quantityInStock}
                  onChange={(e) => setFormData({ ...formData, quantityInStock: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Low Threshold
                </label>
                <input
                  required
                  type="number"
                  value={formData.lowStockThreshold}
                  onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* TECHNICAL SPECIFICATIONS SECTION */}
            <div className="space-y-2">
              {/* Label and Add Button - Now outside the container */}
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

              {/* Specification Container - Matched background, radius, and height */}
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl h-[120px] overflow-y-auto custom-scrollbar">
                {attributeRows.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-[10px] text-slate-700 italic uppercase tracking-widest">
                      No custom attributes defined
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attributeRows.map((row, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[1fr_1.5fr_auto] gap-3 items-center group animate-in slide-in-from-left-2"
                      >
                        <input
                          placeholder="Key (e.g. DPI)"
                          value={row.key}
                          onChange={(e) => updateAttributeRow(index, "key", e.target.value)}
                          className="bg-transparent border-b border-slate-800 text-[10px] text-slate-400 p-1 outline-none focus:border-blue-500 transition-colors"
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
                          className="text-slate-600 hover:text-red-500 transition-colors p-1"
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
        </div>

        <footer className="mt-12 flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-8 py-4 rounded-2xl bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            disabled={isSaving}
            type="submit"
            className="px-10 py-4 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Product"}
          </button>
        </footer>
      </form>
    </div>
  );
}
