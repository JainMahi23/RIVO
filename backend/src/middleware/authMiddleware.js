import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

// Placeholder auth guard. Real token issuance/refresh comes with the
// auth module — this just establishes where the check happens.
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }
  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
