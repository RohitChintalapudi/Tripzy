import express from "express";
import { bookFlight } from "../controllers/bookingController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getMyBookings } from "../controllers/bookingController.js";
import { cancelBooking } from "../controllers/bookingController.js";


const router = express.Router();

router.post("/", protect, bookFlight);
router.get("/my", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelBooking);

export default router;
