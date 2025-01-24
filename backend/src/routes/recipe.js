// src/routes/recipe.js
const express = require("express");
const { protect } = require("../middleware/auth");
const {
  createRecipe,
  getRecipes,
  getRecipe,
  getMyRecipes,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipe");

const router = express.Router();

// Validate recipe number middleware
const validateRecipeNumber = (req, res, next) => {
  const number = parseInt(req.params.number);
  if (isNaN(number)) {
    return res.status(400).json({
      error: "Invalid recipe number",
    });
  }
  req.params.number = number; // Store parsed number
  next();
};

router.post("/", protect, createRecipe);
router.get("/", getRecipes);
router.get("/number/:number", validateRecipeNumber, getRecipe);
router.get("/my-recipes", protect, getMyRecipes);
router.put("/number/:number", protect, validateRecipeNumber, updateRecipe);
router.delete("/number/:number", protect, validateRecipeNumber, deleteRecipe);
module.exports = router;
