import { useState, useEffect } from "react";
import { productService } from "../services/productService";

export default function ProductsPage() {
  const [productsPage, setProductsPage] = useState({ content: [], totalElements: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts({
        search: searchQuery,
        size: 12, // Higher density for 27" screens
        sortBy: "id,desc",
      });
      setProductsPage(data);
    } catch (err) {
      console.error("[ProductsPage] Error fetching catalog:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // RAPTOR DEBOUNCE: Trigger search 400ms after typing stops
  useEffect(() => {
    const timer = setTimeout(fetchProducts, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (loading) {
    return (
        <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center space-y-4">
            {/* Veloce Blue Spinner */}
            <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">
                Igniting the Forge...
            </p>
        </div>
    );
}

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* 1. COMMAND BAR (Search & Actions) */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 p-4 shrink-0">
        <div className="flex items-center justify-between max-w-[1400px]">
          <div className="relative flex-1 max-w-md group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Hunt by SKU, Name, or Category..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:border-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-tighter shadow-lg active:scale-95 transition-all">
            + Add Product
          </button>
        </div>
      </header>

      {/* 2. THE HIGH-DENSITY WORKSPACE */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-950">
        <div className="max-w-[1400px] space-y-10">
          {/* INVENTORY METRICS ROW */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-3xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Total SKUs
              </p>
              <p className="text-3xl font-black text-white italic">{productsPage.totalElements}</p>
            </div>
            {/* ... more metrics (Stock Value, etc.) */}
          </div>

          {/* PRODUCT MATRIX (3-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {productsPage.content.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group relative overflow-hidden"
              >
                {/* BASE64 IMAGE CONTAINER */}
                <div className="h-48 mb-6 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/50 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-700 uppercase">No Image</span>
                  )}
                </div>

                <div className="flex justify-between items-start mb-2">
                  <span className="text-[9px] font-mono bg-slate-950 px-2 py-1 rounded-lg text-slate-500 border border-slate-800">
                    {product.sku}
                  </span>
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

                <h3 className="text-lg font-black text-white italic truncate mb-4">
                  {product.name}
                </h3>

                {/* TECH SPECS (JSON ATTRIBUTES) */}
                <div className="space-y-1 mb-6">
                  {Object.entries(product.attributes || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-[10px]">
                      <span className="text-slate-500 uppercase font-bold">{key}:</span>
                      <span className="text-slate-300 font-medium">{value.toString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <p className="text-2xl font-black text-white italic">${product.price}</p>
                  <button className="p-2 text-slate-500 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
