// tests/integration/recipe.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const Recipe = require("../../src/models/Recipe");
const { setupTestDB, createTestUser } = require("../helpers/setup");

setupTestDB();

describe("Recipe API", () => {
  let user;
  let token;
  let testRecipe;

  beforeEach(async () => {
    const testData = await createTestUser();
    user = testData.user;
    token = testData.token;

    testRecipe = await Recipe.create({
      title: "Test Recipe",
      description: "Test Description",
      ingredients: ["ingredient 1", "ingredient 2"],
      steps: ["step 1", "step 2"],
      author: user._id,
    });
  });

  describe("POST /api/recipes", () => {
    const newRecipe = {
      title: "New Test Recipe",
      description: "New Test Description",
      ingredients: ["new ingredient 1", "new ingredient 2"],
      steps: ["new step 1", "new step 2"],
    };

    it("should create a recipe when authenticated", async () => {
      const res = await request(app)
        .post("/api/recipes")
        .set("Authorization", `Bearer ${token}`)
        .send(newRecipe)
        .expect(201);

      expect(res.body).toMatchObject({
        title: newRecipe.title,
        description: newRecipe.description,
        ingredients: newRecipe.ingredients,
        steps: newRecipe.steps,
        author: expect.objectContaining({
          username: user.username,
        }),
      });
    });

    it("should return 401 if not authenticated", async () => {
      await request(app).post("/api/recipes").send(newRecipe).expect(401);
    });
  });

  describe("GET /api/recipes", () => {
    it("should get all recipes", async () => {
      const res = await request(app).get("/api/recipes").expect(200);

      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0]).toMatchObject({
        title: testRecipe.title,
        author: expect.objectContaining({
          username: user.username,
        }),
      });
    });
  });

  describe("GET /api/recipes/:id", () => {
    it("should get recipe by id", async () => {
      const res = await request(app)
        .get(`/api/recipes/${testRecipe._id}`)
        .expect(200);

      expect(res.body).toMatchObject({
        title: testRecipe.title,
        description: testRecipe.description,
      });
    });

    it("should return 404 for non-existent recipe", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app).get(`/api/recipes/${fakeId}`).expect(404);
    });
  });

  describe("PUT /api/recipes/:id", () => {
    it("should update recipe when authenticated as author", async () => {
      const updates = {
        title: "Updated Recipe Title",
        description: "Updated Recipe Description",
      };

      const res = await request(app)
        .put(`/api/recipes/${testRecipe._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updates)
        .expect(200);

      expect(res.body).toMatchObject(updates);
    });

    it("should not update recipe of another user", async () => {
      const otherUser = await createTestUser({
        username: "otheruser",
        email: "other@example.com",
      });

      await request(app)
        .put(`/api/recipes/${testRecipe._id}`)
        .set("Authorization", `Bearer ${otherUser.token}`)
        .send({ title: "Unauthorized Update" })
        .expect(404);
    });
  });

  describe("DELETE /api/recipes/:id", () => {
    it("should delete recipe when authenticated as author", async () => {
      await request(app)
        .delete(`/api/recipes/${testRecipe._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const deletedRecipe = await Recipe.findById(testRecipe._id);
      expect(deletedRecipe).toBeNull();
    });

    it("should not delete recipe of another user", async () => {
      const otherUser = await createTestUser({
        username: "otheruser",
        email: "other@example.com",
      });

      await request(app)
        .delete(`/api/recipes/${testRecipe._id}`)
        .set("Authorization", `Bearer ${otherUser.token}`)
        .expect(404);
    });
  });
});
