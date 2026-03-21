import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import ProductsPage from "../features/product/pages/ProductsPage";
import HomePage from "../features/home/pages/HomePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Route>
    </Routes>
  );
}