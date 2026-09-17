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
