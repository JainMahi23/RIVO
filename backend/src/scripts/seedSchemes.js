
import mongoose from "mongoose";
import dotenv from "dotenv";
import Scheme from "../models/Scheme.js";

dotenv.config();

const schemes = [
  {
    name: "NBCFDC Individual Loan Scheme",
    code: "NBCFDC_ILS",
    type: "TERM_LOAN",

    projectCost: {
      min: 1000,
      max: 2500000,
    },

    financing: {
      governmentSharePercentage: 85,
      beneficiarySharePercentage: 15,
    },

    loanSlabs: [
      {
        minLoanAmount: 0,
        maxLoanAmount: 125000,
        interestRate: 7,
        tenureYears: 4,
        moratoriumMonths: 0,
      },
      {
        minLoanAmount: 125001,
        maxLoanAmount: 2500000,
        interestRate: 8,
        tenureYears: 7,
        moratoriumMonths: 0,
      },
    ],

    maximumLoanAmount: 2500000,

    eligibility:
      "Applicant should belong to the notified Backward Classes and satisfy the applicable family-income and scheme eligibility conditions.",

    source: "NBCFDC",
    sourceYear: 2026,

    active: true,
  },
];

async function seedSchemes() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Prevent duplicate records when the script is run again.
    for (const scheme of schemes) {
      await Scheme.findOneAndUpdate(
        { code: scheme.code },
        scheme,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log(
      "Schemes seeded successfully:",
      schemes.length
    );
  } catch (error) {
    console.error("Scheme seeding failed:");
    console.error(error);

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

seedSchemes();
