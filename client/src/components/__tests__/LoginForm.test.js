// client/src/components/__tests__/LoginForm.test.js
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../LoginForm";
import { authAPI } from "../../services/api";

jest.mock("../../services/api");

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    const mockCredentials = {
      email: "test@example.com",
      password: "password123",
    };

    authAPI.login.mockResolvedValueOnce({
      data: {
        token: "mock-token",
        user: { id: 1, email: mockCredentials.email },
      },
    });

    render(<LoginForm onLogin={() => {}} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: mockCredentials.email },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: mockCredentials.password },
    });

    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith(mockCredentials);
    });
  });
});
