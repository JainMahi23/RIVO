import dotenv from "dotenv";

dotenv.config();

// Single place that reads process.env so the rest of the codebase never
// touches process.env directly.
export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieName: process.env.COOKIE_NAME || "rivo_token",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};