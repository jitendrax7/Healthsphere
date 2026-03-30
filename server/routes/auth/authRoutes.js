import express from "express";
import { getUserStatus, loginUser, registerUser, verifyEmail } from "../../controllers/auth/authController.js";
import { protect } from "../../middleware/authMiddleware.js";
import { updateCurrentLocation } from "../../controllers/auth/locationcontroller.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/verify-email", verifyEmail);

authRoutes.get("/status", protect, getUserStatus);
authRoutes.put("/location", protect, updateCurrentLocation);

export default authRoutes;





