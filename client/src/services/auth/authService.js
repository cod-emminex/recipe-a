// client/src/services/auth/authService.js
import { apiClient } from "../api/apiClient";
import { storage } from "../../utils/storage";
import { eventBus } from "../eventBus";

class AuthService {
  constructor() {
    this.token = storage.get("authToken");
    this.user = storage.get("user");
    this.refreshTokenTimeout = null;
  }

  async login(credentials) {
    const response = await apiClient.post("/auth/login", credentials);
    this.setSession(response);
    eventBus.emit("auth:login", this.user);
    return response;
  }

  async register(userData) {
    const response = await apiClient.post("/auth/register", userData);
    this.setSession(response);
    eventBus.emit("auth:register", this.user);
    return response;
  }

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearSession();
      eventBus.emit("auth:logout");
    }
  }

  async refreshToken() {
    try {
      const response = await apiClient.post("/auth/refresh");
      this.setSession(response);
      return response;
    } catch (error) {
      this.clearSession();
      throw error;
    }
  }

  setSession(authData) {
    const { token, refreshToken, user, expiresIn } = authData;

    this.token = token;
    this.user = user;

    storage.set("authToken", token);
    storage.set("refreshToken", refreshToken);
    storage.set("user", user);

    this.setupRefreshToken(expiresIn);
  }

  clearSession() {
    this.token = null;
    this.user = null;

    storage.remove("authToken");
    storage.remove("refreshToken");
    storage.remove("user");

    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  setupRefreshToken(expiresIn) {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    // Refresh 1 minute before expiration
    const timeout = (expiresIn - 60) * 1000;
    this.refreshTokenTimeout = setTimeout(() => {
      this.refreshToken();
    }, timeout);
  }

  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    return this.user;
  }

  async updateUser(userData) {
    const response = await apiClient.put("/users/me", userData);
    this.user = response;
    storage.set("user", response);
    eventBus.emit("auth:userUpdated", response);
    return response;
  }

  async changePassword(passwords) {
    return apiClient.post("/auth/change-password", passwords);
  }

  async requestPasswordReset(email) {
    return apiClient.post("/auth/forgot-password", { email });
  }

  async resetPassword(token, newPassword) {
    return apiClient.post("/auth/reset-password", {
      token,
      newPassword,
    });
  }
}

export const authService = new AuthService();
