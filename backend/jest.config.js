// jest.config.js
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["./tests/helpers/setup.js"],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testTimeout: 10000,
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/helpers/"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.js", "!src/server.js"],
  setupFiles: ["./tests/helpers/testEnv.js"],
};
