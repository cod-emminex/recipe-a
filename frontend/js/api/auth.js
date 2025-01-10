// frontend/js/api/auth.js

import { apiRequest } from "./config.js";
import { showNotification } from "../utils/helpers.js";

export const AuthAPI = {
  async login(credentials) {
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      showNotification("Login failed: " + error.message, "error");
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      showNotification("Registration failed: " + error.message, "error");
      throw error;
    }
  },

  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  },

  async verifyEmail(token) {
    return await apiRequest(`/auth/verify-email/${token}`);
  },

  async forgotPassword(email) {
    return await apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token, password) {
    return await apiRequest(`/auth/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },
};
