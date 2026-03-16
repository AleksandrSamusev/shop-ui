import api from "../api/axios";

export const authService = {
  // 🛡️ INITIATE ACCESS: Sends credentials to /auth/login
  login: async (email, password) => {
    // Note: We only use the sub-path because 'api' already has the baseURL
    const response = await api.post("/auth/login", { email, password });

    // If the server grants clearance (ApiResponse structure)
    if (response.data.data && response.data.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }

    return response.data.data;
  },

  // 🛡️ FORGE CREDENTIALS: Sends new identity to /auth/register
  register: async (signupData) => {
    const response = await api.post("/auth/register", signupData);
    return response.data;
  },

  // 🛡️ TERMINATE SESSION: Clears the badge
  logout: () => {
    localStorage.removeItem("user");
  },

  // 🛡️ GET CURRENT PERSONNEL: Check local clearance
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
