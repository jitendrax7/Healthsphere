import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { oauth2Client } from "../../config/googleOAuth.js";
import UserSetting from "../../models/UserSetting.js";


export const getGoogleAuthURL = (userId) => {

    return oauth2Client.generateAuthUrl({

        access_type: "offline",

        prompt: "consent",

        scope: [

            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/userinfo.email'

        ],
        state: userId.toString()
    });
};


export const saveGoogleTokens = async (userId, tokens) => {

    try {
        const setting = await UserSetting.findOne({ user: userId });
        if (!setting) {
            console.log("User settings not found");
            return;
        }
        let decoded = null;
        if (tokens.id_token) {
            decoded = jwt.decode(tokens.id_token);
        }

        console.log("Saving Google tokens for user:", tokens, decoded);
        setting.googleCalendar.connected = true;
        if (decoded) {
            setting.googleCalendar.googleId = decoded.sub;
            setting.googleCalendar.email = decoded.email;
        }
        setting.googleCalendar.accessToken = tokens.access_token;
        if (tokens.refresh_token) {
            setting.googleCalendar.refreshToken = tokens.refresh_token;
        }

        if (tokens.expiry_date) {
            setting.googleCalendar.tokenExpiry = new Date(tokens.expiry_date);
        }
        await setting.save();
    }
    catch (error) {
        console.log(
            "Google token save error",
            error
        );
    }
};


export const getAuthClient = async (userId) => {
    const setting = await UserSetting.findOne({ user: userId });

    if (!setting?.googleCalendar?.connected)
        return null;

    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    auth.setCredentials({
        access_token: setting.googleCalendar.accessToken,
        refresh_token: setting.googleCalendar.refreshToken,
        expiry_date: setting.googleCalendar.tokenExpiry
    });

    auth.on('tokens',
        async (tokens) => {

            if (tokens.access_token) {
                setting.googleCalendar.accessToken = tokens.access_token;
                setting.googleCalendar.tokenExpiry = new Date(tokens.expiry_date);
            }

            if (tokens.refresh_token) {
                setting.googleCalendar.refreshToken = tokens.refresh_token;
            }

            await setting.save();
        });
    return auth;
};


export const createCalendarEvent =  async (userId, appointment) => {
        try {
            const auth = await getAuthClient(userId);
            if (!auth) return;
            const calendar =  google.calendar({
                    version: "v3",
                    auth
                });


    
            const date = new Date(appointment.appointmentDate).toISOString().split("T")[0];
            const startDateTime =`${date}T${appointment.startTime}:00`;
            const endDateTime = `${date}T${appointment.endTime}:00`;

            const fullAddress = `
${appointment.doctorLocation.clinicName},
${appointment.doctorLocation.addressLine},
${appointment.doctorLocation.city},
${appointment.doctorLocation.state},
${appointment.doctorLocation.pincode}
`;

            const mapsLink =`https://www.google.com/maps?q=${appointment.doctorLocation.latitude},${appointment.doctorLocation.longitude}`;

            const event = await calendar.events.insert({
                calendarId:"primary",
                requestBody:{
                    summary:`Doctor Appointment`,
                    location: fullAddress,
                    description:`Appointment Details
Mode: ${appointment.mode}
Clinic:${appointment.doctorLocation.clinicName}
Address:${appointment.doctorLocation.addressLine}
City:${appointment.doctorLocation.city}
State:${appointment.doctorLocation.state}
Pincode:${appointment.doctorLocation.pincode}
Google Maps Link: ${mapsLink}
 Booked via HealthSphere`,

                    start:{
                        dateTime:startDateTime,
                        timeZone:"Asia/Kolkata"
                    },
                    end:{
                        dateTime:endDateTime,
                        timeZone:"Asia/Kolkata"
                    },
                    reminders:{
                        useDefault:false,
                        overrides:[
                            {
                                method:"popup",
                                minutes:30
                            },
                            {
                                method:"email",
                                minutes:120
                            }
                        ]
                    }
                }
            });
            return event.data.id;
        }
        catch (error) {
            console.log( "error in createCalendarEvent",error);
        }
    };


export const deleteCalendarEvent = async (userId, eventId) => {
    try {
        const auth = await getAuthClient(userId);

        if (!auth) return;
        const calendar = google.calendar({
            version: "v3",
            auth
        });
        await calendar.events.delete({
            calendarId: "primary",
            eventId
        });
    }
    catch (error) {
        console.log(error);
    }
};


export const disconnectGoogle = async (userId) => {
    await UserSetting.findOneAndUpdate(
        { user: userId },
        {
            googleCalendar: {
                connected: false,
                accessToken: null,
                refreshToken: null,
                tokenExpiry: null
            }
        }
    );
};