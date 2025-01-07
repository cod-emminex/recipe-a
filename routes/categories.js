// routes/categories.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Category = require('../models/Category');
const {uploadMiddleware} = require('../config/cloudinary');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({message: 'Error fetching categories'});
  }
});

// Create category (admin only)
router.post('/', auth, uploadMiddleware.single('image'), async (req, res) => {
  try {
    const {name, description} = req.body;

    const category = new Category({
      name,
      description,
      image: req.file ? req.file.path : undefined
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({message: 'Error creating category'});
  }
});

module.exports = router;
