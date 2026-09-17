import express from "express";

import {
  analyzeMarket,
  getMarketAnalysis,
  getLocationSummary,
  getDemandScore,
  getCompetitorDensity,
  getNearbyBusinessTypes,
} from "../controllers/marketController.js";

const router = express.Router();

router.post("/analyze", analyzeMarket);
router.get("/assessment/:assessmentId", getMarketAnalysis);

router.get("/:assessmentId/location", getLocationSummary);
router.get("/:assessmentId/demand", getDemandScore);
router.get("/:assessmentId/competitors", getCompetitorDensity);
router.get("/:assessmentId/business-types", getNearbyBusinessTypes);

export default router;