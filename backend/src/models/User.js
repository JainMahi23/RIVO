import mongoose from "mongoose";

// Placeholder schema only — fields will expand with the auth module.
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    passwordHash: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
