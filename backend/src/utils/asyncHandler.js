import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export function setTokenCookie(res, token) {
  res.cookie(env.cookieName, token, {
    httpOnly: true, // JS on the frontend can't read it (XSS protection)
    secure: env.nodeEnv === "production", // HTTPS only in prod
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

export function clearTokenCookie(res) {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
  });
}
