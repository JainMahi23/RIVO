import { Router } from "express";

import { calculateFinance } from "../controllers/financeController.js";

const router = Router();

router.post("/calculate", calculateFinance);

export default router;