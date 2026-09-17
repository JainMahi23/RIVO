import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";

/**
 * Attach req.user if the request has a valid JWT (cookie OR Authorization header).
 * Returns 401 if no token is present or the token is invalid.
 */
export async function protect(req, res, next) {
  try {
    // 1. Try cookie first
    let token = req.cookies?.[env.cookieName];

    // 2. Fall back to Authorization: Bearer <token>
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/**
 * Restrict access to users with one of the specified roles.
 * Must be used after protect().
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized for this action" });
    }
    next();
  };
}
