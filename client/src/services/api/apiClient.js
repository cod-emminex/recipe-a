// client/src/services/api/apiClient.js
import axios from "axios";
import config from "../../config/config";
import { storage } from "../../utils/storage";
import { handleApiError } from "../../utils/errorHandling";

export class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: config.API_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = storage.get("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          storage.remove("authToken");
          window.location.href = "/login";
        }
        return Promise.reject(handleApiError(error));
      }
    );
  }

  async get(endpoint, params = {}) {
    return this.client.get(endpoint, { params });
  }

  async post(endpoint, data = {}) {
    return this.client.post(endpoint, data);
  }

  async put(endpoint, data = {}) {
    return this.client.put(endpoint, data);
  }

  async delete(endpoint) {
    return this.client.delete(endpoint);
  }

  async upload(endpoint, file, onProgress) {
    const formData = new FormData();
    formData.append("file", file);

    return this.client.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress?.(percentCompleted);
      },
    });
  }
}

export const apiClient = new ApiClient();

// Specific API services
export const recipeApi = {
  getAll: (params) => apiClient.get("/recipes", params),
  getById: (id) => apiClient.get(`/recipes/${id}`),
  create: (data) => apiClient.post("/recipes", data),
  update: (id, data) => apiClient.put(`/recipes/${id}`, data),
  delete: (id) => apiClient.delete(`/recipes/${id}`),
  upload: (file, onProgress) =>
    apiClient.upload("/recipes/images", file, onProgress),
};

export const userApi = {
  getCurrentUser: () => apiClient.get("/users/me"),
  updateProfile: (data) => apiClient.put("/users/profile", data),
  updatePreferences: (data) => apiClient.put("/users/preferences", data),
  getFollowers: (userId) => apiClient.get(`/users/${userId}/followers`),
  getFollowing: (userId) => apiClient.get(`/users/${userId}/following`),
};
