import { Router } from "express";
import {
  generateReport,
  getReportByAssessment,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// POST /api/reports/generate/:assessmentId
router.post("/generate/:assessmentId", protect, generateReport);

// GET /api/reports/assessment/:assessmentId
router.get("/assessment/:assessmentId", protect, getReportByAssessment);

export default router;
