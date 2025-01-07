// routes/collections.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Collection = require('../models/Collection');
const {uploadMiddleware} = require('../config/cloudinary');

// Get user's collections
router.get('/', auth, async (req, res) => {
  try {
    const collections = await Collection.find({userId: req.user.userId})
      .populate('recipes', 'title image');
    res.json(collections);
  } catch (error) {
    res.status(500).json({message: 'Error fetching collections'});
  }
});

// Create collection
router.post('/', auth, uploadMiddleware.single('image'), async (req, res) => {
  try {
    const {name, description, isPublic} = req.body;

    const collection = new Collection({
      name,
      description,
      userId: req.user.userId,
      isPublic: isPublic === 'true',
      image: req.file ? req.file.path : undefined
    });

    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({message: 'Error creating collection'});
  }
});

// Get collection by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user.userId
    }).populate('recipes');

    if (!collection) {
      return res.status(404).json({message: 'Collection not found'});
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({message: 'Error fetching collection'});
  }
});

// Update collection
router.patch('/:id', auth, uploadMiddleware.single('image'), async (req, res) => {
  try {
    const collection = await Collection.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!collection) {
      return res.status(404).json({message: 'Collection not found'});
    }

    const updates = req.body;
    if (req.file) {
      updates.image = req.file.path;
    }

    Object.assign(collection, updates);
    await collection.save();
    res.json(collection);
  } catch (error) {
    res.status(500).json({message: 'Error updating collection'});
  }
});

// Delete collection
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!collection) {
      return res.status(404).json({message: 'Collection not found'});
    }

    res.json({message: 'Collection deleted successfully'});
  } catch (error) {
    res.status(500).json({message: 'Error deleting collection'});
  }
});

module.exports = router;
