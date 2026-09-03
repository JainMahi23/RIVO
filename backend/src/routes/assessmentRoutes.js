import { Router } from "express";

import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
} from "../controllers/assessmentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// POST /api/assessments
router.post("/", protect, createAssessment);

// GET /api/assessments
router.get("/", protect, getAssessments);

// GET /api/assessments/:id
router.get("/:id", protect, getAssessmentById);

// PUT /api/assessments/:id
router.put("/:id", protect, updateAssessment);

export default router;