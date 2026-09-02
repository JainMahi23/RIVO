import { Router } from "express";
import { getAiPlaceholder } from "../controllers/aiController.js";

const router = Router();

// GET /api/ai
router.get("/", getAiPlaceholder);

export default router;
