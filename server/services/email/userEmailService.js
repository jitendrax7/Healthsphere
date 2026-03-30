import sendEmail from "../../utils/sendEmail.js";

import welcomeTemplate from "../../templates/email/user/welcome.js";
import otpTemplate from "../../templates/email/user/otp.js";



 const templateMap = {
        WELCOME: welcomeTemplate,
        OTP: otpTemplate
    };

export const sendUserEmail = async (purpose, data) => {
    
    try {

        const templateFunction = templateMap[purpose];
        if (!templateFunction) {
            throw new Error("Invalid email purpose");
        }

        const emailContent = templateFunction(data);

        const result = await sendEmail(
            data.email,
            emailContent.subject,
            emailContent.html
        );

        return result;

    } catch (error) {
        console.log("Email Service Error:", error);
        return false;
    }

};