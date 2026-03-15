import api from "../api/axios";

export const productService = {
  // ... existing methods ...
  getAllProducts: async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data.data;
  },
  getInventoryStats: async () => {
    const response = await api.get("/products/stats");
    return response.data.data;
  },
  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`);
  },
  createProduct: async (productData) => {
    const response = await api.post("/products", productData);
    return response.data.data;
  },

  // 🚀 THE FIX: Adding the Update functionality
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data.data;
  },
};
