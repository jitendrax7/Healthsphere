import express from "express";
import { getHospitalStatus } from "../../controllers/hospital/hospitalprofile.controller.js";
import { requestHospitalVerification } from "../../controllers/hospital/approvalrequestController.js";
import profileRoutes from "./profileRoutes.js";



const coreRoutes = express.Router();

coreRoutes.get('/status', getHospitalStatus);
coreRoutes.use('/profile', profileRoutes);

coreRoutes.post('/createapproval', requestHospitalVerification);

export default coreRoutes;