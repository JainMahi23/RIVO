import { Router } from "express";
import {
  getBusinessCategories,
} from "../controllers/businessCategoryController.js";

const router = Router();

router.get("/", getBusinessCategories);

export default router;
