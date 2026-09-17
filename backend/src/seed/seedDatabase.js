import mongoose from "mongoose";
import dotenv from "dotenv";

import Location from "../models/Location.js";
import BusinessCategory from "../models/BusinessCategory.js";
import Scheme from "../models/Scheme.js";
import User from "../models/User.js";
import Assessment from "../models/Assessment.js";
import MarketAnalysis from "../models/MarketAnalysis.js";
import Report from "../models/Report.js";

import { locations } from "./mockData.js";

dotenv.config();

// ================================================================
// Core Business Categories (40 categories)
// ================================================================
const categories = [
  { name: "Dairy Farming", slug: "dairy-farming", description: "Small-scale dairy farming and milk production", sector: "Agriculture & Livestock", active: true },
  { name: "Poultry Farming", slug: "poultry-farming", description: "Small-scale poultry and egg production", sector: "Agriculture & Livestock", active: true },
  { name: "Goat Farming", slug: "goat-farming", description: "Small-scale goat rearing and livestock production", sector: "Agriculture & Livestock", active: true },
  { name: "Fish Farming", slug: "fish-farming", description: "Fish cultivation and aquaculture", sector: "Agriculture & Livestock", active: true },
  { name: "Beekeeping", slug: "beekeeping", description: "Honey bee rearing and honey production", sector: "Agriculture & Livestock", active: true },
  { name: "Mushroom Farming", slug: "mushroom-farming", description: "Small-scale mushroom cultivation", sector: "Agriculture", active: true },
  { name: "Organic Farming", slug: "organic-farming", description: "Cultivation using organic farming practices", sector: "Agriculture", active: true },
  { name: "Vegetable Farming", slug: "vegetable-farming", description: "Cultivation and sale of vegetables", sector: "Agriculture", active: true },
  { name: "Nursery & Plant Business", slug: "nursery-plant-business", description: "Plant nursery and sale of plants and saplings", sector: "Agriculture", active: true },
  { name: "Farm Equipment Rental", slug: "farm-equipment-rental", description: "Rental of agricultural tools and equipment", sector: "Agriculture Services", active: true },
  { name: "Flour Mill", slug: "flour-mill", description: "Small-scale grain and flour processing", sector: "Food Processing", active: true },
  { name: "Dal Mill", slug: "dal-mill", description: "Pulse processing and dal production", sector: "Food Processing", active: true },
  { name: "Spice Grinding & Packaging", slug: "spice-grinding-packaging", description: "Grinding, processing and packaging of spices", sector: "Food Processing", active: true },
  { name: "Pickle & Papad Making", slug: "pickle-papad-making", description: "Production of pickles, papad and similar food products", sector: "Food Processing", active: true },
  { name: "Bakery", slug: "bakery", description: "Small-scale bakery and baked food products", sector: "Food Processing", active: true },
  { name: "Food Processing Unit", slug: "food-processing-unit", description: "Small-scale processing and packaging of food products", sector: "Food Processing", active: true },
  { name: "Grocery / Kirana Store", slug: "grocery-kirana-store", description: "Local store selling groceries and daily-use products", sector: "Retail", active: true },
  { name: "Vegetable & Fruit Shop", slug: "vegetable-fruit-shop", description: "Retail sale of fresh vegetables and fruits", sector: "Retail", active: true },
  { name: "Agri-Input Store", slug: "agri-input-store", description: "Sale of agricultural inputs and farming supplies", sector: "Retail", active: true },
  { name: "Clothing Store", slug: "clothing-store", description: "Retail clothing and garments business", sector: "Retail", active: true },
  { name: "Hardware & Building Material Store", slug: "hardware-building-material-store", description: "Sale of hardware, tools and construction materials", sector: "Retail", active: true },
  { name: "Tailoring & Stitching", slug: "tailoring-stitching", description: "Tailoring, stitching and clothing alteration services", sector: "Textile", active: true },
  { name: "Handloom & Weaving", slug: "handloom-weaving", description: "Production of handloom and woven textile products", sector: "Textile", active: true },
  { name: "Handicrafts", slug: "handicrafts", description: "Production and sale of handmade craft products", sector: "Handicrafts", active: true },
  { name: "Pottery & Terracotta", slug: "pottery-terracotta", description: "Production of pottery and terracotta products", sector: "Handicrafts", active: true },
  { name: "Bamboo / Cane Products", slug: "bamboo-cane-products", description: "Production of bamboo and cane-based products", sector: "Handicrafts", active: true },
  { name: "Mobile Repair Shop", slug: "mobile-repair-shop", description: "Mobile phone repair and related services", sector: "Repair & Services", active: true },
  { name: "Two-Wheeler Repair", slug: "two-wheeler-repair", description: "Repair and maintenance of motorcycles and scooters", sector: "Repair & Services", active: true },
  { name: "Tractor & Farm Machinery Repair", slug: "tractor-farm-machinery-repair", description: "Repair and maintenance of tractors and agricultural machinery", sector: "Repair & Services", active: true },
  { name: "Electrical & Electronics Repair", slug: "electrical-electronics-repair", description: "Repair of electrical and electronic appliances", sector: "Repair & Services", active: true },
  { name: "Carpentry & Furniture", slug: "carpentry-furniture", description: "Furniture making and carpentry services", sector: "Manufacturing", active: true },
  { name: "Welding & Metal Fabrication", slug: "welding-metal-fabrication", description: "Metal welding, fabrication and related services", sector: "Manufacturing", active: true },
  { name: "Beauty Parlour / Salon", slug: "beauty-parlour-salon", description: "Beauty, grooming and personal care services", sector: "Personal Services", active: true },
  { name: "Laundry & Dry Cleaning", slug: "laundry-dry-cleaning", description: "Laundry, washing and garment care services", sector: "Personal Services", active: true },
  { name: "Photography & Videography", slug: "photography-videography", description: "Photography and videography services for local events", sector: "Services", active: true },
  { name: "Printing & Photocopy Center", slug: "printing-photocopy-center", description: "Printing, photocopying and document services", sector: "Digital Services", active: true },
  { name: "Digital Service / CSC Center", slug: "digital-service-csc-center", description: "Local digital and citizen service center", sector: "Digital Services", active: true },
  { name: "Tuition / Skill Training Center", slug: "tuition-skill-training-center", description: "Local tuition and skill development services", sector: "Education", active: true },
  { name: "Restaurant / Dhaba / Food Stall", slug: "restaurant-dhaba-food-stall", description: "Small local food service business", sector: "Food & Hospitality", active: true },
  { name: "Solar Installation & Services", slug: "solar-installation-services", description: "Solar equipment installation and maintenance services", sector: "Renewable Energy", active: true },
];

