// client/src/integration/__tests__/RecipeDetail.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { RecipeDetailPage } from "../../pages/RecipeDetailPage";
import { apiClient } from "../../services/api/apiClient";

// Mock all required dependencies
jest.mock("../../services/api/apiClient");
jest.mock("react-router-dom", () => ({
  useParams: () => ({ id: "123" }),
  useNavigate: () => jest.fn(),
}));
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "1", name: "Test User" },
    isAuthenticated: true,
  }),
}));

const mockRecipe = {
  id: "123",
  title: "Test Recipe",
  description: "Test Description",
  imageUrl: "test.jpg",
  cookingTime: 30,
  servings: 4,
  difficulty: "Medium",
  ingredients: [{ name: "Ingredient 1", amount: 1, unit: "cup" }],
  steps: ["Step 1"],
  author: {
    name: "Test Author",
    avatarUrl: "test-avatar.jpg",
    recipeCount: 5,
    followersCount: 100,
    username: "testauthor",
  },
  tags: ["tag1", "tag2"],
  nutrition: {
    calories: 200,
    protein: "10g",
  },
};

describe("RecipeDetailPage Integration", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default API responses
    apiClient.get.mockImplementation((url) => {
      if (url.includes("/recipes/123")) {
        return Promise.resolve({ data: mockRecipe });
      }
      if (url.includes("/reviews")) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes("/comments")) {
        return Promise.resolve({ data: [] });
      }
      if (url.includes("/ratings/distribution")) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });
  });

  it("renders recipe details when data is loaded", async () => {
    render(<RecipeDetailPage />);

    // Wait for the recipe title to appear
    await waitFor(() => {
      expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
    });

    // Check that main recipe information is displayed
    expect(screen.getByText(mockRecipe.description)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockRecipe.cookingTime} mins`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`${mockRecipe.servings} servings`)
    ).toBeInTheDocument();
    expect(screen.getByText(mockRecipe.difficulty)).toBeInTheDocument();
  });

  it("displays loading state initially", () => {
    render(<RecipeDetailPage />);
    expect(screen.getByTestId("recipe-detail-skeleton")).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    // Mock API error
    apiClient.get.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<RecipeDetailPage />);

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
