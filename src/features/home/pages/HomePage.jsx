import React, { useState, useEffect } from "react";
import Navbar from "../../../shared/components/layout/Navbar";
import HomeHero from "../../home/components/HomeHero";
import ProductFilterBar from "../../product/components/ProductFilterBar";
import ProductsPagination from "../../product/components/ProductsPagination";
import { productService } from "../../product/services/productService";
import AuthModal from "../../auth/components/AuthModal";
import ProductDetailsDrawer from "../../product/components/ProductDetailsDrawer";
import { useLocation } from "react-router-dom";
import SystemToast from "../../../shared/components/ui/SystemToast";
import ProductGrid from "../../product/components/ProductGrid";
import { useProductFilters } from "../../product/hooks/useProductFilters";
import { useDebounce } from "../../../shared/hooks/useDebounce";

export default function HomePage({ currentUser, onLoginSuccess, onLogout }) {
  const [productsPage, setProductsPage] = useState({ content: [], totalPages: 0 });
  const [pageSize, setPageSize] = useState(12);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const location = useLocation();
  const [toast, setToast] = useState(null);
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

  useEffect(() => {
    const storedToast = sessionStorage.getItem("orderSuccess");

    if (storedToast) {
      const parsed = JSON.parse(storedToast);

      setToast(parsed);

      // remove after reading
      sessionStorage.removeItem("orderSuccess");
    }
  }, []);

  useEffect(() => {
    console.log("NAV STATE:", location.state);
    if (location.state?.orderSuccess) {
      setToast({
        message: "Order placed successfully",
        reference: location.state.reference,
      });

      // clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
    onLoginSuccess(); // delegate to App
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
      console.error("Error fetching products:", err.message);
    } finally {
      setIsInitialLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, currentPage, pageSize, filters]);

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

        {/* 2. SYSTEM SEARCH: Filter bar with Z-index fix */}
        <div className="relative z-[100]">
          <ProductFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />
        </div>

        {/* PRODUCTS GRID */}
        <div className="min-h-[400px]">
          <div className={`relative ${isFetching ? "opacity-60" : ""} transition-opacity`}>
            {isFetching && (
              <div className="absolute top-2 right-4 text-[10px] text-slate-500 animate-pulse">
                Updating...
              </div>
            )}

            <ProductGrid
              products={productsPage.content}
              onViewSpecs={setViewingProduct}
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
                handleDecreaseClick={() => setCurrentPage((p) => p - 1)}
                handleIncreaseClick={() => setCurrentPage((p) => p + 1)}
              />
            </div>
          )}
        </div>
      </main>

      {/* 5. SECURITY TERMINAL: Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 6. TECHNICAL TERMINAL: Product Details Drawer */}
      <ProductDetailsDrawer
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      {toast && <SystemToast toast={toast} onClick={() => setToast(null)} />}
    </div>
  );
}
