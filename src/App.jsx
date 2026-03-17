// src/App.jsx
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
  // 🛡️ IDENTITY RESOLUTION: Resolve the current user for the session
  const currentUser = authService.getCurrentUser(); 
  
  // 🚀 THE KEY TRIGGER: When this changes (guest -> user_2), 
  // the BasketProvider REBOOTS and reads the correct storage locker.
  const basketIdentity = currentUser ? `basket_${currentUser.id}` : "basket_guest";

  return (
    <BasketProvider key={currentUser?.id ? `user_${currentUser.id}` : "guest"}>
      <BrowserRouter>
        <Routes>
          {/* 1. THE PUBLIC SHOWROOM */}
          <Route path="/" element={<HomePage />} />

          {/* 2. THE SECURED CHECKOUT TERMINAL */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />}>
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>

          {/* 3. THE ADMIN FORGE SECTOR */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<Navigate to="/admin/products" replace />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="products" element={<ProductsPage />} />
            </Route>
          </Route>

          {/* 4. FALLBACK REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </BasketProvider>
  );
}

export default App;
