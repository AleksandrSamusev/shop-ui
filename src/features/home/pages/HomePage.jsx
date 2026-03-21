import React, { useState, useEffect } from "react";
import HomeHero from "../../home/components/HomeHero";
import ProductFilterBar from "../../product/components/ProductFilterBar";
import ProductsPagination from "../../product/components/ProductsPagination";
import AuthModal from "../../auth/components/AuthModal";
import ProductDetailsDrawer from "../../product/components/ProductDetailsDrawer";
import { useLocation } from "react-router-dom";
import SystemToast from "../../../shared/components/ui/SystemToast";
import ProductGrid from "../../product/components/ProductGrid";
import { useProductFilters } from "../../product/hooks/useProductFilters";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useProductsQuery } from "../../product/hooks/useProductsQuery";

export default function HomePage({ currentUser, onLoginSuccess, onLogout }) {
  const [pageSize, setPageSize] = useState(12);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const location = useLocation();

  const {
    filters,
    searchQuery,
    currentPage,
    setCurrentPage,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
  } = useProductFilters();

  const debouncedSearch = useDebounce(searchQuery, 700);

  // ✅ NEW: unified data fetching
  const { productsPage, isInitialLoading, isFetching } = useProductsQuery({
    filters,
    search: debouncedSearch,
    page: currentPage,
    size: pageSize,
  });

  // ✅ Keep toast from session storage
  useEffect(() => {
    const storedToast = sessionStorage.getItem("orderSuccess");

    if (storedToast) {
      const parsed = JSON.parse(storedToast);
      setToast(parsed);
      sessionStorage.removeItem("orderSuccess");
    }
  }, []);

  // ✅ Keep toast from navigation
  useEffect(() => {
    if (location.state?.orderSuccess) {
      setToast({
        message: "Order placed successfully",
        reference: location.state.reference,
      });

      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ✅ Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
    onLoginSuccess();
  };

  // ✅ Loading state (same UX as ProductsPage)
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
    <div className="min-h-screen bg-slate-950">
      <HomeHero />

      <main className="max-w-[1400px] mx-auto px-12 py-16 space-y-12">
        {/* FILTER BAR */}
        <div className="relative z-[100]">
          <ProductFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />
        </div>

        {/* PRODUCTS */}
        <div className="min-h-[400px]">
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
              onViewSpecs={setSelectedProduct}
              onEmptyAction={resetFilters}
            />
          </div>

          {productsPage.content?.length > 0 && (
            <div className="mt-12">
              <ProductsPagination
                {...productsPage}
                currentPage={currentPage}
                pageSize={pageSize}
                handleSelection={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                handleClick={(i) => setCurrentPage(i)}
                handleDecreaseClick={() =>
                  setCurrentPage((p) => p - 1)
                }
                handleIncreaseClick={() =>
                  setCurrentPage((p) => p + 1)
                }
              />
            </div>
          )}
        </div>
      </main>

      {/* AUTH */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* PRODUCT DETAILS */}
      <ProductDetailsDrawer
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* TOAST */}
      {toast && (
        <SystemToast toast={toast} onClick={() => setToast(null)} />
      )}
    </div>
  );
}