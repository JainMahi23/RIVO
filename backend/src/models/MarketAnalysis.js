import mongoose from "mongoose";

// Result of the Market module's analysis for a given assessment.
const marketAnalysisSchema = new mongoose.Schema(
  {
    assessment: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment" },
    // Competitor counts, demand indicators, etc. defined with the Market module
  },
  { timestamps: true }
);

export default mongoose.model("MarketAnalysis", marketAnalysisSchema);
