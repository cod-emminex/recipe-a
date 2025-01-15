// backend/src/config/index.js
require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "fallback_secret_key_for_development",
  mongoURI: process.env.MONGODB_URI,
};
