import express from "express";

import {
  createLocation,
  getLocations,
  getLocationById,
} from "../controllers/locationController.js";

const router = express.Router();

router.post("/", createLocation);

router.get("/", getLocations);

router.get("/:id", getLocationById);

export default router;