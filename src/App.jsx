import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BasketProvider } from "./context/BasketContext";
import { authService } from "./services/authService";

import MainLayout from "./layouts/MainLayout";
import AccountLayout from "./layouts/AccountLayout";

import UsersPage from "./pages/UsersPage";
import ProductsPage from "./pages/ProductsPage";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import AddressesPage from "./pages/AddressesPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./layouts/AppShell";
import AuthModal from "./components/AuthModal";

function App() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLoginSuccess = () => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsAuthOpen(false); // 👈 close modal
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <BasketProvider user={currentUser}>
      <BrowserRouter>
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
            <Route element={<ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />}>
              <Route path="/checkout" element={<CheckoutPage />} />

              <Route path="/account" element={<AccountLayout />}>
                <Route path="orders" element={<OrdersPage />} />
                <Route path="addresses" element={<AddressesPage />} />
              </Route>
            </Route>

            {/* 3. ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
              <Route path="/admin" element={<MainLayout />}>
                <Route index element={<Navigate to="/admin/products" replace />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="products" element={<ProductsPage />} />
              </Route>
            </Route>

            {/* 4. FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
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