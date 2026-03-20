import express from "express";
import { protect } from "../../middleware/authMiddleware.js";


import { createOrUpdateProfile, getProfile } from "../../controllers/user/profileController.js";
import { updateCurrentLocation } from "../../controllers/user/locationcontroller.js";


const featuresRoutes = express.Router();

// routes 

// profile routes
featuresRoutes.get("/profile", protect, getProfile);
featuresRoutes.post("/profile", protect, createOrUpdateProfile);


// location update route
featuresRoutes.put("/location", protect, updateCurrentLocation);

export default featuresRoutes;