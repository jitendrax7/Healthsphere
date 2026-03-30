import UserSetting from "../../models/UserSetting.js";



const isBoolean = (val) => {
    return typeof val === "boolean";
};

const allowedThemes = ["light", "dark", "system" , "health"];


export const getSettings = async (req, res) => {
    try {

        let settings = await UserSetting.findOne({
            user: req.user.id
        }).select("-googleCalendar.accessToken -googleCalendar.refreshToken");

        if (!settings) {
            settings = await UserSetting.create({
                user: req.user.id
            });
        }

        res.json({
            general: {
                language: settings.appearance.language,
                timezone: settings.appearance.timezone
            },
            appearance: {
                theme: settings.appearance.theme
            },
            notifications: settings.notifications,
            googleCalendar: {
                connected: settings.googleCalendar.connected,
                email: settings.googleCalendar.email || null,
                expiry: settings.googleCalendar.tokenExpiry || null
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch settings"
        });
    }
};



export const updateGeneral = async (req, res) => {

    try {
        const { language, timezone } = req.body;

        if (language && typeof language !== "string") {
            return res.status(400).json({
                message: "Language must be string"
            });
        }

        if (timezone && typeof timezone !== "string") {
            return res.status(400).json({
                message: "Timezone must be string"
            });
        }

        let settings = await UserSetting.findOne({
            user: req.user.id
        });

        if (!settings) {
            settings = new UserSetting({
                user: req.user.id
            });
        }

        if (language) {
            settings.appearance.language = language;
        }

        if (timezone) {
            settings.appearance.timezone = timezone;
        }

        await settings.save();

        res.json({
            message: "General settings updated",
            general: {
                language: settings.appearance.language,
                timezone: settings.appearance.timezone
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Update failed"
        });
    }

};




export const updateAppearance = async (req, res) => {

    try {

        const { theme } = req.body;

        if (theme) {
            if (typeof theme !== "string") {
                return res.status(400).json({
                    message: "Theme must be string"
                });
            }

            if (!allowedThemes.includes(theme)) {
                return res.status(400).json({
                    message: "Invalid theme value"
                });
            }

        }

        let settings = await UserSetting.findOne({
            user: req.user.id
        });


        if (!settings) {
            settings = new UserSetting({
                user: req.user.id
            });
        }


        if (theme) {
            settings.appearance.theme = theme;
        }

        await settings.save();

        res.json({
            message: "Appearance updated",
            appearance: {
                theme: settings.appearance.theme
            }
        });

    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            message: "Update failed"
        });
    }

};



export const updateNotification = async (req, res) => {

    try {

        const {
            emailNotifications,
            phoneNotifications,
            pushNotifications,
            appointmentReminder
        } = req.body;

        let settings = await UserSetting.findOne({
            user: req.user.id
        });

        if (!settings) {
            settings = new UserSetting({
                user: req.user.id
            });
        }

        if (emailNotifications !== undefined) {
            if (!isBoolean(emailNotifications)) {
                return res.status(400).json({
                    message: "emailNotifications must be boolean"
                });
            }
            settings.notifications.emailNotifications = emailNotifications;
        }

        if (phoneNotifications !== undefined) {
            if (!isBoolean(phoneNotifications)) {
                return res.status(400).json({
                    message: "phoneNotifications must be boolean"
                });
            }
            settings.notifications.phoneNotifications =
                phoneNotifications;
        }

        if (pushNotifications !== undefined) {
            if (!isBoolean(pushNotifications)) {
                return res.status(400).json({
                    message: "pushNotifications must be boolean"
                });
            }
            settings.notifications.pushNotifications = pushNotifications;
        }

        if (appointmentReminder !== undefined) {
            if (!isBoolean(appointmentReminder)) {
                return res.status(400).json({
                    message: "appointmentReminder must be boolean"
                });
            }
            settings.notifications.appointmentReminder = appointmentReminder;
        }

        await settings.save();

        res.json({
            message: "Notification settings updated",
            notifications: settings.notifications
        });

    } catch (error) {
        res.status(500).json({
            message: "Update failed"
        });
    }
};