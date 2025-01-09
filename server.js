// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Initialize app and dotenv
const app = express();
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const recipeRoutes = require("./routes/recipes");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categories");
const uploadRoutes = require("./routes/upload");
const collectionRoutes = require("./routes/collections");

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve all static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(`[${new Date().toISOString()}] Connected to MongoDB`);
  })
  .catch((err) => {
    console.error(
      `[${new Date().toISOString()}] MongoDB connection error:`,
      err
    );
  });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/upload", uploadRoutes);

// Catch-all route to serve index.html for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(
    `[${new Date().toISOString()}] Server is running on port ${PORT}`
  );
  console.log(
    `[${new Date().toISOString()}] Server started by user: cod-emminex`
  );
});
