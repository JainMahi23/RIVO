// Wraps an async route handler so thrown errors reach errorMiddleware
// automatically instead of every controller needing its own try/catch.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
