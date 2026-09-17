import Assessment from "../../models/Assessment.js";
import BusinessCategory from "../../models/BusinessCategory.js";
import Location from "../../models/Location.js";
import MarketAnalysis from "../../models/MarketAnalysis.js";
import Scheme from "../../models/Scheme.js";
import Report from "../../models/Report.js";
import {
  calculateFinancialResult,
} from "../finance/index.js";
import { findEligibleSchemes } from "../scheme/schemeEligibilityService.js";

/**
 * Generate a deterministic SWOT analysis based on collected data.
 */
function generateSWOT({
  marketSummary,
  financialSummary,
  feasibility,
  locationSummary,
}) {
  const strengths = [];
  const weaknesses = [];
  const opportunities = [];
  const threats = [];

  // Market-based
  if (marketSummary.competitionLevel === "LOW") {
    strengths.push("Low competition in the target area");
  }
  if (marketSummary.demandLevel === "HIGH") {
    strengths.push("High population-driven demand in the locality");
  }
  if (marketSummary.opportunityLevel === "HIGH") {
    strengths.push("Strong market opportunity with high demand and low competition");
  }

  if (marketSummary.competitionLevel === "HIGH") {
    threats.push("High number of competitors nearby");
  }
  if (marketSummary.demandLevel === "LOW") {
    weaknesses.push("Low population may limit customer base");
  }

  // Financial-based
  if (feasibility.dscr >= 1.5) {
    strengths.push(`Strong debt coverage ratio (DSCR: ${feasibility.dscr})`);
  } else if (feasibility.dscr < 1.0) {
    weaknesses.push(`Weak debt coverage ratio (DSCR: ${feasibility.dscr})`);
  }

  if (financialSummary.grossMargin >= 35) {
    strengths.push(`Healthy gross margin of ${financialSummary.grossMargin}%`);
  } else if (financialSummary.grossMargin < 25) {
    weaknesses.push(`Low gross margin of ${financialSummary.grossMargin}%`);
  }

  if (financialSummary.netProfit > 0) {
    strengths.push("Projected monthly net profit is positive");
  } else {
    weaknesses.push("Projected monthly net profit is negative after EMI");
  }

  // Location-based opportunities
  if (locationSummary.population >= 10000) {
    opportunities.push("Sizeable local population provides a broad customer base");
  }
  if (locationSummary.households >= 2000) {
    opportunities.push("Significant number of households for household-oriented products/services");
  }

  // General opportunities & threats
  opportunities.push("Government schemes available for rural/semi-urban entrepreneurs");
  opportunities.push("Growing digital connectivity enables online marketing and sales");

  threats.push("Seasonal income variations in rural areas");
  threats.push("Dependence on local economic conditions and weather patterns");

  return { strengths, weaknesses, opportunities, threats };
}

/**
 * Generate recommendations based on feasibility analysis.
 */
function generateRecommendations({ feasibility, marketSummary, financialSummary }) {
  const recommendations = [];

  if (feasibility.verdict === "HIGHLY_FEASIBLE" || feasibility.verdict === "FEASIBLE") {
    recommendations.push("Business appears viable — proceed with detailed planning and scheme application");
  } else if (feasibility.verdict === "MARGINALLY_FEASIBLE") {
    recommendations.push("Consider reducing project cost or increasing own contribution to improve feasibility");
    recommendations.push("Explore additional revenue streams to improve profitability");
  } else {
    recommendations.push("Current financial structure shows high risk — reconsider the investment scale");
    recommendations.push("Reduce loan dependency or find a more cost-effective business category");
  }

  if (marketSummary.competitionLevel === "HIGH") {
    recommendations.push("Differentiate your offering or consider a nearby location with less competition");
  }

  if (financialSummary.netMargin < 15) {
    recommendations.push("Look for ways to reduce operating costs to improve net margin");
  }

  if (feasibility.breakEvenMonths && feasibility.breakEvenMonths > 36) {
    recommendations.push("Break-even period is over 3 years — consider a phased investment approach");
  }

  recommendations.push("Consult with local district industry center (DIC) for additional scheme benefits");

  return recommendations;
}

/**
 * Generate a full structured report for an assessment.
 */
