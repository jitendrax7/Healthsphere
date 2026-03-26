import User from "../../models/User.js";
import UserSetting from "../../models/userSetting.js";

export const getcontext = async (req, res) => {

    try {

        const userId = req.user.id;
        

        /* Fetch data */

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

            timezone: settings?.appearance?.timezone || "Asia/Kolkata",

            notificationCount: 5   // dummy

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to fetch settings"

        });

    }

};