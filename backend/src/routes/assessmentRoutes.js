import { Router } from "express";
import { getAssessmentPlaceholder } from "../controllers/assessmentController.js";

const router = Router();

// GET /api/assessment
router.get("/", getAssessmentPlaceholder);

export default router;
