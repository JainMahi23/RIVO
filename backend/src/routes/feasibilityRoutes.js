import { Router } from "express";
import { getFeasibilityPlaceholder } from "../controllers/feasibilityController.js";

const router = Router();

// GET /api/feasibility
router.get("/", getFeasibilityPlaceholder);

export default router;
