// src/routes/user.js
const express = require("express");
const { protect } = require("../middleware/auth");
const { getUser, updateUser } = require("../controllers/user");

const router = express.Router();

// Update these routes to use the correct controller functions
router.get("/me", protect, getUser);
router.put("/me", protect, updateUser);
module.exports = router;
