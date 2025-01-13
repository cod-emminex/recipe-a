// client/src/utils/testing/testUtils.js
import { render } from "@testing-library/react";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { AuthProvider } from "../../contexts/AuthContext";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

export const createMockStore = (initialState = {}) => {
  let state = { ...initialState };
  const listeners = new Set();

  return {
    getState: () => state,
    setState: (newState) => {
      state = { ...state, ...newState };
      listeners.forEach((listener) => listener(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const renderWithProviders = (
  ui,
  {
    initialState = {},
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Router history={history}>
      <AuthProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </AuthProvider>
    </Router>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    history,
  };
};

export const mockApiResponse = (data, options = {}) => {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    ...options,
  });
};

export const mockApiError = (status = 400, message = "Error") => {
  const error = new Error(message);
  error.response = {
    status,
    data: { message },
  };
  return Promise.reject(error);
};

export const createMockEvent = (type = "click", overrides = {}) => {
  return {
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    type,
    ...overrides,
  };
};

// Mock data generators
export const generateMockUser = (overrides = {}) => ({
  id: "user-1",
  username: "testuser",
  email: "test@example.com",
  createdAt: "2025-01-13T08:35:14Z",
  ...overrides,
});

export const generateMockRecipe = (overrides = {}) => ({
  id: "recipe-1",
  title: "Test Recipe",
  description: "A test recipe description",
  ingredients: ["Ingredient 1", "Ingredient 2"],
  steps: ["Step 1", "Step 2"],
  createdAt: "2025-01-13T08:35:14Z",
  author: generateMockUser(),
  ...overrides,
});

export const waitForAsync = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export const mockConsole = () => {
  const originalConsole = { ...console };
  beforeAll(() => {
    global.console = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    };
  });
  afterAll(() => {
    global.console = originalConsole;
  });
};

export class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocket.CONNECTING;
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen?.();
    }, 0);
  }

  send(data) {
    if (this.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not open");
    }
    // Handle the sent data as needed in tests
  }

  close() {
    this.readyState = WebSocket.CLOSED;
    this.onclose?.();
  }
}

// Mock LocalStorage
export class MockStorage {
  constructor() {
    this.store = new Map();
  }

  getItem(key) {
    return this.store.get(key) || null;
  }

  setItem(key, value) {
    this.store.set(key, String(value));
  }

  removeItem(key) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

// Setup mock timers for testing
export const useMockTimers = () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
};
