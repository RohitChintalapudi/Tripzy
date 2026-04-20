import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

router.put("/profile", protect, async (req, res) => {
  try {
    const phone = String(req.body?.phone || "").trim();
    const city = String(req.body?.city || "").trim();

    if (phone.length > 20) {
      return res.status(400).json({ message: "Phone number must be at most 20 characters" });
    }
    if (city.length > 80) {
      return res.status(400).json({ message: "City must be at most 80 characters" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { phone, city },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Unable to update profile" });
  }
});

export default router;
