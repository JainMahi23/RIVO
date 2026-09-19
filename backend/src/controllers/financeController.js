import Scheme from "../models/Scheme.js";
import {
  calculateFinancialResult,
} from "../services/finance/index.js";
import { getUserAssessmentById } from "../services/assessment/assessmentService.js";
import { scoreBusiness } from "../services/mlService.js";

export async function calculateFinance(req, res, next) {
  try {
    const {
      projectCost,
      marginCapital,
      schemeId,
    } = req.body;

    if (
      projectCost === undefined ||
      marginCapital === undefined ||
      !schemeId
    ) {
      return res.status(400).json({
        message:
          "Project cost, margin capital and scheme ID are required",
      });
    }

    // Find the scheme selected by the user
    const scheme = await Scheme.findOne({
      _id: schemeId,
      active: true,
    });

    if (!scheme) {
      return res.status(404).json({
        message: "Selected scheme not found",
      });
    }

    const numericProjectCost = Number(projectCost);
    const numericMarginCapital = Number(marginCapital);

    if (
      !Number.isFinite(numericProjectCost) ||
      numericProjectCost < 0
    ) {
      return res.status(400).json({
        message: "Project cost must be a valid number",
      });
    }

    if (
      !Number.isFinite(numericMarginCapital) ||
      numericMarginCapital < 0
    ) {
      return res.status(400).json({
        message: "Margin capital must be a valid number",
      });
    }

    if (numericMarginCapital > numericProjectCost) {
      return res.status(400).json({
        message: "Margin capital cannot exceed project cost",
      });
    }

    const requiredLoan =
      numericProjectCost - numericMarginCapital;

    if (requiredLoan <= 0) {
      return res.status(400).json({
        message:
          "No loan is required because margin capital covers the project cost",
      });
    }

    if (requiredLoan > scheme.maximumLoanAmount) {
      return res.status(400).json({
        message:
          "Required loan exceeds the maximum loan amount of the selected scheme",
        maximumLoanAmount: scheme.maximumLoanAmount,
        requiredLoan,
      });
    }

    // Find the correct slab for the selected scheme
    const slab = scheme.loanSlabs.find(
      (item) =>
        requiredLoan >= item.minLoanAmount &&
        requiredLoan <= item.maxLoanAmount
    );

    if (!slab) {
      return res.status(400).json({
        message:
          "No applicable loan slab found for the required loan amount",
      });
    }

    // Finance engine gets the scheme's actual rules
    const financialResult = calculateFinancialResult({
      projectCost: numericProjectCost,
      marginCapital: numericMarginCapital,
      interestRate: slab.interestRate,
      tenureYears: slab.tenureYears,
    });

    res.json({
      scheme: {
        id: scheme._id,
        name: scheme.name,
        code: scheme.code,
      },

      financialResult: {
        ...financialResult,
        requiredLoan,
        maximumLoanAmount: scheme.maximumLoanAmount,
        interestRate: slab.interestRate,
        tenureYears: slab.tenureYears,
        moratoriumMonths: slab.moratoriumMonths,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getFeasibilityReport(req, res, next) {
  try {
    const assessment = await getUserAssessmentById(req.user._id, req.params.assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    // Prepare payload for ML service
    const businessCode = assessment.businessCategory?.slug || "kirana"; // Fallback

    const userProfile = {
      capital: assessment.financialInput?.marginCapital || 0,
      resources: [],
      skills: assessment.businessInfo?.experience ? [assessment.businessInfo.experience] : [],
      experience: assessment.businessInfo?.experience ? [assessment.businessInfo.experience] : [],
      location: {
        latitude: assessment.location?.coordinates?.lat || 32.1109,
        longitude: assessment.location?.coordinates?.lng || 76.5363,
      },
    };

    const marketData = {
      population: assessment.location?.population || 10000,
    };

    const competitionData = {
      competitor_count_5km: 3,
    };

    // Call Python ML service
    const mlResponse = await scoreBusiness({
      business: businessCode,
      user_profile: userProfile,
      market_data: marketData,
      competition_data: competitionData,
    });

    const mlResult = mlResponse.result;

    // Transform ML response to frontend format
    const comps = mlResult.components || {};
    const marketScore = Math.round(((comps.demand || 0) + (comps.competition_advantage || 0) + (comps.accessibility || 0)) / 3) || 75;
    const financialScore = Math.round(((comps.resource_fit || 0) + (comps.capital_fit || 0) + (comps.skill_fit || 0)) / 3) || 75;
    
    let confidence = 0.8;
    if (mlResult.confidence === 'HIGH') confidence = 0.95;
    if (mlResult.confidence === 'LOW') confidence = 0.6;

    // Generate SWOT based on ML components
    const swot = { strengths: [], weaknesses: [], opportunities: [], threats: [] };
    
    if ((comps.demand || 0) >= 80) swot.strengths.push("High population catchment density and strong demand");
    else swot.weaknesses.push("Limited local market demand");
    
    if ((comps.competition_advantage || 0) >= 75) swot.strengths.push("Low competition saturation for this category");
    else swot.threats.push("High competitor density nearby");
    
    if ((comps.capital_fit || 0) >= 80) swot.strengths.push("Sufficient margin capital for project setup");
    else swot.weaknesses.push("Capital constraints might limit operational buffer");
    
    if (mlResult.opportunity_level === "HIGH") swot.opportunities.push("Excellent overall market opportunity");
    else if (mlResult.opportunity_level === "MEDIUM") swot.opportunities.push("Moderate market potential");

    res.json({
      report: {
        overallScore: mlResult.score || 80,
        financialScore,
        marketScore,
        modelConfidence: confidence,
        swot,
        recommendations: mlResult.warnings && mlResult.warnings.length > 0 
          ? mlResult.warnings.map(w => w.replace(';', '.'))
          : [
            "Maintain at least 45 days of working capital buffer.",
            "Apply for government loan subsidy.",
            "Monitor seasonal variations in demand."
          ],
      },
    });
  } catch (error) {
    next(error);
  }
}