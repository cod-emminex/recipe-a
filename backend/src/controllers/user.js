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
      name: req.body.name,
      bio: req.body.bio,
      country: req.body.country,
      bestRecipe: req.body.bestRecipe,
      favoriteCuisine: req.body.favoriteCuisine,
      avatarUrl: req.body.avatarUrl,
    };

    // Remove undefined fields
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    // Validate country data if it's being updated
    if (updates.country) {
      if (
        !updates.country.code ||
        !updates.country.name ||
        !updates.country.flag
      ) {
        return res.status(400).json({
          error: "Country data must include code, name, and flag",
        });
      }
    }

    // Add validation for required fields
    if (updates.email && !updates.email.includes("@")) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Update user error:", error);
    // Check for duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        error: `This ${field} is already taken`,
      });
    }
    res.status(400).json({ error: error.message });
  }
};

// Get user by username (for public profiles)
exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
    }).select("-password -email");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Get user by username error:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
};
