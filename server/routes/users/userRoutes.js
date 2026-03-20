import express from "express";
import protect from "../middleware/authMiddleware.js";
import appointmentRoutes from "./service/appoinmentRouts.js";
import diseaseRoutes from "./service/diseaseRoutes.js";
import chatbotRoutes from "./service/chatbotRoutes.js";
import featuresRoutes from "./featureRoutes.js";

const userRoutes = express.Router();

// basic user features 
userRoutes.use("/", protect, featuresRoutes);

// connect /service/name routes

userRoutes.use("/service/appointment", appointmentRoutes);
userRoutes.use("/service/disease", diseaseRoutes);
userRoutes.use("/service/chatbot", chatbotRoutes);


export default userRoutes;