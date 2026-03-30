import express from "express";

import { cancelAppointmentByUser, createAppointment, getAllDoctors, getAvailableSlots, getDoctorDetails, getUserAppointmentDetails, getUserAppointmentHistory, getUserAppointments } from "../../../controllers/user/appointmentController.js";


const appoinmentRoutes = express.Router();




appoinmentRoutes.get("/get-doctors", getAllDoctors);
appoinmentRoutes.get("/get-doctors/:id", getDoctorDetails);
appoinmentRoutes.get("/doctor/:doctorId/available-slots", getAvailableSlots);
appoinmentRoutes.post("/create-appointment", createAppointment);
appoinmentRoutes.get("/my-appointment", getUserAppointments);
appoinmentRoutes.get("/history", getUserAppointmentHistory);
appoinmentRoutes.get("/appointment/:id", getUserAppointmentDetails);
appoinmentRoutes.put("/cancelappointment", cancelAppointmentByUser);

export default appoinmentRoutes;
