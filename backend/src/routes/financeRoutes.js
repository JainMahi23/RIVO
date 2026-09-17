import { Router } from "express";

import { calculateFinance, getFeasibilityReport } from "../controllers/financeController.js";

const router = Router();

router.post("/calculate", calculateFinance);
router.post("/:assessmentId/calculate", calculateFinance);
router.get("/:assessmentId/feasibility", getFeasibilityReport);

export default router;