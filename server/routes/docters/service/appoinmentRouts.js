import express from "express";
import { authorizeRoles, protect } from "../../../middleware/authMiddleware";
import { getDoctorAppointments, updateAppointmentStatus } from "../../../controllers/docter/appointmentController";


const appointmentRoutes = express.Router();


// Doctor views appointments
appointmentRoutes.get("/myappointment", protect, authorizeRoles("doctor"), getDoctorAppointments);

// Doctor updates status
appointmentRoutes.put("/appointment/:appointmentId", protect, authorizeRoles("doctor"), updateAppointmentStatus);


export default appointmentRoutes;