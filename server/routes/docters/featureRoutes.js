import express from "express";
import { authorizeRoles, protect } from "../../middleware/authMiddleware.js";
import { createDoctorProfile, getDoctorProfile, toggleDoctorBooking, updateDoctorProfile, uploadProfileImage } from "../../controllers/docter/doctorProfileController.js";
import { getDoctorContext } from "../../controllers/docter/contextController.js";
import upload from "../../middleware/uploadMiddleware.js";
import uploadDoctorDocuments from "../../middleware/uplodedocterdoc.js";


const featureRoutes = express.Router();

featureRoutes.get("/context", protect, authorizeRoles("doctor"), getDoctorContext);

featureRoutes.get("/profile", protect, authorizeRoles("doctor"), getDoctorProfile);
featureRoutes.post("/profile/create", protect, authorizeRoles("doctor"),
    uploadDoctorDocuments.fields([
        { name: "medical_license", maxCount: 1 },
        { name: "degree_certificate", maxCount: 5 },
        { name: "id_proof", maxCount: 1 },
        { name: "experience_certificate", maxCount: 5 },
        { name: "other", maxCount: 10 }
    ]), createDoctorProfile);

featureRoutes.put("/profile/update", protect, authorizeRoles("doctor"),
    uploadDoctorDocuments.fields([
        { name: "medical_license", maxCount: 1 },
        { name: "degree_certificate", maxCount: 5 },
        { name: "id_proof", maxCount: 1 },
        { name: "experience_certificate", maxCount: 5 },
        { name: "other", maxCount: 10 }
    ]), updateDoctorProfile);
    
featureRoutes.put("/profile/uploadimage", protect, authorizeRoles("doctor"), upload.single("image"), uploadProfileImage);
featureRoutes.put("/profile/isBookingEnabled", protect, authorizeRoles("doctor"), toggleDoctorBooking);

export default featureRoutes;