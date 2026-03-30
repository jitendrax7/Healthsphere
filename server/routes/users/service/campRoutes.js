import express from "express";
import { getCampDetails, getPublicCamps } from "../../../controllers/user/campController.js";



const campRoutes = express.Router();


campRoutes.get('/', getPublicCamps);
campRoutes.get('/:campId', getCampDetails);


export default campRoutes;