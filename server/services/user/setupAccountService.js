import UserHealthProfile from "../../models/UserHealthProfile.js";
import UserSetting from "../../models/userSetting.js";


export const setupUserAccount = async (userId) => {

    try {

        const [profileExists, settingExists] = await Promise.all([
            UserHealthProfile.findOne({ user: userId }),
            UserSetting.findOne({ user: userId })
        ]);

        let promises = [];


        if (!profileExists) {
            promises.push(
                UserHealthProfile.create({
                    user: userId
                })
            );
        }

        if (!settingExists) {
            promises.push(
                UserSetting.create({
                    user: userId
                })
            );
        }


        if (promises.length > 0) {
            await Promise.all(promises);
        }

        return true;

    } catch (error) {
        console.error("User setup error:", error);
        return false;
    }
};