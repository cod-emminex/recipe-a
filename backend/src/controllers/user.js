// backend/src/controllers/user.js
const User = require("../models/User");

// Get user profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const updates = {
      username: req.body.username,
      email: req.body.email,
      // Add other fields you want to allow updating
    };

    // Remove undefined fields
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(400).json({ error: error.message });
  }
};
