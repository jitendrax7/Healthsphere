import cloudinary from "../../config/cloudinary.js";
import fs from "fs";

export const uploadDoctorDocumentsService = async (files, userId) => {

    if (!files || files.length === 0) {
        throw new Error("Files missing");
    }

    const uploadPromises = files.map(async (file) => {

        try{

            console.time(`Upload ${file.fieldname}`);

            const result =
            await cloudinary.uploader.upload(

                file.path,

                {
                    folder:"healthsphere/doctors/documents",

                    public_id:
                    `${userId}_${file.fieldname}_${Date.now()}`,

                    resource_type:"auto"
                }

            );

            console.timeEnd(`Upload ${file.fieldname}`);

            // delete temp file
            fs.unlink(file.path,()=>{});

            console.log("Uploaded:",file.fieldname);

            return {
                documentType:file.fieldname,
                documentUrl:result.secure_url,
                verificationStatus:"pending"
            };

        }
        catch(error){

            fs.unlink(file.path,()=>{});

            throw error;

        }

    });

    return await Promise.all(uploadPromises);

};