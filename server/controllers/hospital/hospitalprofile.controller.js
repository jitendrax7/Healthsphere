import HospitalProfile from "../../models/HospitalProfile.js";
import User from "../../models/User.js";
import { uploadHospitalDocumentService } from "../../services/hospital/uplodedocument.js";
import { calculateHospitalProfileCompletion } from "../../utils/profileCompletion.js";

export const getHospitalStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .select("isVerified role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const hospital = await HospitalProfile.findOne({
      user: userId
    }).select(
      "hospitalName verificationStatus adminVerified isActive documents"
    );

   
    if(!hospital){
      return res.status(200).json({
        success:true,
        profileExists:false,
        onboardingStep:"create_profile",
        account:{
          emailVerified:user.isVerified
        },
        hospital:null,
        message:"Complete hospital profile to continue"
      });
    }

    let onboardingStep = "profile_completed";

    switch(hospital.verificationStatus){
      case "draft":
        onboardingStep = "complete_profile";
        break;
      case "pending":
        onboardingStep = "verification_pending";
        break;
      case "approved":
        onboardingStep = "approved";
        break;
      case "rejected":
        onboardingStep = "rejected";
        break;
      default:
        onboardingStep = "complete_profile";
    }

    const profileCompletion =  calculateHospitalProfileCompletion(hospital);

    return res.status(200).json({
      success:true,
      profileExists:true,
      onboardingStep,
      account:{
        emailVerified:user.isVerified
      },
      hospital:{
        hospitalName:hospital.hospitalName,
        verificationStatus:hospital.verificationStatus,
        adminVerified:hospital.adminVerified,
        isActive:hospital.isActive,
        profileCompletion,
        documentsUploaded:  hospital.documents?.length || 0
      }
    });
  }
  catch (error) {
    return res.status(500).json({
      success:false,
      message:"Failed to fetch hospital status",
      error:error.message
    });
  }
};



export const createHospitalProfile = async (req, res) => {
  try {

    const userId = req.user._id;

    const {
      hospitalName,
      registrationNumber,
      hospitalType,
      establishedYear,
      description,
      contactNumber,
      emergencyNumber,
      email,
      website,
      addressLine,
      city,
      state,
      pincode,
      latitude,
      longitude
    } = req.body;

    // Required field validation
    if (!hospitalName || !registrationNumber) {
      return res.status(400).json({
        success: false,
        message: "Hospital name and registration number are required"
      });
    }

    const user = await User.findById(userId)
      .select("isVerified role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const existingHospital = await HospitalProfile.findOne({
      user: userId
    });

    if (existingHospital) {
      return res.status(400).json({
        success: false,
        message: "Hospital profile already exists"
      });
    }

    // Create profile
    const hospital = await HospitalProfile.create({

      user: userId,

      hospitalName,
      registrationNumber,
      hospitalType,
      establishedYear,
      description,

      contactNumber,
      emergencyNumber,
      email,
      website,

      location:{
        addressLine,
        city,
        state,
        pincode,
        geo:{
          type:"Point",
          coordinates:[longitude, latitude]
        }
      },

      verificationStatus: "draft"

    });

    return res.status(201).json({

      success: true,

      message: "Hospital profile created"

    });

  }
  catch (error) {
    console.log(error);
    

    return res.status(500).json({

      success: false,
      message: "Failed to create hospital profile",
      error: error.message

    });

  }
};



export const uploadHospitalDocument = async (req,res)=>{
  try{

    const userId = req.user._id;

    const { documentType } = req.body;

    if(!documentType){
      return res.status(400).json({
        success:false,
        message:"Document type required"
      });
    }

    if(!req.file){
      return res.status(400).json({
        success:false,
        message:"Document file required"
      });
    }

    const hospital = await HospitalProfile.findOne({
      user:userId
    });

    if(!hospital){
      return res.status(404).json({
        success:false,
        message:"Hospital profile not found"
      });
    }

    // Prevent upload if under review
    if(hospital.verificationStatus === "pending"){
      return res.status(400).json({
        success:false,
        message:"Cannot upload documents while verification pending"
      });
    }

    if(hospital.verificationStatus === "approved"){
      return res.status(400).json({
        success:false,
        message:"Hospital already verified"
      });
    }

    const documentUrl = await uploadHospitalDocumentService(req.file , req.user._id ,documentType );

    // Check if document type already exists
    const existingDocIndex = hospital.documents.findIndex(
      doc => doc.documentType === documentType
    );

    if(existingDocIndex !== -1){

      // Replace existing document
      hospital.documents[existingDocIndex].documentUrl = documentUrl;
      hospital.documents[existingDocIndex].verificationStatus = "pending";
      hospital.documents[existingDocIndex].uploadedAt = new Date();

    }
    else{

      hospital.documents.push({
        documentType,
        documentUrl,
        verificationStatus:"pending",
        uploadedAt:new Date()

      });

    }

    await hospital.save();

    return res.status(200).json({
      success:true,
      message:"Document uploaded successfully",
      documentsCount:hospital.documents.length
    });

  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"Failed to upload document",
      error:error.message
    });

  }
};