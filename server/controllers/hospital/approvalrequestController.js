import HospitalProfile from "../../models/HospitalProfile.js";
import { calculateHospitalProfileCompletion } from "../../utils/profileCompletion.js";

export const requestHospitalVerification = async (req,res)=>{
  try{

    const userId = req.user._id;

    const hospital = await HospitalProfile.findOne({
      user:userId
    });

    if(!hospital){
      return res.status(404).json({
        success:false,
        message:"Hospital profile not found"
      });
    }

    if(hospital.verificationStatus === "pending"){
      return res.status(400).json({
        success:false,
        message:"Verification already requested"
      });
    }

    if(hospital.verificationStatus === "approved"){
      return res.status(400).json({
        success:false,
        message:"Hospital already verified"
      });
    }

    const profileCompletion =  calculateHospitalProfileCompletion(hospital);

    
    if(profileCompletion < 60){
      return res.status(400).json({
        success:false,
        message:"Complete hospital profile before requesting verification",
        profileCompletion
      });
    }

    // Required documents check
    const requiredDocuments = [
      "registration_certificate",
      "government_license"
    ];

    const uploadedDocs = hospital.documents.map(
      doc => doc.documentType
    );

    const missingDocs = requiredDocuments.filter(
      doc => !uploadedDocs.includes(doc)
    );

    if(missingDocs.length > 0){
      return res.status(400).json({
        success:false,
        message:"Required documents missing",
        missingDocuments:missingDocs
      });
    }

    if(
      !hospital.contactNumber ||
      !hospital.location?.city ||
      !hospital.location?.state
    ){

      return res.status(400).json({
        success:false,
        message:"Complete basic hospital details before verification"
      });
    }

    hospital.verificationStatus = "pending";
    hospital.adminVerified = false;
    hospital.verifiedAt = null;
    await hospital.save();
    return res.status(200).json({
      success:true,
      message:"Verification request submitted",
      verificationStatus:"pending"
    });
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"Failed to request verification",
      error:error.message
    });
  }
};