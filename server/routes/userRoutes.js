import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createOrUpdateProfile,
  getProfile
} from "../controllers/profileController.js";
import { createAppointment, getAllDoctors, getAvailableSlots, getUserAppointmentHistory, getUserAppointments } from "../controllers/appointmentController.js";

const userRoutes = express.Router();

// GET Profile
userRoutes.get("/profile", protect, getProfile);
userRoutes.post("/profile", protect, createOrUpdateProfile);


userRoutes.get("/get-doctors", protect, getAllDoctors);
userRoutes.get("/doctor/:doctorId/available-slots", protect, getAvailableSlots);
userRoutes.post("/appointment", protect, createAppointment);
userRoutes.get("/my-appointment", protect, getUserAppointments);
userRoutes.get("/appointments/history", protect, getUserAppointmentHistory);


export default userRoutes;