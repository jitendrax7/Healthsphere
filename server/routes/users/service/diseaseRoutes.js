import express from "express";
import { protect } from "../../../middleware/authMiddleware";
import { getDiabetesData, getHeartData, getUserPredictionHistory, predictDiabetes, predictHeart } from "../../../controllers/user/diseaseController";

const diseaseRoutes = express.Router();

// Diabetes
diseaseRoutes.get("/diabetes-data", protect, getDiabetesData);
diseaseRoutes.post("/diabetes-predict", protect, predictDiabetes);

// Heart
diseaseRoutes.get("/heart-data", protect, getHeartData);
diseaseRoutes.post("/heart-predict", protect, predictHeart);

//history of pridiction 
diseaseRoutes.get("/history", protect, getUserPredictionHistory);

export default diseaseRoutes;