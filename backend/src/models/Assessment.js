import mongoose from "mongoose";

// Central record tying a user to their business idea, location,
// market analysis, financials, feasibility report, and loan/scheme result.
const assessmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    businessCategory: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessCategory" },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    status: { type: String, enum: ["draft", "in_progress", "completed"], default: "draft" },
    // Personal/business detail fields to be defined with the Assessment module
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);
