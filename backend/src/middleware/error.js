// backend/src/middleware/error.js
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation Error",
      details: err.message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Invalid ID",
      details: err.message,
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    details: err.message,
  });
};

module.exports = errorHandler;
