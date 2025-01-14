// client/playwright.config.js
module.exports = {
  testDir: "./src/e2e",
  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
  },
};
