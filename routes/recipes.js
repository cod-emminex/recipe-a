// routes/recipes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('authorId', 'username')
      .sort({createdAt: -1});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({message: 'Error fetching recipes'});
  }
});

// Create new recipe
router.post('/', auth, async (req, res) => {
  try {
    const {title, description, ingredients, instructions, prepTime, cookTime, servings, difficulty, category, image} = req.body;

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      difficulty,
      category,
      image,
      authorId: req.user.userId
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({message: 'Error creating recipe'});
  }
});

// Get single recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('authorId', 'username');

    if (!recipe) {
      return res.status(404).json({message: 'Recipe not found'});
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({message: 'Error fetching recipe'});
  }
});

// Update recipe
router.patch('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({message: 'Recipe not found'});
    }

    if (recipe.authorId.toString() !== req.user.userId) {
      return res.status(403).json({message: 'Not authorized'});
    }

    Object.assign(recipe, req.body);
    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(500).json({message: 'Error updating recipe'});
  }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({message: 'Recipe not found'});
    }

    if (recipe.authorId.toString() !== req.user.userId) {
      return res.status(403).json({message: 'Not authorized'});
    }

    await recipe.deleteOne();
    res.json({message: 'Recipe deleted successfully'});
  } catch (error) {
    res.status(500).json({message: 'Error deleting recipe'});
  }
});

module.exports = router;
