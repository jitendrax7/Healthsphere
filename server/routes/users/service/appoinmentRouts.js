import express from "express";
import { protect } from "../../../middleware/authMiddleware.js";

import { createAppointment, getAllDoctors, getAvailableSlots, getUserAppointmentHistory, getUserAppointments } from "../../../controllers/user/appointmentController.js";


const userRoutes = express.Router();




userRoutes.get("/get-doctors", protect, getAllDoctors);
userRoutes.get("/doctor/:doctorId/available-slots", protect, getAvailableSlots);
userRoutes.post("/create-appointment", protect, createAppointment);
userRoutes.get("/my-appointment", protect, getUserAppointments);
userRoutes.get("/appointments/history", protect, getUserAppointmentHistory);


export default userRoutes;