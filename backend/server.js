// backend/server.js
const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Current time (UTC): ${new Date().toISOString()}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Handle server shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});
