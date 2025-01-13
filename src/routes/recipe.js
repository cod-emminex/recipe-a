// src/routes/recipe.js
const express = require("express");
const { protect } = require("../middleware/auth");
const {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipe");

const router = express.Router();

router.post("/", protect, createRecipe);
router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

module.exports = router;
