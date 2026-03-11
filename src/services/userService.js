import api from "../api/axios";

export const userService = {
  //Get all users
  getAllUsers: async (params = {}) => {
    // axios automatically converts { search: 'alex', page: 0 } into ?search=alex&page=0
    const response = await api.get("/users", { params });

    // This now returns the Page object { content: [], totalPages: 2, etc. }
    return response.data.data;
  },

  // Get user by id
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  // Delete an address
  deleteAddress: async (userId, addressId) => {
    const response = await api.delete(`/users/${userId}/addresses/${addressId}`);
    return response.data.data;
  },

  // Post address
  addAddress: async (userId, addressData) => {
    const response = await api.post(`/users/${userId}/addresses`, addressData);
    return response.data.data;
  },

  promoteAddress: async (userId, addressId) => {
    const response = await api.patch(`/users/${userId}/addresses/${addressId}/promote`);
    return response.data.data; // Returns the updated User object
  },
};