// ================================================================
// Expanded Core Schemes (14 Comprehensive Schemes)
// ================================================================
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

// ================================================================
// Main Reference Data Seed Runner (No sample users or assessments)
// ================================================================
async function seedDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not set in .env — cannot seed.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected.\n");

    // Clean up sample data if present from previous test runs
    await User.deleteMany({ email: { $in: ["ramesh@example.com", "sunita@example.com", "admin@rivo.dev"] } });
    await Assessment.deleteMany({});
    await MarketAnalysis.deleteMany({});
    await Report.deleteMany({});
    console.log("Cleaned up sample user/assessment data.\n");

    // === 1. Business Categories ===
    console.log("Seeding business categories...");
    for (const cat of categories) {
      await BusinessCategory.updateOne(
        { slug: cat.slug },
        { $set: cat },
        { upsert: true }
      );
    }
    console.log(`  ✓ ${categories.length} business categories\n`);

    // === 2. Schemes ===
    console.log("Seeding schemes...");
    for (const scheme of schemes) {
      await Scheme.findOneAndUpdate(
        { name: scheme.name },
        scheme,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`  ✓ ${schemes.length} schemes\n`);

    // === 3. Locations ===
    console.log("Seeding locations...");
    for (const loc of locations) {
      await Location.updateOne(
        { _id: loc._id },
        { $set: loc },
        { upsert: true }
      );
    }
    console.log(`  ✓ ${locations.length} locations\n`);

    console.log("============================================");
    console.log("  RIVO Reference Database Seeded!");
    console.log("  (Categories, Schemes & Locations only)");
    console.log("============================================");
    console.log();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

seedDatabase();
