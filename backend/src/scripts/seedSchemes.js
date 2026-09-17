import mongoose from "mongoose";
import dotenv from "dotenv";
import Scheme from "../models/Scheme.js";

dotenv.config();

const schemes = [
  {
    name: "NBCFDC Individual Loan Scheme",
    code: "NBCFDC_ILS",
    type: "TERM_LOAN",
    projectCost: { min: 1000, max: 2500000 },
    financing: { governmentSharePercentage: 85, beneficiarySharePercentage: 15 },
    loanSlabs: [
      { minLoanAmount: 0, maxLoanAmount: 125000, interestRate: 7, tenureYears: 4, moratoriumMonths: 0 },
      { minLoanAmount: 125001, maxLoanAmount: 2500000, interestRate: 8, tenureYears: 7, moratoriumMonths: 0 },
    ],
    maximumLoanAmount: 2500000,
    eligibility: "Applicant should belong to notified Backward Classes with family income under prescribed norms.",
    source: "NBCFDC",
    sourceYear: 2026,
    active: true,
  },
  {
    name: "PM Mudra Yojana - Shishu",
    code: "PMMY_SHISHU",
    type: "MICRO_FINANCE",
    projectCost: { min: 1000, max: 50000 },
    financing: { governmentSharePercentage: 100, beneficiarySharePercentage: 0 },
    loanSlabs: [
      { minLoanAmount: 1000, maxLoanAmount: 50000, interestRate: 10, tenureYears: 3, moratoriumMonths: 0 },
    ],
    maximumLoanAmount: 50000,
    eligibility: "Any Indian citizen with a non-farm income-generating business plan. No collateral required.",
    source: "MUDRA / SIDBI",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "PM Mudra Yojana - Kishore",
    code: "PMMY_KISHORE",
    type: "TERM_LOAN",
    projectCost: { min: 50001, max: 500000 },
    financing: { governmentSharePercentage: 100, beneficiarySharePercentage: 0 },
    loanSlabs: [
      { minLoanAmount: 50001, maxLoanAmount: 500000, interestRate: 11, tenureYears: 5, moratoriumMonths: 6 },
    ],
    maximumLoanAmount: 500000,
    eligibility: "Indian citizens with existing small business needing expansion funds.",
    source: "MUDRA / SIDBI",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "PM Mudra Yojana - Tarun",
    code: "PMMY_TARUN",
    type: "TERM_LOAN",
    projectCost: { min: 500001, max: 1000000 },
    financing: { governmentSharePercentage: 100, beneficiarySharePercentage: 0 },
    loanSlabs: [
      { minLoanAmount: 500001, maxLoanAmount: 1000000, interestRate: 12, tenureYears: 5, moratoriumMonths: 6 },
    ],
    maximumLoanAmount: 1000000,
    eligibility: "Established small enterprise owners expanding capacity up to ₹10 Lakh.",
    source: "MUDRA / SIDBI",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    code: "PMEGP",
    type: "TERM_LOAN",
    projectCost: { min: 100000, max: 5000000 },
    financing: { governmentSharePercentage: 75, beneficiarySharePercentage: 25 },
    loanSlabs: [
      { minLoanAmount: 75000, maxLoanAmount: 2500000, interestRate: 8, tenureYears: 5, moratoriumMonths: 6 },
      { minLoanAmount: 2500001, maxLoanAmount: 5000000, interestRate: 9, tenureYears: 7, moratoriumMonths: 6 },
    ],
    maximumLoanAmount: 5000000,
    eligibility: "Any individual above 18 years. Minimum 8th class pass for projects above ₹10L (manufacturing) or ₹5L (service).",
    source: "KVIC / Ministry of MSME",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "Stand-Up India Scheme",
    code: "SUI",
    type: "TERM_LOAN",
    projectCost: { min: 1000000, max: 10000000 },
    financing: { governmentSharePercentage: 75, beneficiarySharePercentage: 25 },
    loanSlabs: [
      { minLoanAmount: 1000000, maxLoanAmount: 10000000, interestRate: 9, tenureYears: 7, moratoriumMonths: 18 },
    ],
    maximumLoanAmount: 10000000,
    eligibility: "SC/ST and Women entrepreneurs above 18 years setting up greenfield enterprises.",
    source: "SIDBI / Department of Financial Services",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "PM Vishwakarma Scheme",
    code: "PM_VISHWAKARMA",
    type: "TERM_LOAN",
    projectCost: { min: 10000, max: 300000 },
    financing: { governmentSharePercentage: 95, beneficiarySharePercentage: 5 },
    loanSlabs: [
      { minLoanAmount: 10000, maxLoanAmount: 100000, interestRate: 5, tenureYears: 1.5, moratoriumMonths: 0 },
      { minLoanAmount: 100001, maxLoanAmount: 300000, interestRate: 5, tenureYears: 2.5, moratoriumMonths: 0 },
    ],
    maximumLoanAmount: 300000,
    eligibility: "Traditional artisans and craftspeople across 18 family-based trades (Carpenters, Blacksmiths, Tailors, Potters, Weavers, etc.). Concessional 5% interest rate.",
    source: "Ministry of MSME",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "PM SVANidhi (Street Vendor's AtmaNirbhar Nidhi)",
    code: "PM_SVANIDHI",
    type: "MICRO_FINANCE",
    projectCost: { min: 5000, max: 50000 },
    financing: { governmentSharePercentage: 100, beneficiarySharePercentage: 0 },
    loanSlabs: [
      { minLoanAmount: 5000, maxLoanAmount: 10000, interestRate: 7, tenureYears: 1, moratoriumMonths: 0 },
      { minLoanAmount: 10001, maxLoanAmount: 20000, interestRate: 7, tenureYears: 1.5, moratoriumMonths: 0 },
      { minLoanAmount: 20001, maxLoanAmount: 50000, interestRate: 7, tenureYears: 3, moratoriumMonths: 0 },
    ],
    maximumLoanAmount: 50000,
    eligibility: "Street vendors operating in urban, semi-urban, or peri-urban areas. Collateral-free working capital micro-loans with 7% interest subsidy.",
    source: "Ministry of Housing and Urban Affairs",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "PM Formalisation of Micro food processing Enterprises (PMFME)",
    code: "PMFME",
    type: "TERM_LOAN",
    projectCost: { min: 50000, max: 10000000 },
    financing: { governmentSharePercentage: 65, beneficiarySharePercentage: 35 },
    loanSlabs: [
      { minLoanAmount: 50000, maxLoanAmount: 1000000, interestRate: 8.5, tenureYears: 5, moratoriumMonths: 6 },
      { minLoanAmount: 1000001, maxLoanAmount: 10000000, interestRate: 9.5, tenureYears: 7, moratoriumMonths: 12 },
    ],
    maximumLoanAmount: 10000000,
    eligibility: "Micro food processing units (pickle/papad making, flour/dal mills, spice grinding, bakery, dairy units). 35% credit-linked capital subsidy up to ₹10 Lakh.",
    source: "Ministry of Food Processing Industries",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "Animal Husbandry Infrastructure Development Fund (AHIDF)",
    code: "AHIDF",
    type: "TERM_LOAN",
    projectCost: { min: 500000, max: 50000000 },
    financing: { governmentSharePercentage: 90, beneficiarySharePercentage: 10 },
    loanSlabs: [
      { minLoanAmount: 500000, maxLoanAmount: 50000000, interestRate: 6.5, tenureYears: 8, moratoriumMonths: 24 },
    ],
    maximumLoanAmount: 50000000,
    eligibility: "Individual entrepreneurs, FPOs, and Section 8 companies setting up dairy processing, meat processing, or animal feed plants. 3% interest subvention.",
    source: "Department of Animal Husbandry & Dairying",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
    code: "PMMSY",
    type: "TERM_LOAN",
    projectCost: { min: 100000, max: 2500000 },
    financing: { governmentSharePercentage: 60, beneficiarySharePercentage: 40 },
    loanSlabs: [
      { minLoanAmount: 100000, maxLoanAmount: 2500000, interestRate: 8, tenureYears: 5, moratoriumMonths: 6 },
    ],
    maximumLoanAmount: 2500000,
    eligibility: "Fish farmers, aquaculture entrepreneurs, SHGs, and cooperatives. Financial assistance of 40% (general category) or 60% (women/SC/ST) of project cost.",
    source: "Department of Fisheries",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "Credit Guarantee Fund Scheme for Micro & Small Enterprises (CGTMSE)",
    code: "CGTMSE",
    type: "TERM_LOAN",
    projectCost: { min: 100000, max: 20000000 },
    financing: { governmentSharePercentage: 85, beneficiarySharePercentage: 15 },
    loanSlabs: [
      { minLoanAmount: 100000, maxLoanAmount: 5000000, interestRate: 8.5, tenureYears: 5, moratoriumMonths: 6 },
      { minLoanAmount: 5000001, maxLoanAmount: 20000000, interestRate: 9.5, tenureYears: 7, moratoriumMonths: 12 },
    ],
    maximumLoanAmount: 20000000,
    eligibility: "Collateral-free, third-party guarantee-free credit facility up to ₹2 Crore for new and existing Micro and Small Enterprises.",
    source: "Ministry of MSME & SIDBI",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "National SC Finance & Development Corporation (NSCFDC) Term Loan",
    code: "NSCFDC_TL",
    type: "TERM_LOAN",
    projectCost: { min: 50000, max: 1500000 },
    financing: { governmentSharePercentage: 90, beneficiarySharePercentage: 10 },
    loanSlabs: [
      { minLoanAmount: 50000, maxLoanAmount: 500000, interestRate: 6, tenureYears: 5, moratoriumMonths: 6 },
      { minLoanAmount: 500001, maxLoanAmount: 1500000, interestRate: 7, tenureYears: 6, moratoriumMonths: 6 },
    ],
    maximumLoanAmount: 1500000,
    eligibility: "Persons belonging to Scheduled Castes living below double the poverty line (DPL) for income-generating self-employment units.",
    source: "NSCFDC / Ministry of Social Justice",
    sourceYear: 2024,
    active: true,
  },
  {
    name: "DAY-NRLM (National Rural Livelihoods Mission - SHG Loan)",
    code: "DAY_NRLM",
    type: "MICRO_FINANCE",
    projectCost: { min: 10000, max: 1000000 },
    financing: { governmentSharePercentage: 100, beneficiarySharePercentage: 0 },
    loanSlabs: [
      { minLoanAmount: 10000, maxLoanAmount: 300000, interestRate: 7, tenureYears: 3, moratoriumMonths: 0 },
      { minLoanAmount: 300001, maxLoanAmount: 1000000, interestRate: 7, tenureYears: 5, moratoriumMonths: 0 },
    ],
    maximumLoanAmount: 1000000,
    eligibility: "Self Help Groups (SHGs) under NRLM consisting of rural women. Concessional interest rate of 7% p.a., with an additional 3% prompt repayment subvention.",
    source: "Ministry of Rural Development",
    sourceYear: 2024,
    active: true,
  },
];

async function seedSchemes() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    for (const scheme of schemes) {
      await Scheme.findOneAndUpdate(
        { name: scheme.name },
        scheme,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log("Schemes seeded successfully:", schemes.length);
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
