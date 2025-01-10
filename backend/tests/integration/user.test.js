// backend/tests/integration/user.test.js
const request = require("supertest");
const app = require("../../app");
const { createAuthenticatedUser } = require("../helpers/testUtils");

describe("User Routes", () => {
  describe("GET /api/users/me", () => {
    it("should get authenticated user profile", async () => {
      const { user, token } = await createAuthenticatedUser();

      const response = await request(app)
        .get("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("_id", user._id.toString());
      expect(response.body).toHaveProperty("email", user.email);
    });

    it("should not get profile without auth token", async () => {
      await request(app).get("/api/users/me").expect(401);
    });
  });

  describe("PATCH /api/users/me", () => {
    it("should update user profile", async () => {
      const { token } = await createAuthenticatedUser();
      const updates = {
        username: "updatedname",
        bio: "New bio",
      };

      const response = await request(app)
        .patch("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send(updates)
        .expect(200);

      expect(response.body).toHaveProperty("username", updates.username);
      expect(response.body).toHaveProperty("bio", updates.bio);
    });

    it("should not update invalid fields", async () => {
      const { token } = await createAuthenticatedUser();
      const updates = {
        invalidField: "invalid",
      };

      const response = await request(app)
        .patch("/api/users/me")
        .set("Authorization", `Bearer ${token}`)
        .send(updates)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });
});
