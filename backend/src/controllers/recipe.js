// src/controllers/recipe.js
const Recipe = require("../models/Recipe");

exports.createRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      author: req.user._id,
    });

    const populatedRecipe = await recipe.populate("author", "username");
    res.status(201).json(populatedRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "author",
      "username"
    );

    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate("author", "username");

    if (!recipe) {
      return res
        .status(404)
        .json({ error: "Recipe not found or unauthorized" });
    }

    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!recipe) {
      return res
        .status(404)
        .json({ error: "Recipe not found or unauthorized" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
