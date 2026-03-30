import User from "../../models/User.js";
import UserSetting from "../../models/UserSetting.js";

export const getcontext = async (req, res) => {

    try {

        const userId = req.user.id;
        const [user, settings] = await Promise.all([

            User.findById(userId)
                .select("_id location")
                .lean(),
            UserSetting.findOne({ user: userId })
                .lean()
        ]);


        res.json({

            _id: userId,

            location: user?.location || {

                city: null,
                latitude: null,
                longitude: null

            },

            theme: settings?.appearance?.theme || "system",
            language: settings?.appearance?.language || "en",

            timezone: settings?.appearance?.timezone || "Asia/Kolkata"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
             error: error.message,
            message: "Failed to fetch settings"

        });
    }

};