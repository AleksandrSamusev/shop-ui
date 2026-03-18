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

function App() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  const handleLoginSuccess = () => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
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

          {/* 3. ACCOUNT (✅ USING ProtectedRoute NOW) */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />}>
            <Route path="/account" element={<AccountLayout />}>
              <Route path="orders" element={<OrdersPage />} />
              <Route path="addresses" element={<AddressesPage />} />
            </Route>
          </Route>

          {/* 4. ADMIN */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<Navigate to="/admin/products" replace />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="products" element={<ProductsPage />} />
            </Route>
          </Route>

          {/* 5. FALLBACK (always last) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BasketProvider>
  );
}

export default App;