// routes/ratings.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');

// Add rating and review
router.post('/:recipeId/rate', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({message: 'Recipe not found'});
    }

    const {rating, review} = req.body;

    // Check if user has already rated
    const existingRating = recipe.ratings.find(
      r => r.userId.toString() === req.user.userId
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review;
    } else {
      recipe.ratings.push({
        userId: req.user.userId,
        rating,
        review
      });
    }

    // Update average rating
    const totalRatings = recipe.ratings.reduce((sum, r) => sum + r.rating, 0);
    recipe.averageRating = totalRatings / recipe.ratings.length;

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    res.status(500).json({message: 'Error adding rating'});
  }
});

// Get recipe ratings
router.get('/:recipeId/ratings', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
      .populate('ratings.userId', 'username profileImage');

    if (!recipe) {
      return res.status(404).json({message: 'Recipe not found'});
    }

    res.json(recipe.ratings);
  } catch (error) {
    res.status(500).json({message: 'Error fetching ratings'});
  }
});

module.exports = router;
