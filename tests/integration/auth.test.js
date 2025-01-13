// tests/integration/auth.test.js
const request = require("supertest");
const app = require("../../src/app");
const User = require("../../src/models/User");
const { setupTestDB } = require("../helpers/setup");

setupTestDB();

describe("Auth API", () => {
  describe("POST /api/auth/register", () => {
    const validUser = {
      username: "newuser",
      email: "newuser@example.com",
      password: "Password123!",
    };

    it("should register new user", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(validUser)
        .expect(201);

      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toMatchObject({
        username: validUser.username,
        email: validUser.email,
      });
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should not register user with existing email", async () => {
      await User.create(validUser);

      await request(app).post("/api/auth/register").send(validUser).expect(400);
    });

    it("should not register user with invalid email", async () => {
      await request(app)
        .post("/api/auth/register")
        .send({
          ...validUser,
          email: "invalid-email",
        })
        .expect(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        username: "testuser",
        email: "test@example.com",
        password: "Password123!",
      });
    });

    it("should login with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "Password123!",
        })
        .expect(200);

      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toMatchObject({
        email: "test@example.com",
      });
    });

    it("should not login with incorrect password", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        })
        .expect(401);
    });
  });
});
