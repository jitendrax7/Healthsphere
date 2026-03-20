import express from "express";
import { authorizeRoles, protect } from "../../middleware/authMiddleware";
import { createOrUpdateDoctorProfile, getDoctorProfile } from "../../controllers/docter/doctorProfileController";


const featureRoutes = express.Router();


featureRoutes.post("/profile", protect, authorizeRoles("doctor"), createOrUpdateDoctorProfile);
featureRoutes.get("/profile", protect, authorizeRoles("doctor"), getDoctorProfile);

export default featureRoutes;