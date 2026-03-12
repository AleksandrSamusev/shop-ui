import { useState } from "react";

export default function AddProductModal({ isOpen, onCancel, onSave, isSaving }) {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "Keyboards",
    manufacturer: "Veloce Forge",
    price: "",
    costPrice: "",
    quantityInStock: "",
    lowStockThreshold: 10,
    imageUrl: "",
    attributes: { switch: "", layout: "", sensor: "" },
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

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
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:border-blue-500 outline-none appearance-none"
                >
                  <option>Keyboards</option>
                  <option>Mice</option>
                  <option>Audio</option>
                  <option>Desk Aesthetics</option>
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

            {/* UPGRADED TECHNICAL ATTRIBUTES (3-Column Grid) */}
            <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-[2rem] space-y-4">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 italic">
                Technical Specifications (JSON)
              </p>
              <div className="grid grid-cols-3 gap-4">
                <input
                  placeholder="Switch"
                  className="bg-transparent border-b border-slate-800 text-[10px] text-white p-1 outline-none focus:border-blue-500 transition-colors"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attributes: { ...formData.attributes, switch: e.target.value },
                    })
                  }
                />
                <input
                  placeholder="Layout"
                  className="bg-transparent border-b border-slate-800 text-[10px] text-white p-1 outline-none focus:border-blue-500 transition-colors"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attributes: { ...formData.attributes, layout: e.target.value },
                    })
                  }
                />
                <input
                  placeholder="Sensor"
                  className="bg-transparent border-b border-slate-800 text-[10px] text-white p-1 outline-none focus:border-blue-500 transition-colors"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attributes: { ...formData.attributes, sensor: e.target.value },
                    })
                  }
                />
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
