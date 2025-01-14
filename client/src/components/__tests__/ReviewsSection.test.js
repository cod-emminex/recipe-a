// client/src/components/__tests__/ReviewsSection.test.js
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ReviewsSection } from "../review/ReviewsSection";

describe("ReviewsSection", () => {
  it("loads and displays reviews", async () => {
    render(<ReviewsSection recipeId="1" />);

    await waitFor(() => {
      expect(screen.getByText("Great recipe!")).toBeInTheDocument();
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });
  });
});
