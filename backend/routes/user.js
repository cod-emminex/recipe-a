// backend/routes/user.js
const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/userController");
const auth = require("../middleware/auth");
const User = require('../models/User');
// Get profile
router.get("/me", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update profile
router.patch("/me", async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["username", "bio"];
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      throw new Error("Invalid updates");
    }

    const user = await User.findById(req.user.id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
