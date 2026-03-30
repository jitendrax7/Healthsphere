import express from "express";


import { createOrUpdateProfile, getProfile } from "../../controllers/user/profileController.js";
import settingsRoutes from "./settingsRoutes.js";
import { getcontext } from "../../controllers/user/contextController.js";
import { authorizeRoles, protect } from "../../middleware/authMiddleware.js";
import { googleCallback } from "../../controllers/user/googleCalendar.controller.js";


const coreRoutes = express.Router();

// routes 
coreRoutes.get("/context",protect,authorizeRoles("user"), getcontext);
// profile routes
coreRoutes.get("/profile",protect,authorizeRoles("user"), getProfile);
coreRoutes.post("/profile",protect,authorizeRoles("user"), createOrUpdateProfile);


coreRoutes.get( "/settings/google/callback", googleCallback );
coreRoutes.use("/settings",protect,authorizeRoles("user"), settingsRoutes);


export default coreRoutes;   