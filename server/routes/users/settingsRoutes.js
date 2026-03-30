import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { getSettings, updateAppearance, updateGeneral, updateNotification } from "../../controllers/user/settingControler.js";
import { connectGoogle, disconnectGoogleCalendar } from "../../controllers/user/googleCalendar.controller.js";


const settingsRoutes = express.Router();


settingsRoutes.get("/", getSettings);
settingsRoutes.put("/general", updateGeneral);
settingsRoutes.put("/appearance", updateAppearance);
settingsRoutes.put("/notification", updateNotification);


settingsRoutes.get("/google/connect", connectGoogle );
settingsRoutes.post( "/google/disconnect", disconnectGoogleCalendar );

export default settingsRoutes;