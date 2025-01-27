// client/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check if token is expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          throw new Error("Token expired");
        }

        // Verify token with backend
        const response = await authAPI.verifyToken();
        const userData = {
          ...decoded,
          ...response.data,
          username: decoded.username,
        };
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        setUser(null);
        setIsAuthenticated(false);
        setError(error.message);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (identifier, password) => {
    try {
      setLoading(true);
      setError(null);

      // Call login API with identifier (email or username)
      const response = await authAPI.login({ identifier, password });
      const { token, user: userData } = response.data;

      // Store token
      localStorage.setItem("token", token);

      // Decode and set user
      const decoded = jwtDecode(token);
      const newUserData = {
        ...decoded,
        ...userData,
        username: userData.username || decoded.username,
      };
      setUser(newUserData);
      setIsAuthenticated(true);

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Invalid credentials. Please check your email/username and password.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // You can add a logout API call here if needed
      // await authAPI.logout();
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
      username: userData.username || prevUser.username,
    }));
  };

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    updateUser,
    checkAuth,
    isAuthenticated, // Added isAuthenticated to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
