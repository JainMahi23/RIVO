/**
 * Wraps an async route handler so that any rejected promise is
 * automatically forwarded to Express's error middleware via next(err).
 *
 * Usage:
 *   router.get("/", asyncHandler(async (req, res) => { ... }));
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
