// client/src/components/__tests__/RecipeForm.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecipeForm from "../recipe/RecipeForm";
import { ChakraProvider } from "@chakra-ui/react";

const AllTheProviders = ({ children }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

const renderWithProviders = (ui) => {
  return render(ui, { wrapper: AllTheProviders });
};

describe("RecipeForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders form fields correctly", () => {
    renderWithProviders(<RecipeForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    renderWithProviders(<RecipeForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test Recipe" },
    });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test Description" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Recipe",
          description: "Test Description",
        })
      );
    });
  });
});
