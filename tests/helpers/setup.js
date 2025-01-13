// tests/helpers/setup.js
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/User");
const Recipe = require("../../src/models/Recipe");
require("./testEnv");

const setupTestDB = () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(
        process.env.MONGODB_URI_TEST ||
          "mongodb://localhost:27017/recipe-a-test"
      );
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error("Error closing MongoDB connection:", error);
      throw error;
    }
  });

  beforeEach(async () => {
    try {
      await Promise.all([User.deleteMany({}), Recipe.deleteMany({})]);
    } catch (error) {
      console.error("Error cleaning up test database:", error);
      throw error;
    }
  });
};

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    username: "testuser",
    email: "test@example.com",
    password: "Password123!",
  };

  const user = await User.create({ ...defaultUser, ...userData });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return { user, token };
};

module.exports = {
  setupTestDB,
  createTestUser,
};
