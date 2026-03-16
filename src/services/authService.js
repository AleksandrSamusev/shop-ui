import api from "../api/axios";

export const authService = {

  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });


    if (response.data.data && response.data.data.token) {
     sessionStorage.setItem("user", JSON.stringify(response.data.data));
    }

    return response.data.data;
  },

 
  register: async (signupData) => {
    const response = await api.post("/auth/register", signupData);
    return response.data;
  },


  logout: () => {
    sessionStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
