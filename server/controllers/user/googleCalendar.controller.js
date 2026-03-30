
import { getGoogleAuthURL, saveGoogleTokens,disconnectGoogle} from "../../services/user/googleCalendar.service.js";
import { oauth2Client } from "../../config/googleOAuth.js";

export const connectGoogle = async (req, res) => {
        try {
            const url =  getGoogleAuthURL(req.user._id);
            res.json({
               success: true,
                url
            });
        }
        catch (error) {
            console.error("Google Connect Error:", error);
            res.status(500).json({
                message: error.message
            });
        }
    };


export const googleCallback = async (req, res) => {
        try {
            const code = req.query.code;
            const { tokens } = await oauth2Client.getToken(code);
            const userId = req.query.state;


            await saveGoogleTokens(
                userId,
                tokens
            );

            res.redirect(
                "https://healthsphere-jit.vercel.app/user/settings?tab=notifications#integrations"
            );
        }  
        catch (error) {
            console.error("Google Callback Error:", error);
            res.status(500).json({
                message: error.message
            });
        }
    };


export const disconnectGoogleCalendar = async (req, res) => {
        try {

            await disconnectGoogle(
                req.user._id
            );

            res.json({
                success: true,
                message: "Google disconnected"
            });
        }
        catch (error) {
            console.error("Google Disconnect Error:", error);
            res.status(500).json({
                message: error.message
            });
        }
    };