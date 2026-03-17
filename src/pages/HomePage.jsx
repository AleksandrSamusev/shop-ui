import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HomeHero from "../components/HomeHero";
import ProductFilterBar from "../components/ProductFilterBar";
import ProductCard from "../components/ProductCard";
import ProductsPagination from "../components/ProductsPagination";
import { productService } from "../services/productService";
import { authService } from "../services/authService"; // 🚀 IMPORTED
import AuthModal from "../components/AuthModal";
import ProductDetailsDrawer from "../components/ProductDetailsDrawer";
import GridEmptyState from "../components/GridEmptyState";

export default function HomePage() {
  const [productsPage, setProductsPage] = useState({ content: [], totalPages: 0 });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "id,desc",
  });

  const [loading, setLoading] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🚀 THE FIX: Initialize user state from localStorage
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  // 🚀 THE SYNC: Function to update identity after login
  const handleLoginSuccess = () => {
    setIsAuthOpen(false);
    setCurrentUser(authService.getCurrentUser()); // Refresh state instantly
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
      console.error("Showroom fetch failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery.endsWith(" ")) fetchProducts();
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery, currentPage, pageSize, filters]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* 1. NAVIGATION: Identity-aware Navbar */}
      <Navbar currentUser={currentUser} onLoginClick={() => setIsAuthOpen(true)} />

      <HomeHero />

      <main className="max-w-[1400px] mx-auto px-12 py-16 space-y-12">
        {/* 2. SYSTEM SEARCH: Filter bar with Z-index fix */}
        <div className="relative z-[100]">
          <ProductFilterBar
            filters={filters}
            onFilterChange={(key, val) => {
              setFilters((prev) => ({ ...prev, [key]: val }));
              setCurrentPage(0);
            }}
            onReset={() => {
              setFilters({ category: "", minPrice: "", maxPrice: "", sortBy: "id,desc" });
              setSearchQuery("");
              setCurrentPage(0);
            }}
          />
        </div>

        {/* 🚀 3. THE FLEET GRID & EMPTY STATE SECTOR */}
        <div className="min-h-[400px]">
          {loading ? (
            /* 📡 LOADING: Scanning Deep Space Database... */
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                Accessing Telemetry...
              </p>
            </div>
          ) : productsPage.content && productsPage.content.length > 0 ? (
            <>
              {/* ACTIVE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsPage.content.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isAdmin={false}
                    onViewSpecs={() => setSelectedProduct(product)}
                  />
                ))}
              </div>

              {/* 🚀 4. DATA TELEMETRY: Only show if products exist */}
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
            </>
          ) : (
            /* 🚀 🛡️ THE SYMMETRICAL EMPTY STATE: Reusing our Universal Component */
            <GridEmptyState
              isAdmin={false}
              onAction={() => {
                setFilters({ category: "", minPrice: "", maxPrice: "", sortBy: "id,desc" });
                setSearchQuery("");
                setCurrentPage(0);
              }}
            />
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
    </div>
  );
}
