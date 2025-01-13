// tests/unit/models/User.test.js
const mongoose = require("mongoose");
const User = require("../../../src/models/User");
const { setupTestDB } = require("../../helpers/setup");

setupTestDB();

describe("User Model Test", () => {
  it("should validate a valid user", async () => {
    const validUser = {
      username: "testuser",
      email: "test@example.com",
      password: "Password123!",
    };
    const user = new User(validUser);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(validUser.username);
    expect(savedUser.email).toBe(validUser.email);
    expect(savedUser.password).not.toBe(validUser.password); // Should be hashed
  });

  it("should fail validation without required fields", async () => {
    const userWithoutRequired = new User({});
    let err;

    try {
      await userWithoutRequired.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.username).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  it("should not save user with invalid email", async () => {
    const userWithInvalidEmail = new User({
      username: "testuser",
      email: "invalid-email",
      password: "Password123!",
    });
    let err;

    try {
      await userWithInvalidEmail.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.email).toBeDefined();
  });
});
