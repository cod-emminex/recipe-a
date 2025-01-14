// src/components/__tests__/RecipeCard.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import RecipeCard from "../RecipeCard";
import { AuthContext } from "../../context/AuthContext";

// Mock auth context value
const mockAuthContext = {
  user: { id: "1", name: "Test User" },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
};

// Custom render function
const renderWithProviders = (
  ui,
  { authValue = mockAuthContext, ...options } = {}
) => {
  return render(
    <ChakraProvider>
      <AuthContext.Provider value={authValue}>
        <BrowserRouter>{ui}</BrowserRouter>
      </AuthContext.Provider>
    </ChakraProvider>,
    options
  );
};

describe("RecipeCard", () => {
  const mockRecipe = {
    id: "1",
    title: "Test Recipe",
    description: "Test Description",
    imageUrl: "test-image.jpg",
    cookingTime: 30,
    difficulty: "Medium",
    author: {
      name: "Test Author",
      avatarUrl: "test-avatar.jpg",
    },
    likes: 10,
    comments: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders recipe card with basic information", () => {
    renderWithProviders(<RecipeCard recipe={mockRecipe} />);

    expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
    expect(screen.getByText(mockRecipe.description)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockRecipe.cookingTime} mins`)
    ).toBeInTheDocument();
    expect(screen.getByText(mockRecipe.difficulty)).toBeInTheDocument();
  });

  it("displays author information", () => {
    renderWithProviders(<RecipeCard recipe={mockRecipe} />);

    expect(screen.getByText(mockRecipe.author.name)).toBeInTheDocument();
  });

  it("shows social metrics", () => {
    renderWithProviders(<RecipeCard recipe={mockRecipe} />);

    expect(screen.getByText(`${mockRecipe.likes} likes`)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockRecipe.comments} comments`)
    ).toBeInTheDocument();
  });

  // Test with different auth states
  it("handles unauthenticated state", () => {
    const unauthenticatedContext = {
      ...mockAuthContext,
      isAuthenticated: false,
      user: null,
    };

    renderWithProviders(<RecipeCard recipe={mockRecipe} />, {
      authValue: unauthenticatedContext,
    });

    // Add assertions for unauthenticated state
    expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
  });
});
