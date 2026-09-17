import mongoose from "mongoose";

// Full structured feasibility report for an assessment
const reportSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ===== Business Summary =====
    businessSummary: {
      categoryName: String,
      categorySector: String,
      businessName: String,
      experience: String,
      description: String,
      personalName: String,
      personalAge: Number,
      personalPhone: String,
    },

    // ===== Location Summary =====
    locationSummary: {
      state: String,
      district: String,
      subDistrict: String,
      village: String,
      pincode: String,
      population: Number,
      households: Number,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    // ===== Market Analysis Summary =====
    marketSummary: {
      competitorCount: Number,
      competitionLevel: String,
      demandLevel: String,
      opportunityLevel: String,
      marketReach: Number,
      marketRadiusKm: Number,
    },

    // ===== Financial Analysis =====
    financialSummary: {
      projectCost: Number,
      marginCapital: Number,
      loanAmount: Number,
      interestRate: Number,
      tenureYears: Number,
      emi: Number,
      totalInterest: Number,
      totalRepayment: Number,
      monthlyRevenue: Number,
      monthlyExpenses: Number,
      grossProfit: Number,
      netProfit: Number,
      grossMargin: Number,
      netMargin: Number,
    },

    // ===== Scheme Information =====
    schemeSummary: {
      schemeName: String,
      schemeCode: String,
      maximumLoanAmount: Number,
      governmentSharePercentage: Number,
      beneficiarySharePercentage: Number,
    },

    // ===== Feasibility Scores =====
    overallScore: Number,
    verdict: {
      type: String,
      enum: ["HIGHLY_FEASIBLE", "FEASIBLE", "MARGINALLY_FEASIBLE", "NOT_FEASIBLE"],
    },
    dscr: Number,
    loanToProjectRatio: Number,
    breakEvenMonths: Number,

    // ===== SWOT =====
    swot: {
      strengths: [String],
      weaknesses: [String],
      opportunities: [String],
      threats: [String],
    },

    // ===== Assumptions =====
    assumptions: [String],

    // ===== Recommendations =====
    recommendations: [String],

    // ===== Factors =====
    factors: [String],

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
