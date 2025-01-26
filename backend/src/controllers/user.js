// backend/src/controllers/user.js
const User = require("../models/User");
const Recipe = require("../models/Recipe");

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

exports.getCommunityUsers = async (req, res) => {
  try {
    const currentUserId = req.user?._id;
    const users = await User.find({})
      .select("-password")
      .populate("recipes", "title image")
      .lean();

    const usersWithStats = users.map((user) => ({
      ...user,
      recipesCount: user.recipes?.length || 0,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      isFollowing: currentUserId
        ? user.followers?.some(
            (id) => id.toString() === currentUserId.toString()
          )
        : false,
      isSelf: currentUserId
        ? user._id.toString() === currentUserId.toString()
        : false,
    }));

    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollowId = req.params.userId;
    const currentUserId = req.user._id;

    // Check if trying to follow self
    if (userToFollowId === currentUserId.toString()) {
      return res.status(400).json({
        error: "You cannot follow yourself",
      });
    }

    // Get both users
    const [userToFollow, currentUser] = await Promise.all([
      User.findById(userToFollowId),
      User.findById(currentUserId),
    ]);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Check if already following
    const isAlreadyFollowing = currentUser.following.includes(userToFollowId);
    if (isAlreadyFollowing) {
      return res.status(400).json({
        error: "You are already following this user",
      });
    }

    // Add to following/followers
    currentUser.following.push(userToFollowId);
    userToFollow.followers.push(currentUserId);

    await Promise.all([currentUser.save(), userToFollow.save()]);

    res.json({
      success: true,
      message: `You are now following ${userToFollow.username}`,
      followersCount: userToFollow.followers.length,
      followingCount: currentUser.following.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollowId = req.params.userId;
    const currentUserId = req.user._id;

    // Get both users
    const [userToUnfollow, currentUser] = await Promise.all([
      User.findById(userToUnfollowId),
      User.findById(currentUserId),
    ]);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Check if actually following
    const isFollowing = currentUser.following.includes(userToUnfollowId);
    if (!isFollowing) {
      return res.status(400).json({
        error: "You are not following this user",
      });
    }

    // Remove from following/followers
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollowId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await Promise.all([currentUser.save(), userToUnfollow.save()]);

    res.json({
      success: true,
      message: `You have unfollowed ${userToUnfollow.username}`,
      followersCount: userToUnfollow.followers.length,
      followingCount: currentUser.following.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentUserId = req.user?._id;

    const user = await User.findById(userId)
      .select("-password")
      .populate("recipes", "title image createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = {
      ...user,
      recipesCount: user.recipes?.length || 0,
      followersCount: user.followers?.length || 0,
      followingCount: user.following?.length || 0,
      isFollowing: currentUserId
        ? user.followers.some(
            (id) => id.toString() === currentUserId.toString()
          )
        : false,
      isSelf: currentUserId
        ? user._id.toString() === currentUserId.toString()
        : false,
    };

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
