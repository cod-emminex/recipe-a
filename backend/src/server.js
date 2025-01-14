// src/server.js
const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
