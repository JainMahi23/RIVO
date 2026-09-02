import { Router } from "express";
import { getAuthPlaceholder } from "../controllers/authController.js";

const router = Router();

// GET /api/auth
router.get("/", getAuthPlaceholder);

export default router;
