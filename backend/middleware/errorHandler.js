// ApexFit Studio OS - Centralized Error Handling Middleware

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} - Endpoint not found.`
  });
};

export const errorHandler = (err, req, res, next) => {
  console.error("❌ [API Error]:", err.stack || err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: "Validation Failed",
      details: messages
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      error: `Duplicate entry: An athlete with this ${field} already exists.`
    });
  }

  // Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: `Resource not found with invalid id format: ${err.value}`
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
};
