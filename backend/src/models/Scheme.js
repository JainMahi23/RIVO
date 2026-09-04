import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["MICRO_FINANCE", "TERM_LOAN"],
    },

    projectCost: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    loanPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    maximumLoanAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    interestRate: {
      type: Number,
      required: true,
      min: 0,
    },

    tenureYears: {
      type: Number,
      required: true,
      min: 0,
    },

    moratoriumMonths: {
      type: Number,
      required: true,
      min: 0,
    },

    marginPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    eligibility: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      trim: true,
    },

    sourceYear: {
      type: Number,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Scheme", schemeSchema);