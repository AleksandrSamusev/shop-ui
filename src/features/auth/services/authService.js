import api from "../../../shared/api/axios"

export const authService = {

  /**
   * 🚀 LOGIN: Authenticates and stores the full identity packet.
   * We must ensure the 'id' is extracted from the backend response.
   */
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });

    // 🛡️ DATA INTEGRITY: Extract token and user details from the standard wrapper
    if (response.data.data && response.data.data.token) {
      const userData = response.data.data;
      
      // We save the entire object which includes: id, email, roles, and token
      sessionStorage.setItem("user", JSON.stringify(userData));
    }

    return response.data.data;
  },

  /**
   * 🚀 REGISTER: Standard account creation protocol.
   */
  register: async (signupData) => {
    const response = await api.post("/auth/register", signupData);
    return response.data;
  },

  /**
   * 🚀 LOGOUT: Clears the volatile session memory.
   */
  logout: () => {
    sessionStorage.removeItem("user");
  },

  /**
   * 🚀 GET CURRENT USER: Retrieves the stored identity from the session.
   */
  getCurrentUser: () => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
