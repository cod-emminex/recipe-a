// src/routes/user.js
const express = require("express");
const { protect } = require("../middleware/auth");
const { getProfile, updateProfile } = require("../controllers/user");

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

module.exports = router;
