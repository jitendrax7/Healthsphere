import express from "express";
import { getCampDetails, getPublicCamps, registerForCamp } from "../../../controllers/user/campController.js";



const campRoutes = express.Router();


campRoutes.get('/',              getPublicCamps);
campRoutes.get('/:campId',       getCampDetails);
campRoutes.post('/:campId/register', registerForCamp);


export default campRoutes;