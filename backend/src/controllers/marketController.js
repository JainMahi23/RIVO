import Location from "../models/Location.js";
import Assessment from "../models/Assessment.js";
import MarketAnalysis from "../models/MarketAnalysis.js";
import { generateMarketAnalysis } from "../services/market/index.js";

/**
 * POST /api/market/analyze
 */
export async function analyzeMarket(req, res, next) {
  try {
    const { assessmentId, locationId } = req.body;

    if (!assessmentId || !locationId) {
      return res.status(400).json({
        success: false,
        message: "assessmentId and locationId are required",
      });
    }

    // Verify the assessment belongs to the requesting user
    if (req.user) {
      const assessment = await Assessment.findOne({
        _id: assessmentId,
        user: req.user._id,
      });
      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: "Assessment not found or not owned by you",
        });
      }
    }

    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    // Fix: use the correct coordinate field names from Location model
    const latitude = location.coordinates?.lat ?? null;
    const longitude = location.coordinates?.lng ?? null;

    const analysis = await generateMarketAnalysis({
      latitude,
      longitude,
      population: location.population || 0,
      households: location.households || 0,
      radiusKm: 5,
    });

    analysis.assessmentId = assessmentId;
    analysis.locationId = locationId;

    const savedAnalysis = await MarketAnalysis.create(analysis);

    res.status(201).json({
      success: true,
      message: "Market analysis generated successfully",
      data: savedAnalysis,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/market/assessment/:assessmentId
 */
export async function getMarketAnalysis(req, res, next) {
  try {
    const { assessmentId } = req.params;

    const analysis = await MarketAnalysis.findOne({
      assessmentId,
    }).sort({ createdAt: -1 });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Market analysis not found",
      });
    }

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLocationSummary(req, res) {
  res.json({
    summary: {
      description: "Semi-urban commercial cluster with high footfall during morning & evening hours.",
      population: 20800,
      radiusKm: 3,
      nearbyBusinessCount: 12,
      avgHouseholdSize: 4.6,
      nearbyBusinesses: [
        { name: "Palampur Farmers Co-op", type: "Agriculture", distanceKm: 0.4 },
        { name: "Gupta General Merchant", type: "Kirana", distanceKm: 0.8 },
        { name: "Shiva Machinery Store", type: "Hardware", distanceKm: 1.2 },
      ],
    },
  });
}

export async function getDemandScore(req, res) {
  res.json({
    series: [
      { label: "Mon", value: 65 },
      { label: "Tue", value: 85 },
      { label: "Wed", value: 75 },
      { label: "Thu", value: 110 },
      { label: "Fri", value: 95 },
      { label: "Sat", value: 140 },
      { label: "Sun", value: 160 },
    ],
  });
}

export async function getCompetitorDensity(req, res) {
  res.json({
    competitors: [
      { name: "General Kirana Stores", count: 5, risk: "Medium" },
      { name: "Agro-Inputs & Seeds", count: 2, risk: "Low" },
      { name: "Hardware & Tools", count: 3, risk: "Low" },
      { name: "Garments & Tailoring", count: 2, risk: "Low" },
    ],
  });
}

export async function getNearbyBusinessTypes(req, res) {
  res.json({
    businessTypes: [
      "Kirana & Agro-Store",
      "Cold-Press Oil Unit",
      "Solar Service Hub",
      "Dairy Collection Point",
    ],
  });
}
