// client/src/__mocks__/authContext.js
import React from "react";

export const mockAuthContext = {
  user: { id: "1", name: "Test User" },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
};

export const MockAuthProvider = ({ children }) => {
  return <div>{children}</div>;
};

export const useAuth = () => mockAuthContext;
