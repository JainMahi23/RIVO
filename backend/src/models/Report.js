import mongoose from "mongoose";

// Generated feasibility report for an assessment (score breakdown,
// SWOT, recommendations). Lives inside the Feasibility workflow, not
// a separate "Reports" concept.
const reportSchema = new mongoose.Schema(
  {
    assessment: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment" },
    overallScore: Number,
    marketScore: Number,
    financialScore: Number,
    repaymentScore: Number,
    riskScore: Number,
    swot: {
      strengths: [String],
      opportunities: [String],
      risks: [String],
      threats: [String],
    },
    recommendations: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
