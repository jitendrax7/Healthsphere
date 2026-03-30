import cloudinary from "../../config/cloudinary.js";

export const uploadHospitalDocumentService = async (file,userId,documentType)=>{
  try{
    if(!file){
      throw new Error("File missing");
    }

    if(!documentType){
      throw new Error("Document type missing");
    }

    const base64 =`data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(
      base64,
      {
        folder:"healthsphere/hospitals/documents",
        public_id:`${userId}_${documentType}`,
        overwrite:true,
        resource_type:"auto"
      }
    );

    return result.secure_url;

  }
  catch(error){
    throw error;
  }
};