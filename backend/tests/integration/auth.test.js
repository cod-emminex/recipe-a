// backend/tests/integration/auth.test.js

const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const { createTestUser } = require("../helpers/testUtils");

describe("Auth Routes", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        username: "newuser",
        email: "newuser@example.com",
        password: "Password123!",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("username", userData.username);
      expect(response.body.user).not.toHaveProperty("password");

      // Verify user was created in database
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
    });

    it("should not register user with existing email", async () => {
      await createTestUser();

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          username: "another",
          email: "test@example.com",
          password: "Password123!",
        })
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await createTestUser();
    });

    it("should login with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "Password123!",
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toHaveProperty("email", "test@example.com");
    });

    it("should not login with incorrect password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("error");
    });
  });
});
