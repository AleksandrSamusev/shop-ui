import React, { useState, useEffect, useCallback, useRef, lazy } from "react";
import { productService } from "../services/productService";
import DeleteModal from "../components/DeleteModal";
import AddProductModal from "../components/AddProductModal";
import ProductDetailsDrawer from "../components/ProductDetailsDrawer";
import ProductCard from "../components/ProductCard";
import InventoryMetrics from "../components/InventoryMetrics";
import ProductsPagination from "../components/ProductsPagination";
import GridEmptyState from "../components/GridEmptyState";
import ProductSearchBar from "../components/ProductSearchBar";
import SystemToast from "../components/SystemToast";
import ProductDeleteConfirmationModal from "../components/ProductDeleteConfirmationModal";
import ProductFilterBar from "../components/ProductFilterBar";

export default function ProductsPage() {
  const [productsPage, setProductsPage] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
  });

  const [stats, setStats] = useState({
    totalSkus: 0,
    lowStockCount: 0,
    totalValue: 0,
    topSeller: "N/A",
  });

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "id-desc",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [productToEdit, setProductToEdit] = useState(null);
  const [toast, setToast] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const productRef = useRef(productToDelete);

  const showSuccess = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 8000);
  };

  // 1. GLOBAL UI LISTENERS
  useEffect(() => {
    const closeAll = () => setOpenMenuId(null);
    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  useEffect(() => {
    productRef.current = productToDelete;
  }, [productToDelete]);

  // 2. DATA LOADERS
  const loadStats = async () => {
    try {
      const data = await productService.getInventoryStats();
      setStats(data);
    } catch (err) {
      console.error("[ProductsPage] Failed to fetch stats:", err.message);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(0);
  };

  const resetFilters = () => {
    setFilters({ category: "", minPrice: "", maxPrice: "", sortBy: "id-desc" });
    setSearchQuery("");
    setCurrentPage(0);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts({
        search: searchQuery,
        page: currentPage,
        size: pageSize,
        ...filters,
      });
      setProductsPage(data);
    } catch (err) {
      console.error("Fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. THE REFRESH ENGINE: Clean & Global
  const refreshDashboard = async () => {
    try {
      await Promise.all([fetchProducts(), loadStats()]);
    } catch (err) {
      console.error("[ProductsPage] Refresh failed:", err.message);
    }
  };

  useEffect(() => {
    // 🚀 THE ADJUSTMENT: 800ms is "Human Typing Speed"
    const debounceDelay = 800;

    const timer = setTimeout(() => {
      // 🚀 THE LOGIC GATE: Don't trigger if the search ends in a space (user is mid-sentence)
      const isTypingSpace = searchQuery.endsWith(" ");

      if (!isTypingSpace) {
        refreshDashboard();
      }
    }, debounceDelay);

    return () => clearTimeout(timer);

    // Keep all high-density dependencies
  }, [searchQuery, currentPage, pageSize, filters]);

  // 3. FIXED: Search Input Handler (Forces reset to Page 1)
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // 🚀 THE FIX: Snap back to first page for new results
  };

  // 4. FIXED: Clear Search Handler
  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(0); // 🚀 THE FIX: Snap back to first page on clear
  };

  // 6. CRUD HANDLERS
  const triggerDelete = (product) => {
    setDeleteTarget({ id: product.id, name: product.name });
  };

  const confirmDelete = useCallback(async () => {
    const currentProduct = productRef.current;
    if (!currentProduct) {
      return;
    }
    try {
      await productService.deleteProduct(currentProduct.id);
      await refreshDashboard();
      showSuccess(`${currentProduct.name.toUpperCase()} PERMANENTLY REMOVED`);
      setProductToDelete(null);
    } catch (err) {
      console.error("Destruction failed:", err);
    }
  }, [refreshDashboard]);

  const handleCreateProduct = async (formData) => {
    setIsSaving(true);
    try {
      const cleanData = {
        ...formData,
        sku: formData.sku.toUpperCase().trim(),
        price: formData.price ? parseFloat(formData.price) : null,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        quantityInStock:
          formData.quantityInStock !== "" ? parseInt(formData.quantityInStock) : null,

        lowStockThreshold:
          formData.lowStockThreshold !== "" ? parseInt(formData.lowStockThreshold) : null,
        currencyCode: "USD",
        createdBy: "admin",
      };

      await productService.createProduct(cleanData);
      setCurrentPage(0);
      await refreshDashboard();
      setIsAdding(false);
    } catch (err) {
      // 🚀 THE FIX: By throwing here, your Modal's try/catch finally takes over
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Open Modal for Creating
  const handleAddClick = () => {
    setProductToEdit(null); // Ensure it's clean for a new part
    setIsAdding(true);
  };

  // Open Modal for Updating
  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsAdding(true);
  };

  const handleUpdateProduct = async (formData) => {
    setIsSaving(true);
    try {
      // 🚀 THE FIX: Destructure both 'id' AND 'sku' out of the data
      const { id, sku, ...dataToSync } = formData;

      const cleanData = {
        ...dataToSync,
        price: dataToSync.price ? parseFloat(dataToSync.price) : null,
        costPrice: dataToSync.costPrice ? parseFloat(dataToSync.costPrice) : null,
        quantityInStock:
          dataToSync.quantityInStock !== "" ? parseInt(dataToSync.quantityInStock) : null,
        lowStockThreshold:
          dataToSync.lowStockThreshold !== "" ? parseInt(dataToSync.lowStockThreshold) : null,

        updatedBy: "admin",
        version: dataToSync.version,
      };

      await productService.updateProduct(id, cleanData);
      await refreshDashboard();
      setIsAdding(false);
      setProductToEdit(null);
      showSuccess(`${cleanData.name.toUpperCase()} SUCCESSFULLY UPDATED`);
    } catch (err) {
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 p-4 shrink-0">
        <div className="flex items-center justify-between max-w-[1400px] ml-7">
          {/* PRODUCT SEARCH */}
          <ProductSearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClick={handleClearSearch}
          />

          {/* ADD PRODUCT BUTTON */}
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg active:scale-95 transition-all"
          >
            + Add Product
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-12 bg-slate-950">
        <div className="max-w-[1400px] space-y-10">
          <InventoryMetrics stats={stats} />

          <div className="relative z-50">
            <ProductFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
          </div>

          {/* CONDITIONAL RENDER: PRODUCTS GRID OR EMPTY STATE */}
          <div className="mt-10">
            {productsPage.content && productsPage.content.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {productsPage.content.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={() => {
                      handleEditClick(product);
                      setOpenMenuId(null);
                    }}
                    onDelete={() => {
                      setProductToDelete(product); // 🚀 Change from setDeleteTarget to this
                      setOpenMenuId(null);
                    }}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    setViewingProduct={() => setViewingProduct(product)}
                  />
                ))}
              </div>
            ) : (
              <GridEmptyState onClick={() => setIsAdding(true)} />
            )}
          </div>

          {/* PAGINATION & DENSITY COMMAND BAR */}
          <ProductsPagination
            pageSize={pageSize}
            totalPages={productsPage.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
            numberOfElements={productsPage.numberOfElements}
            totalElements={productsPage.totalElements}
            first={productsPage.first}
            last={productsPage.last}
            handleSelection={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            handleClick={(pageIndex) => setCurrentPage(pageIndex)}
            handleDecreaseClick={() => setCurrentPage((prev) => prev - 1)}
            handleIncreaseClick={() => setCurrentPage((prev) => prev + 1)}
          />
        </div>
      </main>

      {/* OVERLAYS */}
      <DeleteModal
        isOpen={!!productToDelete}
        itemName={productToDelete?.name}
        onCancel={() => setProductToDelete(null)}
        onConfirm={confirmDelete}
      />
      <AddProductModal
        isOpen={isAdding}
        product={productToEdit}
        onClose={() => {
          setIsAdding(false);
          setProductToEdit(null);
        }}
        onSave={productToEdit ? handleUpdateProduct : handleCreateProduct}
        isSaving={isSaving}
      />
      <ProductDetailsDrawer
        isOpen={!!viewingProduct}
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
      />

      {/* SYSTEM TOAST */}
      {toast && <SystemToast toast={toast} onClick={() => setToast(null)} />}

      {/* DELETE PRODUCT CONFIRMATION MODAL */}
      {productToDelete && (
        <ProductDeleteConfirmationModal
          productToDelete={productToDelete.name}
          setProductToDelete={() => setProductToDelete(null)}
          confirmDelete={confirmDelete}
        />
      )}
    </div>
  );
}
