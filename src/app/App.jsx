import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { BasketProvider } from "../features/basket/context/BasketContext";
import { authService } from "../features/auth/services/authService";

import MainLayout from "../layouts/MainLayout";
import AccountLayout from "../layouts/AccountLayout";

import UsersPage from "../features/user/pages/UsersPage";
import ProductsPage from "../features/product/pages/ProductsPage";
import HomePage from "../features/home/pages/HomePage";
import CheckoutPage from "../features/checkout/pages/CheckoutPage";
import OrdersPage from "../features/order/pages/OrdersPage";
import AddressesPage from "../features/address/pages/AddressesPage";

import ProtectedRoute from "../app/ProtectedRoute";
import AppShell from "../layouts/AppShell";
import AuthModal from "../features/auth/components/AuthModal";

function App() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLoginSuccess = () => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <BasketProvider user={currentUser}>
      <BrowserRouter>
        {/* 🌐 GLOBAL TOAST SYSTEM */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0f172a", // slate-900
              color: "#ffffff",
              border: "1px solid #1e293b",
              borderRadius: "16px",
              fontSize: "11px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "12px 16px",
            },
          }}
        />

        <Routes>
          {/* 🌍 GLOBAL LAYOUT */}
          <Route
            element={
              <AppShell
                currentUser={currentUser}
                onLoginClick={() => setIsAuthOpen(true)}
                onLogout={handleLogout}
              />
            }
          >
            {/* 1. PUBLIC */}
            <Route path="/" element={<HomePage />} />

            {/* 2. USER */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["ROLE_USER", "ROLE_ADMIN"]}
                />
              }
            >
              <Route path="/checkout" element={<CheckoutPage />} />

              <Route path="/account" element={<AccountLayout />}>
                <Route path="orders" element={<OrdersPage />} />
                <Route path="addresses" element={<AddressesPage />} />
              </Route>
            </Route>

            {/* 3. ADMIN */}
            <Route
              element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}
            >
              <Route path="/admin" element={<MainLayout />}>
                <Route
                  index
                  element={<Navigate to="/admin/products" replace />}
                />
                <Route path="users" element={<UsersPage />} />
                <Route path="products" element={<ProductsPage />} />
              </Route>
            </Route>

            {/* 4. FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>

        {/* 🔐 AUTH MODAL */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </BrowserRouter>
    </BasketProvider>
  );
}

export default App;