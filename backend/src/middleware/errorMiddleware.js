// Centralized error handler. Every controller should call next(err)
// on failure rather than shaping its own error response.
export function errorMiddleware(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
  });
}

export function notFoundMiddleware(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}
