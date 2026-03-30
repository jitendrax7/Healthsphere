import cloudinary from "../../config/cloudinary.js";

export const uploadCampPosterService = async (
  file,
  hospitalId
)=>{
  try{

    if(!file){
      throw new Error("Poster file missing");
    }

    const base64 =
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(

      base64,

      {

        folder:"healthsphere/camps/posters",

        public_id:`camp_${hospitalId}_${Date.now()}`,

        overwrite:true,

        resource_type:"image"

      }

    );

    return result.secure_url;

  }
  catch(error){

    throw error;

  }
};