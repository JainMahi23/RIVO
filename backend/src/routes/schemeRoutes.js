import { Router } from "express";
import { getSchemePlaceholder } from "../controllers/schemeController.js";

const router = Router();

// GET /api/scheme
router.get("/", getSchemePlaceholder);

export default router;
