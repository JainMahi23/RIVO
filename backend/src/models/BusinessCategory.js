import mongoose from "mongoose";

// Static/reference data describing a category of business the user
// can select during Assessment.
const businessCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("BusinessCategory", businessCategorySchema);