export async function generateReportForAssessment(assessmentId, userId) {
  // 1. Load assessment with populated references
  const assessment = await Assessment.findOne({
    _id: assessmentId,
    user: userId,
  })
    .populate("businessCategory")
    .populate("location");

  if (!assessment) {
    const err = new Error("Assessment not found or not owned by you");
    err.statusCode = 404;
    throw err;
  }

  const category = assessment.businessCategory;
  const location = assessment.location;

  // 2. Get or run market analysis
  let marketAnalysis = await MarketAnalysis.findOne({
    assessmentId,
  }).sort({ createdAt: -1 });

  const marketSummary = marketAnalysis
    ? {
        competitorCount: marketAnalysis.competitorCount,
        competitionLevel: marketAnalysis.competitionLevel,
        demandLevel: marketAnalysis.demandLevel,
        opportunityLevel: marketAnalysis.opportunityLevel,
        marketReach: marketAnalysis.marketReach,
        marketRadiusKm: marketAnalysis.marketRadiusKm,
      }
    : {
        competitorCount: 0,
        competitionLevel: "MEDIUM",
        demandLevel: location?.population >= 30000 ? "HIGH" : location?.population >= 10000 ? "MEDIUM" : "LOW",
        opportunityLevel: "MEDIUM",
        marketReach: Math.round((location?.population || 0) * 0.1),
        marketRadiusKm: 5,
      };

  // 3. Find best scheme
  const marginCapital = assessment.financialInput?.marginCapital || 0;
  const investmentRange = category?.typicalInvestmentRange;
  const projectCost =
    assessment.financialResult?.projectCost ||
    (investmentRange ? (investmentRange.min + investmentRange.max) / 2 : marginCapital * 4);

  let schemeSummary = {
    schemeName: "Not determined",
    schemeCode: "N/A",
    maximumLoanAmount: 0,
    governmentSharePercentage: 0,
    beneficiarySharePercentage: 100,
  };

  let interestRate = 10;
  let tenureYears = 5;

  try {
    const { recommendations: schemeRecs } = await findEligibleSchemes({
      projectCost,
      marginCapital,
    });

    if (schemeRecs.length > 0) {
      const best = schemeRecs[0];
      schemeSummary = {
        schemeName: best.name,
        schemeCode: best.code,
        maximumLoanAmount: best.maximumLoanAmount,
        governmentSharePercentage: best.financing?.governmentSharePercentage || 0,
        beneficiarySharePercentage: best.financing?.beneficiarySharePercentage || 0,
      };
      interestRate = best.interestRate;
      tenureYears = best.tenureYears;
    }
  } catch {
    // If no scheme found, use defaults
  }

  // 4. Run financial calculations
  const financialResult = calculateFinancialResult({
    projectCost,
    marginCapital,
    interestRate,
    tenureYears,
  });

  const financialSummary = {
    projectCost,
    marginCapital,
    loanAmount: financialResult.loanAmount,
    interestRate,
    tenureYears,
    emi: financialResult.emi,
    totalInterest: financialResult.totalInterest,
    totalRepayment: financialResult.totalRepayment,
    monthlyRevenue: financialResult.profitMetrics.monthlyRevenue,
    monthlyExpenses: financialResult.profitMetrics.monthlyExpenses,
    grossProfit: financialResult.profitMetrics.grossProfit,
    netProfit: financialResult.profitMetrics.netProfit,
    grossMargin: financialResult.profitMetrics.grossMargin,
    netMargin: financialResult.profitMetrics.netMargin,
  };

  const feasibility = financialResult.feasibility;

  // 5. Build summaries
  const businessSummary = {
    categoryName: category?.name || "Unknown",
    categorySector: category?.sector || "Unknown",
    businessName: assessment.businessInfo?.businessName || "",
    experience: assessment.businessInfo?.experience || "",
    description: assessment.businessInfo?.description || "",
    personalName: assessment.personalInfo?.name || "",
    personalAge: assessment.personalInfo?.age || null,
    personalPhone: assessment.personalInfo?.phone || "",
  };

  const locationSummary = {
    state: location?.state || "",
    district: location?.district || "",
    subDistrict: location?.subDistrict || "",
    village: location?.village || "",
    pincode: location?.pincode || "",
    population: location?.population || 0,
    households: location?.households || 0,
    coordinates: location?.coordinates || { lat: null, lng: null },
  };

  // 6. Generate SWOT & recommendations
  const swot = generateSWOT({ marketSummary, financialSummary, feasibility, locationSummary });
  const recommendations = generateRecommendations({ feasibility, marketSummary, financialSummary });

  const assumptions = [
    `Monthly revenue estimated at 15% of project cost (₹${projectCost})`,
    "Operating expenses estimated at 65% of monthly revenue",
    `Loan interest rate: ${interestRate}% p.a.`,
    `Loan tenure: ${tenureYears} years`,
    "Market analysis based on OpenStreetMap competitor data within 5 km radius",
    "Population and household data based on available census records",
  ];

  // 7. Save or update report
  const reportData = {
    assessment: assessmentId,
    user: userId,
    businessSummary,
    locationSummary,
    marketSummary,
    financialSummary,
    schemeSummary,
    overallScore: feasibility.score,
    verdict: feasibility.verdict,
    dscr: feasibility.dscr,
    loanToProjectRatio: feasibility.loanToProjectRatio,
    breakEvenMonths: feasibility.breakEvenMonths,
    swot,
    assumptions,
    recommendations,
    factors: feasibility.factors,
    generatedAt: new Date(),
  };

  const report = await Report.findOneAndUpdate(
    { assessment: assessmentId },
    { $set: reportData },
    { upsert: true, new: true }
  );

  return report;
}

/**
 * Get report by assessment ID.
 */
export async function getReportByAssessmentId(assessmentId, userId) {
  return Report.findOne({
    assessment: assessmentId,
    user: userId,
  });
}
