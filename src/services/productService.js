import api from "../api/axios";

export const productService = {
    // Standard 'Veloce' pattern: search, page, size, and sortBy
    getAllProducts: async (params = {}) => {
        const response = await api.get('/products', { params });
        return response.data.data; // Returns the Page object { content: [], totalPages: 5... }
    },
    // ... other CRUD methods
};