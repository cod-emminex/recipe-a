// backend/tests/helpers/testUtils.js
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    username: "testuser",
    email: "test@example.com",
    password: "Password123!",
    bio: "",
  };

  return await User.create({ ...defaultUser, ...userData });
};

const generateAuthToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "test-secret-key",
    { expiresIn: "1d" }
  );
};

const createAuthenticatedUser = async (userData = {}) => {
  const user = await createTestUser(userData);
  const token = generateAuthToken(user);
  return { user, token };
};

module.exports = {
  createTestUser,
  generateAuthToken,
  createAuthenticatedUser,
};
