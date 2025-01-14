// config/test.js
module.exports = {
  database: {
    url:
      process.env.TEST_DATABASE_URL ||
      "postgres://localhost:5432/recipe_app_test",
  },
  jwt: {
    secret: "test-secret-key",
  },
};
