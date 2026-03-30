import express from "express";
import coreRoutes from "./coreRoutes.js";
import { protect } from "../../middleware/authMiddleware.js";
import campRoutes from "./services/campRoutes.js";



const hospitalRoutes = express.Router();

hospitalRoutes.use('/', protect, coreRoutes);

hospitalRoutes.use('/camp' , protect, campRoutes );

export default hospitalRoutes;