// backend/src/routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { protect } = require("../middleware/auth");

// Private routes (require authentication)
router.get("/me", protect, userController.getUser);
router.put("/me", protect, userController.updateUser);
router.get("/community", userController.getCommunityUsers);

// Follow/Unfollow routes
router.post("/follow/:userId", protect, userController.followUser);
router.post("/unfollow/:userId", protect, userController.unfollowUser); // Add this
router.get("/:userId/following", protect, userController.getFollowing); // Add this
router.get("/:userId/followers", protect, userController.getFollowers); // Add this

// Profile and recipes routes
router.get("/:userId/profile", userController.getUserProfile);
router.get("/:userId/recipes", userController.getUserRecipes);

// Public route for viewing profiles
router.get("/:username", userController.getUserByUsername);

module.exports = router;
