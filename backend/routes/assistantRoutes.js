import { Router } from "express";
import { chatAssistant } from "../controllers/assistantController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/chat", protect, chatAssistant);

export default router;