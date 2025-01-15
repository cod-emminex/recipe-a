// src/routes/auth.js
const express = require("express");
const { register, login } = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/verify", protect, async (req, res) => {
  try {
    // User is already verified through auth middleware
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
