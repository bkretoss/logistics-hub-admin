import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8001/api",
  // baseURL: "https://logistic.kretosstechnology.com/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const loginApi = (email: string, password: string) => api.post("/admin/login", { email, password });

export const createLeadApi = (data: Record<string, unknown>) => api.post("/leads", data);

export default api;
