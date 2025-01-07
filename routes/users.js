// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password');
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({message: 'Error fetching profile'});
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'profileImage'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({message: 'Invalid updates'});
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({message: 'Error updating profile'});
  }
});

// Get user's recipes
router.get('/my-recipes', auth, async (req, res) => {
  try {
    const recipes = await Recipe.find({authorId: req.user.userId})
      .sort({createdAt: -1});
    res.json(recipes);
  } catch (error) {
    res.status(500).json({message: 'Error fetching recipes'});
  }
});

// Toggle favorite recipe
router.post('/favorites/:recipeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const recipeId = req.params.recipeId;

    const index = user.favorites.indexOf(recipeId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({message: 'Error updating favorites'});
  }
});

module.exports = router;
