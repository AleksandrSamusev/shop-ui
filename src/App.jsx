import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { BasketProvider } from "./context/BasketContext";
import { authService } from "./services/authService";

import MainLayout from "./layouts/MainLayout";
import UsersPage from "./pages/UsersPage";
import ProductsPage from "./pages/ProductsPage";
import HomePage from "./pages/HomePage";
import CheckoutPage from "./pages/CheckoutPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // ✅ 1. REACTIVE AUTH STATE (single source of truth)
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  // ✅ 2. HANDLERS
  const handleLoginSuccess = () => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    // ✅ 3. PASS USER INTO BASKET PROVIDER (critical fix)
    <BasketProvider user={currentUser}>
      <BrowserRouter>
        <Routes>
          {/* 1. PUBLIC */}
          <Route
            path="/"
            element={
              <HomePage
                currentUser={currentUser}
                onLoginSuccess={handleLoginSuccess}
                onLogout={handleLogout}
              />
            }
          />

          {/* 2. USER / CHECKOUT */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />}>
            <Route path="/checkout" element={<CheckoutPage />} />
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
        </Routes>
      </BrowserRouter>
    </BasketProvider>
  );
}

export default App;
