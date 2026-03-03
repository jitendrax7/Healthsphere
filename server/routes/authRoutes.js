import express from "express";
import { registerUser, loginUser, verifyEmail, getUserStatus } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);

router.get("/me", protect, getUserStatus);

export default router;





