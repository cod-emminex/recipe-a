// backend/routes/user.js
const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/me", auth, getProfile);
router.patch("/me", auth, updateProfile);

module.exports = router;
