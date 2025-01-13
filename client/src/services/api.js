// client/src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
};

export const recipeAPI = {
  getAll: () => api.get("/recipes"),
  getById: (id) => api.get(`/recipes/${id}`),
  create: (recipeData) => api.post("/recipes", recipeData),
  update: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
  delete: (id) => api.delete(`/recipes/${id}`),
};

export const userAPI = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (userData) => api.put("/users/me", userData),
};

export default api;
