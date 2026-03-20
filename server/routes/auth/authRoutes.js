import express from "express";
import { registerUser, loginUser, verifyEmail, getUserStatus } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/verify-email", verifyEmail);

authRoutes.get("/me", protect, getUserStatus);

export default authRoutes;





