import express from "express";
import {
  createFlight,
  getFlights,
  searchFlights,
  getFlightById,
  updateFlight,
  deleteFlight,
} from "../controllers/flightController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getFlights);
router.get("/search", searchFlights);
router.get("/:id", getFlightById);

// Admin routes
router.post("/", protect, adminOnly, createFlight);
router.put("/:id", protect, adminOnly, updateFlight);
router.delete("/:id", protect, adminOnly, deleteFlight);

export default router;
