// backend/src/routes/user.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { protect } = require("../middleware/auth");

// Private routes (require authentication)
router.get("/me", protect, userController.getUser);
router.put("/me", protect, userController.updateUser);

// Public route for viewing profiles
router.get("/:username", userController.getUserByUsername);

module.exports = router;
