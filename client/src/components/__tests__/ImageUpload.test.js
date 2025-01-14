// src/components/__tests__/ImageUpload.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import ImageUpload from "../common/ImageUpload";

// Create a custom render function with ChakraProvider
const renderWithChakra = (ui) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe("ImageUpload", () => {
  it("renders upload button", () => {
    renderWithChakra(<ImageUpload onImageUpload={() => {}} />);
    expect(
      screen.getByText(/Drag and drop an image, or click to select/i)
    ).toBeInTheDocument();
  });

  it("handles file upload", async () => {
    const mockOnImageUpload = jest.fn();
    renderWithChakra(<ImageUpload onImageUpload={mockOnImageUpload} />);

    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByTestId("file-input");

    Object.defineProperty(input, "files", {
      value: [file],
    });

    fireEvent.drop(input, {
      dataTransfer: {
        files: [file],
      },
    });

    expect(mockOnImageUpload).toHaveBeenCalledWith(file);
  });

  it("displays preview when initialImage is provided", () => {
    const initialImage = "test-image-url.jpg";
    renderWithChakra(
      <ImageUpload onImageUpload={() => {}} initialImage={initialImage} />
    );

    const imageElement = screen.getByAlt("Uploaded preview");
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute("src", initialImage);
  });
});
