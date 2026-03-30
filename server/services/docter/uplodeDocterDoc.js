import cloudinary from "../../config/cloudinary.js";

export const uploadDoctorDocumentsService = async (files, userId) => {

    try {

        if (!files || files.length === 0) {
            throw new Error("Files missing");
        }

        let uploadedDocuments = [];

        for (const file of files) {

            const documentType = file.fieldname;

            if (!documentType) {
                throw new Error("Document type missing");
            }

            const base64 =
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

            const result =
                await cloudinary.uploader.upload(
                    base64,
                    {
                        folder: "healthsphere/doctors/documents",

                        public_id: `${userId}_${documentType}_${Date.now()}`,

                        overwrite: true,

                        resource_type: "auto"
                    }
                );

            uploadedDocuments.push({

                documentType,

                documentUrl: result.secure_url,

                verificationStatus: "pending"

            });

        }

        return uploadedDocuments;

    }
    catch (error) {

        throw error;

    }

};