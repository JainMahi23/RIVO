import { Router } from "express";

import {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  submitAssessment,
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

// DELETE /api/assessments/:id
router.delete("/:id", protect, deleteAssessment);

// POST /api/assessments/:id/submit
router.post("/:id/submit", protect, submitAssessment);

export default router;