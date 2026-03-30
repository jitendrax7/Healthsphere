import express from "express";
import featureRoutes from "./featureRoutes.js";
import appointmentRoutes from "./service/appoinmentRouts.js";
import { authorizeRoles, protect } from "../../middleware/authMiddleware.js";



const docterRoutes = express.Router();

// features 
docterRoutes.use("/", protect, authorizeRoles("doctor"), featureRoutes);


// service routes
docterRoutes.use("/service/appointment", protect, authorizeRoles("doctor") , appointmentRoutes);

export default docterRoutes;