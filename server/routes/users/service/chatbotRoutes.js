import express from "express";
import { chatWithAI } from "../../../controllers/user/chatController";
import { protect } from "../../../middleware/authMiddleware";

const chatbotRoutes = express.Router();

chatbotRoutes.post("/chat", protect, chatWithAI);

export default chatbotRoutes;