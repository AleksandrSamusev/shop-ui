import React, { useState, useEffect } from "react";
import { productService } from "../../product/services/productService";

import AddProductModal from "../components/modals/ProductAddModal";
import ProductDetailsDrawer from "../components/ProductDetailsDrawer";
import InventoryMetrics from "../../home/components/InventoryMetrics";
import ProductsPagination from "../components/ProductsPagination";
import ProductSearchBar from "../components/ProductSearchBar";
import SystemToast from "../../../shared/components/ui/SystemToast";
import ProductDeleteConfirmationModal from "../components/modals/ProductDeleteConfirmationModal";
import ProductFilterBar from "../components/ProductFilterBar";
import ProductGrid from "../components/ProductGrid";
import PageContainer from "../../../shared/components/layout/PageContainer";

import { useProductFilters } from "../hooks/useProductFilters";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useProductsQuery } from "../hooks/useProductsQuery";
import { useProductStats } from "../hooks/useProductStats";
import { useProductMutations } from "../hooks/useProductMutations";

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

  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pageSize, setPageSize] = useState(12);
  const [productToEdit, setProductToEdit] = useState(null);
  const [toast, setToast] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 700);

  const {
    productsPage,
    isInitialLoading,
    isFetching,
    refetch,
  } = useProductsQuery({
    filters,
    search: debouncedSearch,
    page: currentPage,
    size: pageSize,
  });

  const {
    stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useProductStats();

  const showSuccess = (message) => {
    setToast({
      message,
      type: "success",
    });

    setTimeout(() => setToast(null), 4000);
  };

  // ✅ NEW: mutations hook
  const { createProduct, updateProduct, deleteProduct } =
    useProductMutations({
      refetchProducts: refetch,
      refetchStats,
      showSuccess,
    });

  useEffect(() => {
    const closeAll = () => setOpenMenuId(null);
    window.addEventListener("click", closeAll);
    return () => window.removeEventListener("click", closeAll);
  }, []);

  const handleSearchInput = (e) => {
    handleSearchChange(e.target.value);
  };

  // ✅ SIMPLIFIED
  const handleCreateProduct = async (formData) => {
    setIsSaving(true);
    try {
      await createProduct(formData);
      setCurrentPage(0);
      setIsAdding(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (productId) => {
    const target = productsPage.content.find((p) => p.id === productId);
    if (target) {
      setProductToDelete(target);
    }
  };

  // ✅ SIMPLIFIED
  const confirmDelete = async () => {
    if (!productToDelete) return;

    await deleteProduct(productToDelete);
    setProductToDelete(null);
  };

  const handleAddClick = () => {
    setProductToEdit(null);
    setIsAdding(true);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsAdding(true);
  };

  // ✅ SIMPLIFIED
  const handleUpdateProduct = async (formData) => {
    setIsSaving(true);
    try {
      await updateProduct(formData);
      setIsAdding(false);
      setProductToEdit(null);
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
    <div className="flex flex-col h-full bg-slate-950">
      <header className="shrink-0">
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex items-center justify-between gap-4">
          <ProductSearchBar
            value={searchQuery}
            onChange={handleSearchInput}
            onClick={() => handleSearchChange("")}
          />

          <button
            onClick={handleAddClick}
            className="h-[48px] px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-wide shadow-lg active:scale-95 transition-all shadow-blue-900/40"
          >
            + Add Product
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-slate-950">
        <PageContainer>
          <InventoryMetrics stats={stats} loading={statsLoading} />

          <div className="relative z-50">
            <ProductFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={resetFilters}
            />
          </div>

          <div
            className={`relative ${isFetching ? "opacity-60" : ""
              } transition-opacity`}
          >
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
              onViewSpecs={setSelectedProduct}
              onEmptyAction={handleAddClick}
            />
          </div>

          <ProductsPagination
            pageSize={pageSize}
            totalPages={productsPage.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
            totalElements={productsPage.totalElements}
            handleSelection={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            handleClick={(pageIndex) => setCurrentPage(pageIndex)}
            handleDecreaseClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
            handleIncreaseClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          />
        </PageContainer>
      </main>

      {toast && (
        <SystemToast toast={toast} onClick={() => setToast(null)} />
      )}

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
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

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