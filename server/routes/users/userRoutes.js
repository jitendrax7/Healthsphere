import express from "express";
import appointmentRoutes from "./service/appoinmentRouts.js";
import diseaseRoutes from "./service/diseaseRoutes.js";
import chatbotRoutes from "./service/chatbotRoutes.js";
import coreRoutes from "./coreRoutes.js";
import { authorizeRoles, protect } from "../../middleware/authMiddleware.js";
import campRoutes from "./service/campRoutes.js";

const userRoutes = express.Router();

// basic user features 
userRoutes.use("/",  coreRoutes);

// connect /service/name routes

userRoutes.use("/service/appointment", protect, authorizeRoles("user"), appointmentRoutes);
userRoutes.use("/service/disease", protect, authorizeRoles("user"), diseaseRoutes);
userRoutes.use("/service/chatbot", protect, authorizeRoles("user"), chatbotRoutes);
userRoutes.use("/service/camp", protect, authorizeRoles("user"), campRoutes);

export default userRoutes;

