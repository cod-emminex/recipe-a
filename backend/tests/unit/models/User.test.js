// backend/tests/unit/models/User.test.js
const User = require("../../../models/User");
const mongoose = require("mongoose");

describe("User Model Test", () => {
  it("should validate a valid user", async () => {
    const validUser = new User({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    const savedUser = await validUser.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(validUser.email);
  });
});
