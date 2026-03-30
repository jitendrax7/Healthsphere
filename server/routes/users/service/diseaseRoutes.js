import express from "express";
import { getDiabetesData, getHeartData, getUserPredictionHistory, predictDiabetes, predictHeart } from "../../../controllers/user/diseaseController.js";

const diseaseRoutes = express.Router();

// Diabetes
diseaseRoutes.get("/diabetes-data", getDiabetesData);
diseaseRoutes.post("/diabetes-predict", predictDiabetes);

// Heart
diseaseRoutes.get("/heart-data", getHeartData);
diseaseRoutes.post("/heart-predict", predictHeart);

//history of pridiction 
diseaseRoutes.get("/history", getUserPredictionHistory);

export default diseaseRoutes;