import express from "express";
import { createHealthcareCamp, getHospitalCampDetails, getHospitalCamps, updateCampStatus, updateHealthcareCamp } from "../../../controllers/hospital/HealthcareCamp.Controller.js";
import upload from "../../../middleware/uploadMiddleware.js";




const campRoutes = express.Router();

campRoutes.post('/create', upload.single('poster'), createHealthcareCamp);
campRoutes.get('/camps', getHospitalCamps);
campRoutes.get('/camps/:campId', getHospitalCampDetails);
campRoutes.put('/camps/:campId', upload.single('poster'), updateHealthcareCamp);
campRoutes.put('/camps/:campId/status', updateCampStatus);

export default campRoutes;