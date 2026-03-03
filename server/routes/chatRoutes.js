import express from "express";
import { chatWithAI } from "../controllers/chatController.js";

const chatRoutes = express.Router();

chatRoutes.post("/chat", chatWithAI);

export default chatRoutes;