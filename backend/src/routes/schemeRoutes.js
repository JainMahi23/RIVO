import { Router } from "express";
import {
  getSchemes,
  getSchemeById,
} from "../controllers/schemeController.js";
import { checkSchemeEligibility } from "../controllers/schemeEligibilityController.js";

const router = Router();

router.get("/", getSchemes);
router.get("/:id", getSchemeById);

router.post("/eligible", checkSchemeEligibility);
export default router;