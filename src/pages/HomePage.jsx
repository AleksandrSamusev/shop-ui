import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HomeHero from "../components/HomeHero";
import ProductFilterBar from "../components/ProductFilterBar";
import ProductCard from "../components/ProductCard";
import ProductsPagination from "../components/ProductsPagination";
import { productService } from "../services/productService";
import AuthModal from "../components/AuthModal";
import ProductDetailsDrawer from "../components/ProductDetailsDrawer";
import GridEmptyState from "../components/GridEmptyState";
import { useLocation } from "react-router-dom";
import SystemToast from "../components/SystemToast";

export default function HomePage({ currentUser, onLoginSuccess, onLogout }) {
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
  const location = useLocation();
  const [toast, setToast] = useState(null);

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
      <Navbar
        currentUser={currentUser}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogout={onLogout}
      />

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
      {toast && <SystemToast toast={toast} onClick={() => setToast(null)} />}
    </div>
  );
}
