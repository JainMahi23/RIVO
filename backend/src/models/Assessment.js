import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    businessCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessCategory",
      required: true,
    },

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    personalInfo: {
      name: {
        type: String,
        trim: true,
      },
      age: {
        type: Number,
        min: 18,
      },
      phone: {
        type: String,
        trim: true,
      },
    },

    businessInfo: {
      businessName: {
        type: String,
        trim: true,
      },
      experience: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
    },

    financialInput: {
      marginCapital: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    financialResult: {
      projectCost: {
        type: Number,
      },

      loanAmount: {
        type: Number,
      },

      interestRate: {
        type: Number,
      },

      tenureYears: {
        type: Number,
      },

      moratoriumMonths: {
        type: Number,
      },

      emi: {
        type: Number,
      },

      totalInterest: {
        type: Number,
      },

      repaymentSchedule: [
        {
          period: Number,
          dueDate: Date,
          principal: Number,
          interest: Number,
          installment: Number,
          remainingBalance: Number,
        },
      ],
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "SUBMITTED",
        "ANALYSIS_PENDING",
        "ANALYSIS_COMPLETED",
        "COMPLETED",
      ],
      default: "DRAFT",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Assessment", assessmentSchema);