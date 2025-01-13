// tests/integration/user.test.js
const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/User");
const { setupTestDB, createTestUser } = require("../helpers/setup");

setupTestDB();

describe("User API", () => {
  let user;
  let token;

  beforeEach(async () => {
    const testData = await createTestUser();
    user = testData.user;
    token = testData.token;
  });

  describe("GET /api/users/me", () => {
    it("should get authenticated user profile", async () => {
      const res = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body).toMatchObject({
        username: user.username,
        email: user.email,
      });
      expect(res.body).not.toHaveProperty("password");
    });

    it("should return 401 if not authenticated", async () => {
      await request(app).get("/api/users/me").expect(401);
    });
  });

  describe("PUT /api/users/me", () => {
    it("should update user profile", async () => {
      const updates = {
        username: "updateduser",
        email: "updated@example.com",
      };

      const res = await request(app)
        .put("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send(updates)
        .expect(200);

      expect(res.body).toMatchObject(updates);
      expect(res.body).not.toHaveProperty("password");
    });

    it("should not update with existing username", async () => {
      await createTestUser({
        username: "existinguser",
        email: "existing@example.com",
      });

      await request(app)
        .put("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ username: "existinguser" })
        .expect(400);
    });

    it("should not update password through this endpoint", async () => {
      const oldUser = await User.findById(user._id);
      const oldPassword = oldUser.password;

      await request(app)
        .put("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send({ password: "newpassword123" })
        .expect(200);

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.password).toBe(oldPassword);
    });
  });
});
