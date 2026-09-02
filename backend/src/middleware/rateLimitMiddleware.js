import rateLimit from "express-rate-limit";

// Basic protection against abuse, especially on the public
// feasibility-calculator endpoint which needs no login. Tune limits
// per-route as real usage patterns emerge.
export const defaultRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
