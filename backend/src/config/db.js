import mongoose from "mongoose";
import { env } from "./env.js";

// Connection is intentionally NOT called automatically on import.
// server.js decides when to connect, and the app should still be able
// to boot (e.g. for early frontend dev) even with no MONGO_URI set yet.
export async function connectDB() {
  if (!env.mongoUri) {
    console.warn("MONGO_URI not set — skipping database connection.");
    return;
  }
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}
