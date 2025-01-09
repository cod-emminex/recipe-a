// src/utils/testUtils.js
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const testUtils = {
  generateTestToken: async (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_TEST_SECRET);
  },

  createTestUser: async () => {
    return await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "testPassword123",
    });
  },

  clearTestData: async () => {
    // Add all models that need to be cleared
    const collections = ["users", "recipes", "collections", "comments"];
    for (const collection of collections) {
      await mongoose.connection.collection(collection).deleteMany({});
    }
  },
};
