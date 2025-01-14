// client/src/__mocks__/services.js
export const apiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

export const logger = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

export const analytics = {
  track: jest.fn(),
};
