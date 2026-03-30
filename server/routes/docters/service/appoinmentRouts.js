import express from "express";
import { getDoctorAnalytics, getDoctorAppointmentDetails, getDoctorAppointmentHistory, getDoctorAppointments, updateAppointmentStatus } from "../../../controllers/docter/appointmentController.js";


const appointmentRoutes = express.Router();



appointmentRoutes.get("/getAnalytics", getDoctorAnalytics);
appointmentRoutes.get("/myappointments",  getDoctorAppointments);
appointmentRoutes.get("/myappointments/:appointmentId",  getDoctorAppointmentDetails);
appointmentRoutes.get("/History",  getDoctorAppointmentHistory);
appointmentRoutes.get("/History/:appointmentId",  getDoctorAppointmentDetails);


appointmentRoutes.put("/stuatus/:appointmentId", updateAppointmentStatus);


export default appointmentRoutes;  