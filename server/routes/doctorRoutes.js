import express from "express";
import { createOrUpdateDoctorProfile, getDoctorProfile } from "../controllers/doctorProfileController.js";
import {
  getDoctorAppointments,
  updateAppointmentStatus
} from "../controllers/appointmentController.js";
import protect  from "../middleware/authMiddleware.js";

import { doctorOnly } from "../middleware/doctorMiddleware.js";

const router = express.Router();

router.post("/profile", protect, doctorOnly, createOrUpdateDoctorProfile);
router.get("/profile", protect, doctorOnly, getDoctorProfile);



// Doctor views appointments
router.get("/myappointment", protect, doctorOnly, getDoctorAppointments);

// Doctor updates status
router.put("/appointment/:appointmentId", protect, doctorOnly, updateAppointmentStatus);

export default router;