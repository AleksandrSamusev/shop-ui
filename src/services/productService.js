import api from "../api/axios";

export const productService = {
  // Standard 'Veloce' pattern: search, page, size, and sortBy
  getAllProducts: async (params = {}) => {
    const response = await api.get("/products", { params });
    return response.data.data; // Returns the Page object { content: [], totalPages: 5... }
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
};
