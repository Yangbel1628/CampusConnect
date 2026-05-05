import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach correct JWT token to every request
api.interceptors.request.use((config) => {
  // Admin routes use adminToken, everything else uses user token
  const isAdminRoute = config.url?.startsWith("/admin");
  const token = isAdminRoute
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAdminRoute = error.config?.url?.startsWith("/admin");
    if (error.response?.status === 401) {
      if (isAdminRoute) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        window.location.href = "/cc-admin";
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;