import express from "express";
import { createHospitalProfile, uploadHospitalDocument } from "../../controllers/hospital/hospitalprofile.controller.js";
import uploadDocument from "../../middleware/uploaddocMiddleware.js";



const profileRoutes = express.Router();

profileRoutes.post('/create', createHospitalProfile);
profileRoutes.post('/documents/upload',uploadDocument.single("document"), uploadHospitalDocument );


export default profileRoutes;