// client/src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create a single axios instance
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      // Optionally redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  verifyToken: () => api.get("/auth/verify"),
  logout: () => api.post("/auth/logout"),
};

export const recipeAPI = {
  create: (data) => api.post("/recipes", data),
  getAll: () => api.get("/recipes"),
  getById: (number) => {
    const recipeNumber = parseInt(number);
    if (isNaN(recipeNumber)) {
      throw new Error("Invalid recipe number");
    }
    return api.get(`/recipes/number/${recipeNumber}`);
  },
  update: (number, data) => {
    const recipeNumber = parseInt(number);
    if (isNaN(recipeNumber)) {
      throw new Error("Invalid recipe number");
    }

    const cleanedData = {
      title: data.title,
      description: data.description,
      ingredients: data.ingredients,
      steps: data.steps,
      category: data.category || "",
      image: data.image || "",
      cookingTime: data.cookingTime || "",
      country: data.country || "",
      servings: data.servings || "",
      difficulty: data.difficulty || "medium",
      author: data.author, // Preserve the author field
    };
    return api.put(`/recipes/number/${recipeNumber}`, cleanedData);
  },
  delete: (number) => {
    const recipeNumber = parseInt(number);
    if (isNaN(recipeNumber)) {
      throw new Error("Invalid recipe number");
    }
    return api.delete(`/recipes/number/${recipeNumber}`);
  },
  getUserRecipes: () => api.get("/recipes/my-recipes"),
};
export const userAPI = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (userData) => api.put("/users/me", userData),
  getPublicProfile: (username) => api.get(`/users/${username}`),
  follow: (username) => api.post(`/users/${username}/follow`),
  unfollow: (username) => api.delete(`/users/${username}/follow`),
};

export default api;
