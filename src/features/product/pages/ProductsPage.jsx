import React, { useState, useEffect, useCallback, useRef, lazy } from "react";
import { productService } from "../../product/services/productService"
import AddProductModal from "../../../components/AddProductModal";
import ProductDetailsDrawer from "../components/ProductDetailsDrawer";
import InventoryMetrics from "../../home/components/InventoryMetrics";
import ProductsPagination from "../components/ProductsPagination";
import ProductSearchBar from "../components/ProductSearchBar";
import SystemToast from "../../../shared/components/ui/SystemToast";
import ProductDeleteConfirmationModal from "../components/ProductDeleteConfirmationModal";
import ProductFilterBar from "../components/ProductFilterBar";
import ProductGrid from "../components/ProductGrid";
import PageContainer from "../../../shared/components/layout/PageContainer";
import { useProductFilters } from "../hooks/useProductFilters";
import { useDebounce } from "../../../shared/hooks/useDebounce";

export default function ProductsPage() {

  const {
    filters,
    searchQuery,
    currentPage,
    setCurrentPage,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
  } = useProductFilters();

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

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
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
  const debouncedSearch = useDebounce(searchQuery, 700);

  useEffect(() => {
    const closeAll = () => setOpenMenuId(null);
    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  useEffect(() => {
    productRef.current = productToDelete;
  }, [productToDelete]);

  const loadStats = async () => {
    try {
      const data = await productService.getInventoryStats();
      setStats(data);
    } catch (err) {
      console.error("[ProductsPage] Failed to fetch stats:", err.message);
    }
  };

  const handleSearchInput = (e) => {
    handleSearchChange(e.target.value);
  };

  const fetchProducts = async () => {
    if (isInitialLoading) {
      setIsInitialLoading(true);
    } else {
      setIsFetching(true);
    }

    try {
      const data = await productService.getAllProducts({
        search: debouncedSearch,
        page: currentPage,
        size: pageSize,
        ...filters,
      });

      setProductsPage(data);
    } catch (err) {
      console.error("Fetch failed:", err.message);
    } finally {
      setIsInitialLoading(false);
      setIsFetching(false);
    }
  };

  const refreshDashboard = useCallback(async () => {
    try {
      await Promise.all([fetchProducts(), loadStats()]);
    } catch (err) {
      console.error("[ProductsPage] Refresh failed:", err.message);
    }
  }, [debouncedSearch, currentPage, pageSize, filters]);

  useEffect(() => {
    refreshDashboard();
  }, [debouncedSearch, currentPage, pageSize, filters]);

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
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (productId) => {
    const target = productsPage.content.find((p) => p.id === productId);
    if (target) {
      setProductToDelete({ id: target.id, name: target.name });
      console.log("DECOMMISSION TARGET IDENTIFIED:", target.name);
    }
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

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsAdding(true);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsAdding(true);
  };

  const handleUpdateProduct = async (formData) => {
    setIsSaving(true);
    try {
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

  if (isInitialLoading) {
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
      <header className="shrink-0">
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between gap-4">
          <ProductSearchBar
            value={searchQuery}
            onChange={handleSearchInput}
            onClick={() => handleSearchChange("")}
          />
          <button
            onClick={handleAddClick}
            className="h-[48px] px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-wide shadow-lg active:scale-95 transition-all shadow-blue-900/40 flex items-center justify-center"
          >
            + Add Product
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-950">
        <PageContainer>
          <InventoryMetrics stats={stats} />

          <div className="relative z-50">
            <ProductFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
          </div>

          <div className={`relative ${isFetching ? "opacity-60" : ""} transition-opacity`}>
            {isFetching && (
              <div className="absolute top-2 right-4 text-[10px] text-slate-500 animate-pulse">
                Updating...
              </div>
            )}

            <ProductGrid
              products={productsPage.content}
              isAdmin={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              onViewSpecs={setViewingProduct}
              onEmptyAction={handleAddClick}
            />
          </div>

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
        </PageContainer>
      </main>

      {/* OVERLAYS */}
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
        product={viewingProduct}
        isOpen={!!viewingProduct}
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
