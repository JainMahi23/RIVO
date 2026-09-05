import Location from "../models/Location.js";
import MarketAnalysis from "../models/MarketAnalysis.js";
import { generateMarketAnalysis } from "../services/market/index.js";

export async function analyzeMarket(req, res, next) {
  try {
    const { assessmentId, locationId } = req.body;

    if (!assessmentId || !locationId) {
      return res.status(400).json({
        success: false,
        message: "assessmentId and locationId are required",
      });
    }

    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: "Location not found",
      });
    }

    const analysis = await generateMarketAnalysis({
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
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

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
}
