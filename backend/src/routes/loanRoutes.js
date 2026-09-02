import { Router } from "express";
import { getLoanPlaceholder } from "../controllers/loanController.js";

const router = Router();

// GET /api/loan
router.get("/", getLoanPlaceholder);

export default router;
