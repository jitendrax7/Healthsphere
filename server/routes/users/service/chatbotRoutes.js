import express from "express";
import { chatWithAI } from "../../../controllers/user/chatController.js";

const chatbotRoutes = express.Router();

chatbotRoutes.post("/chat", chatWithAI);

export default chatbotRoutes;