import { useState, useEffect } from "react";
import { productService } from "../services/productService";
import DeleteModal from "../components/DeleteModal";
import AddProductModal from "../components/AddProductModal";
import ProductDetailsDrawer from "../components/ProductDetailsDrawer";

export default function ProductsPage() {
  const [productsPage, setProductsPage] = useState({ content: [], totalElements: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSkus: 0,
    lowStockCount: 0,
    totalValue: 0,
    topSeller: "N/A",
  });
  const [deleteTarget, setDeleteTarget] = useState(null); // Stores { id, name }
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12); // Default to our 3-column grid size

  useEffect(() => {
    const closeAll = () => setOpenMenuId(null);
    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  // 2. The "Open Modal" Trigger (Replaces your old handleDelete)
  const triggerDelete = (product) => {
    setDeleteTarget({ id: product.id, name: product.name });
  };

  // 3. The "Execute Purge" Logic (The actual API call)
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await productService.deleteProduct(deleteTarget.id);

      // 1. OPTIMISTIC UI: Remove the card from the local state
      setProductsPage((prev) => ({
        ...prev,
        content: prev.content.filter((p) => p.id !== deleteTarget.id),
        totalElements: prev.totalElements - 1,
      }));

      // 2. REFRESH STATS
      loadStats();

      // 3. CLOSE MODAL
      setDeleteTarget(null);
    } catch (err) {
      console.error("[ProductsPage] Purge failed:", err.message);
      setDeleteTarget(null); // Close on error too
    }
  };

  const loadStats = async () => {
    try {
      // 🚀 THE FIX: This now matches your service's export exactly
      const data = await productService.getInventoryStats();
      setStats(data);
    } catch (err) {
      console.error("[ProductsPage] Failed to fetch stats:", err.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts({
        search: searchQuery,
        page: currentPage, // 🚀 Uses your state (starts at 0)
        size: pageSize, // 🚀 Uses your state (starts at 12)
        sort: "id,desc", // 🚀 Matches your Controller's @RequestParam
      });
      setProductsPage(data);
    } catch (err) {
      console.error("[ProductsPage] Error fetching catalog:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. The Dashboard Refresher
  const refreshDashboard = async () => {
    // Fire both requests in parallel for maximum "Veloce" speed
    try {
      await Promise.all([fetchProducts(), loadStats()]);
    } catch (err) {
      console.error("[ProductsPage] Refresh failed:", err.message);
    }
  };

  // THE RAPTOR DEBOUNCE
  useEffect(() => {
    const timer = setTimeout(refreshDashboard, 400);
    return () => clearTimeout(timer);
    // 🚀 ADDED dependencies so 'Next' and 'Density' work!
  }, [searchQuery, currentPage, pageSize]);

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

  const handleCreateProduct = async (formData) => {
    setIsSaving(true);
    try {
      // THE CLEAN DATA PUSH: No 'status' included!
      const cleanData = {
        name: formData.name,
        sku: formData.sku.toUpperCase().trim(),
        category: formData.category,
        manufacturer: formData.manufacturer || "Veloce Forge",

        // Numbers must be cast to satisfy @Digits and @Min constraints
        price: parseFloat(formData.price) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
        quantityInStock: parseInt(formData.quantityInStock) || 0,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 10,

        imageUrl: formData.imageUrl,
        attributes: formData.attributes,

        // Audit Data (Matches @NotBlank in your DTO)
        currencyCode: "USD",
        createdBy: "admin",
      };

      await productService.createProduct(cleanData);

      // SUCCESS: Close modal and refresh the 1400px high-density grid
      await refreshDashboard();
      setIsAdding(false);
    } catch (err) {
      // Log the specific backend @Validation messages on your 27" monitor
      const errors = err.response?.data?.errors;
      console.error("Forge failed:", errors || err.message);
      alert(errors ? errors.join("\n") : "Check the form data for errors.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* 1. COMMAND BAR (Search & Actions) */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 p-4 shrink-0">
        <div className="flex items-center justify-between max-w-[1400px]">
          {/* SEARCH COMMAND BAR */}
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
              placeholder="Search by SKU, Name, or Category..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-10 py-2 text-xs text-white focus:border-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* 🚀 THE CLEAR BUTTON: Appears only if query exists */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")} // Instant Reset
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white hover:bg-slate-800 rounded-md transition-all animate-in fade-in zoom-in-75 duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg active:scale-95 transition-all"
          >
            + Add Product
          </button>
        </div>
      </header>

      {/* 2. THE HIGH-DENSITY WORKSPACE */}
      <main className="flex-1 overflow-y-auto p-12 bg-slate-950">
        <div className="max-w-[1400px] space-y-10">
          {/* INVENTORY METRICS COMMAND CENTER */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Total SKUs
              </p>
              <p className="text-3xl font-black text-white italic tracking-tighter">
                {stats.totalSkus}
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Stock Value
              </p>
              <p className="text-3xl font-black text-blue-400 italic tracking-tighter">
                ${stats.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div
              className={`p-5 rounded-3xl border transition-all duration-700 shadow-2xl ${
                stats.lowStockCount > 0
                  ? "bg-amber-500/10 border-amber-500/40 shadow-amber-900/20"
                  : "bg-slate-900/40 border-slate-800/60"
              }`}
            >
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Low Stock
              </p>
              <p
                className={`text-3xl font-black italic tracking-tighter ${stats.lowStockCount > 0 ? "text-amber-500 animate-pulse" : "text-white"}`}
              >
                {stats.lowStockCount}
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Top Item
              </p>
              <p className="text-lg font-bold text-white italic truncate mt-1 tracking-wide">
                {stats.topSeller}
              </p>
            </div>
          </div>

          {/* 🚀 CONDITIONAL RENDER: GRID OR EMPTY STATE */}
          <div className="mt-10">
            {productsPage.content && productsPage.content.length > 0 ? (
              /* CASE A: SHOW THE PRODUCT MATRIX */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {productsPage.content.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-900/50 border border-slate-800 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col"
                  >
                    {/* 🚀 IMAGE SECTION: Single layer, high-intent hit area */}
                    <div
                      onClick={() => setViewingProduct(product)}
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
                      <span className="text-[9px] font-mono bg-slate-950 px-2 py-1 rounded-lg text-slate-500 border border-slate-800 uppercase">
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

                    {/* PRODUCT TITLE */}
                    <h3
                      onClick={() => setViewingProduct(product)}
                      className="text-xl font-black text-white italic uppercase tracking-normal truncate mb-4 cursor-pointer hover:text-blue-400 transition-all duration-300"
                    >
                      {product.name}
                    </h3>

                    {/* TECH SPECS: Consistent 3-row layout */}
                    <div className="space-y-1 mb-6 h-16 overflow-hidden">
                      {product.attributes && Object.entries(product.attributes).length > 0 ? (
                        Object.entries(product.attributes)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between text-[10px]">
                              <span className="text-slate-500 uppercase font-black tracking-tighter">
                                {key}:
                              </span>
                              <span className="text-slate-300 font-medium truncate ml-4">
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
                        $ {Number(product.price).toFixed(2)}
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
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
                            <button className="w-full px-4 py-2 text-left text-[10px] font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors uppercase tracking-widest">
                              Edit Details
                            </button>
                            <button
                              onClick={() => triggerDelete(product)}
                              className="w-full px-4 py-2 text-left text-[10px] font-bold text-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-widest border-t border-slate-800/50"
                            >
                              Delete SKU
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* CASE B: SHOW THE ENTERPRISE EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-800/50 rounded-[3rem] bg-slate-900/10 animate-in fade-in zoom-in-95 duration-700">
                <div className="w-20 h-20 bg-blue-500/5 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/10">
                  <svg
                    className="w-10 h-10 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white italic uppercase tracking-normal mb-2">
                  Inventory Catalog Empty
                </h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-center max-w-xs leading-relaxed">
                  There are no products currently listed.
                  <br /> Add your first item to begin managing your stock.
                </p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all active:scale-95"
                >
                  <span className="text-lg">+</span>Create New Product
                </button>
              </div>
            )}
          </div>
          {/* PAGINATION & DENSITY COMMAND BAR */}
          <footer className="flex items-center justify-between pt-10 border-t border-slate-800/50 mt-10 mb-10">
            {/* LEFT: DENSITY SELECTOR */}
            <div className="flex items-center gap-4">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Density
              </p>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0); // Reset to first page when changing density
                }}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-bold text-white uppercase outline-none focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-800 appearance-none"
              >
                {[12, 24, 48].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} per page
                  </option>
                ))}
              </select>
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                Showing {productsPage.numberOfElements} of {productsPage.totalElements} Parts
              </p>
            </div>

            {/* RIGHT: NAVIGATION CONTROLS */}
            <div className="flex gap-3 items-center">
              <button
                disabled={productsPage.first}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-bold text-white uppercase hover:bg-slate-800 disabled:opacity-20 transition-all active:scale-95"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {[...Array(productsPage.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 rounded-2xl text-[10px] font-bold transition-all ${
                      currentPage === i
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-900/40"
                        : "bg-slate-900 text-slate-500 border border-slate-800 hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={productsPage.last}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-[10px] font-bold text-white uppercase hover:bg-slate-800 disabled:opacity-20 transition-all active:scale-95"
              >
                Next
              </button>
            </div>
          </footer>
        </div>
      </main>

      {/* OVERLAYS */}
      <DeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.name}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <AddProductModal
        isOpen={isAdding}
        onCancel={() => setIsAdding(false)}
        onSave={handleCreateProduct}
        isSaving={isSaving}
      />
      <ProductDetailsDrawer
        isOpen={!!viewingProduct}
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
      />
    </div>
  );
}
