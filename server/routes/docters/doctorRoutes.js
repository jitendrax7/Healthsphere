import express from "express";
import featureRoutes from "./featureRoutes";
import appointmentRoutes from "./service/appoinmentRouts";



const docterRoutes = express.Router();

// features 
docterRoutes.use("/", featureRoutes);


// service routes
docterRoutes.use("/service/appointment", appointmentRoutes);

export default docterRoutes;