// backend/app.js (add these lines)
const morgan = require("morgan");

// Add logging middleware
app.use(morgan("dev"));

// Add better error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
      timestamp: new Date().toISOString(),
    },
  });
});
