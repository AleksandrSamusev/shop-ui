import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Default to Users */}
          <Route index element={<Navigate to="/users" replace />} />

          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;