import express from "express";
import { updateCurrentLocation } from "../controllers/locationController.js";
import protect from "../middleware/authMiddleware.js";


const locationRoutes = express.Router();

locationRoutes.put("/", protect, updateCurrentLocation);

export default locationRoutes;