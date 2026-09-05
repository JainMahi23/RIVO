import express from "express";

import {
  analyzeMarket,
  getMarketAnalysis,
} from "../controllers/marketController.js";

const router = express.Router();

router.post("/analyze", analyzeMarket);

router.get(
  "/assessment/:assessmentId",
  getMarketAnalysis
);

export default router;