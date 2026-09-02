import { Router } from "express";
import { getFinancePlaceholder } from "../controllers/financeController.js";

const router = Router();

// GET /api/finance
router.get("/", getFinancePlaceholder);

export default router;
