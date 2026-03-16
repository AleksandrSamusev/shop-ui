// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import UsersPage from "./pages/UsersPage";
import ProductsPage from "./pages/ProductsPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute"; // 🚀 THE SECURITY GATE

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. THE PUBLIC SHOWROOM (No Sidebar/Admin Layout) */}
        <Route path="/" element={<HomePage />} />

        {/* 2. THE SECURED ADMIN SECTOR (Only for ROLE_ADMIN) */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          <Route path="/admin" element={<MainLayout />}>
            {/* Default admin view */}
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="products" element={<ProductsPage />} />
          </Route>
        </Route>

        {/* 3. FALLBACK: Signal unrecognized? Back to Showroom */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// 🚀 THE MANDATORY EXPORT: Resolves the 'main.jsx' SyntaxError
export default App;
