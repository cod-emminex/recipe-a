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

// Create recipe
router.post('/', auth, async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      authorId: req.user.userId
    });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({message: 'Error creating recipe'});
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

    await recipe.remove();
    res.json({message: 'Recipe deleted'});
  } catch (error) {
    res.status(500).json({message: 'Error deleting recipe'});
  }
});
// routes/recipes.js (additional endpoints)

// Search recipes
router.get('/search', async (req, res) => {
  try {
    const {query, category, difficulty, time} = req.query;
    let searchQuery = {};

    // Text search
    if (query) {
      searchQuery.$or = [
        {title: {$regex: query, $options: 'i'}},
        {description: {$regex: query, $options: 'i'}}
      ];
    }

    // Category filter
    if (category) {
      searchQuery.category = category;
    }

    // Difficulty filter
    if (difficulty) {
      searchQuery.difficulty = difficulty;
    }

    // Time filter
    if (time) {
      searchQuery.totalTime = {$lte: parseInt(time)};
    }

    const recipes = await Recipe.find(searchQuery)
      .populate('authorId', 'username')
      .sort({createdAt: -1});

    res.json(recipes);
  } catch (error) {
    res.status(500).json({message: 'Error searching recipes'});
  }
});

// Get recipe recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const userFavorites = user.favorites;

    // Get categories from user's favorite recipes
    const favoriteRecipes = await Recipe.find({
      _id: {$in: userFavorites}
    });

    const favoriteCategories = [...new Set(
      favoriteRecipes.flatMap(recipe => recipe.category)
    )];

    // Find similar recipes
    const recommendations = await Recipe.find({
      _id: {$nin: userFavorites},
      category: {$in: favoriteCategories}
    })
      .limit(10)
      .populate('authorId', 'username');

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({message: 'Error getting recommendations'});
  }
});
module.exports = router;
