// backend/src/controllers/user.js
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const mongoose = require("mongoose");
// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("followers")
      .populate("following")
      .populate("recipes")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      ...user,
      recipesCount: user.recipes?.length || 0,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
    };

    res.json(userData);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Error fetching profile",
      error: error.message,
    });
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

exports.getCommunityUsers = async (req, res) => {
  try {
    const currentUserId = req.user?._id;

    // First, get all users
    const users = await User.find({})
      .select("-password")
      .populate("followers", "_id username")
      .populate("following", "_id username")
      .lean();

    // Get recipe counts for all users in a single query
    const recipeCounts = await Recipe.aggregate([
      {
        $group: {
          _id: "$author",
          count: { $sum: 1 },
        },
      },
    ]);

    // Create a map of user ID to recipe count
    const recipeCountMap = new Map(
      recipeCounts.map((item) => [item._id.toString(), item.count])
    );

    // Map users with their stats
    const usersWithStats = users.map((user) => ({
      ...user,
      recipesCount: recipeCountMap.get(user._id.toString()) || 0,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      isFollowing: currentUserId
        ? user.followers?.some(
            (follower) => follower._id.toString() === currentUserId.toString()
          )
        : false,
      isSelf: currentUserId
        ? user._id.toString() === currentUserId.toString()
        : false,
    }));

    console.log(
      "Users with stats:",
      usersWithStats.map((u) => ({
        username: u.username,
        recipesCount: u.recipesCount,
        followersCount: u.followersCount,
      }))
    );

    res.json(usersWithStats);
  } catch (error) {
    console.error("Error in getCommunityUsers:", error);
    res.status(500).json({
      message: "Failed to fetch community members",
      error: error.message,
    });
  }
};
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Check if trying to follow self
    if (userId === currentUser._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if user to follow exists
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already following
    const isAlreadyFollowing = currentUser.following.includes(userId);
    if (isAlreadyFollowing) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    // Add to following array of current user
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { following: userId },
    });

    // Add to followers array of target user
    await User.findByIdAndUpdate(userId, {
      $addToSet: { followers: currentUser._id },
    });

    res.status(200).json({ message: "Successfully followed user" });
  } catch (error) {
    console.error("Follow user error:", error);
    res.status(500).json({ message: "Failed to follow user" });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Check if trying to unfollow self
    if (userId === currentUser._id.toString()) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

    // Check if user to unfollow exists
    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from following array of current user
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: userId },
    });

    // Remove from followers array of target user
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: currentUser._id },
    });

    res.status(200).json({ message: "Successfully unfollowed user" });
  } catch (error) {
    console.error("Unfollow user error:", error);
    res.status(500).json({ message: "Failed to unfollow user" });
  }
};
exports.getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .populate("following", "-password")
      .select("following");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.following);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .populate("followers", "-password")
      .select("followers");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update your existing getUserProfile to include following status
// backend/src/controllers/user.js
exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const currentUserId = req.user?._id;

    const user = await User.findOne({ username })
      .select("-password")
      .populate("recipes")
      .populate("followers")
      .populate("following")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert ObjectIds to strings for comparison
    const followersIds = user.followers.map((f) => f._id.toString());
    const currentUserIdString = currentUserId ? currentUserId.toString() : null;

    const profileData = {
      ...user,
      recipesCount: user.recipes?.length || 0,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      // Explicitly check if current user's ID is in followers array
      isFollowing: currentUserIdString
        ? followersIds.includes(currentUserIdString)
        : false,
      isSelf: currentUserIdString === user._id.toString(),
    };

    console.log("Profile Data:", {
      username: user.username,
      currentUserId: currentUserIdString,
      followersIds,
      isFollowing: profileData.isFollowing,
    });

    res.json(profileData);
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};
exports.getUserRecipes = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's recipes with populated author field
    const recipes = await Recipe.find({ author: userId })
      .populate("author", "username avatarUrl")
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean();

    // Add additional recipe stats if needed
    const recipesWithStats = recipes.map((recipe) => ({
      ...recipe,
      // Add any additional recipe stats here
      // For example: likesCount, commentsCount, etc.
    }));

    res.json(recipesWithStats);
  } catch (error) {
    console.error("Get user recipes error:", error);
    res.status(500).json({ error: "Error fetching user recipes" });
  }
};
