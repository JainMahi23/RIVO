import { Router } from "express";
import { getMarketPlaceholder } from "../controllers/marketController.js";

const router = Router();

// GET /api/market
router.get("/", getMarketPlaceholder);

export default router;
