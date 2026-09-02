import mongoose from "mongoose";

// Government financing scheme reference data. Kept independent from
// assessments so it can be updated/seeded separately.
const schemeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    maxProjectCost: Number,
    maxLoanAmount: Number,
    interestRate: Number,
    tenureMonths: Number,
    moratoriumMonths: Number,
    eligibilityNotes: String,
  },
  { timestamps: true }
);

export default mongoose.model("Scheme", schemeSchema);
