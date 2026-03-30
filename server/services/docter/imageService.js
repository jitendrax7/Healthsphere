import cloudinary from "../../config/cloudinary.js";


export const uploadProfileImageService = async (file, user) => {

    try {

        if (!file) {
            throw new Error("File missing");
        }
   
        const base64 =
            `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(
            base64,
            {
                folder: "healthsphere/profile",
                public_id: user._id,
                overwrite: true
            }
        );

        return result.secure_url;
    }
    catch (error) {
        throw error;
    }
};