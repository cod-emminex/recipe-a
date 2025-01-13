// src/controllers/user.js
const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  const updates = req.body;
  const allowedUpdates = ["username", "email"];

  // Filter out non-allowed updates
  Object.keys(updates).forEach((key) => {
    if (!allowedUpdates.includes(key)) delete updates[key];
  });

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
