// routes/upload.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {uploadMiddleware, cloudinary} = require('../config/cloudinary');

// Upload single image
router.post('/single', auth, uploadMiddleware.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({message: 'No image file provided'});
    }

    res.json({
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    res.status(500).json({message: 'Error uploading image'});
  }
});

// Delete image
router.delete('/:publicId', auth, async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.publicId);
    res.json({message: 'Image deleted successfully'});
  } catch (error) {
    res.status(500).json({message: 'Error deleting image'});
  }
});

module.exports = router;
