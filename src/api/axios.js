import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type':'application/json',
    },
});

// 🚀 THE WATCHMAN: Automatically attaches the JWT to every outgoing request
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (user && user.token) {
            // Standard 'Bearer' protocol for Deep Space security
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;