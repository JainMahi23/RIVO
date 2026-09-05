
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

    // Total project/business cost supported by the scheme
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

    /*
     * Scheme-specific financing structure.
     *
     * Example:
     * governmentSharePercentage = 85
     * beneficiarySharePercentage = 15
     *
     * Do NOT assume every scheme has 10% margin.
     */
    financing: {
      governmentSharePercentage: {
        type: Number,
        min: 0,
        max: 100,
      },

      beneficiarySharePercentage: {
        type: Number,
        min: 0,
        max: 100,
      },
    },

    /*
     * Different loan slabs can have different:
     * - interest rates
     * - repayment periods
     * - loan limits
     */
    loanSlabs: [
      {
        minLoanAmount: {
          type: Number,
          required: true,
          min: 0,
        },

        maxLoanAmount: {
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
          default: 0,
          min: 0,
        },
      },
    ],

    maximumLoanAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /*
     * Human-readable eligibility description.
     * Detailed rule processing can be added separately in the
     * eligibility service later.
     */
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
