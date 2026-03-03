import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getDiabetesData,
  predictDiabetes,
  getHeartData,
  predictHeart,
  getUserPredictionHistory
} from "../controllers/diseaseController.js";

const router = express.Router();

// Diabetes
router.get("/diabetes-data", protect, getDiabetesData);
router.post("/diabetes-predict", protect, predictDiabetes);

// Heart
router.get("/heart-data", protect, getHeartData);
router.post("/heart-predict", protect, predictHeart);

//history of pridiction 

router.get("/history", protect, getUserPredictionHistory);

export default router;