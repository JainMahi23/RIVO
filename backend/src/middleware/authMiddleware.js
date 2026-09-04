import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import User from "../models/User.js";

// Attach req.user if the request has a valid auth cookie, else 401
export async function protect(req, res, next) {
  try {
    const token = req.cookies?.[env.cookieName];

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
