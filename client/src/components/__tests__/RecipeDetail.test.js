// src/components/__tests__/RecipeDetail.test.js
import React from "react";
import { render, screen, waitFor } from "../../utils/testing/testUtils";
import { RecipeDetailPage } from "../../pages/RecipeDetailPage";
import { apiClient } from "../../services/api/apiClient";
import { mockRecipe } from "../../mocks/handlers";

// Mock the required modules
jest.mock("../../services/api/apiClient");
jest.mock("../../services/logging/logger");
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "1", name: "Test User" },
    isAuthenticated: true,
  }),
}));
