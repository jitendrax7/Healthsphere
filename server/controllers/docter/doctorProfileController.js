import DoctorProfile from "../../models/DoctorProfile.js";
import User from "../../models/User.js";
import { uploadProfileImageService } from "../../services/docter/imageService.js";
import { uploadDoctorDocumentsService } from "../../services/docter/uplodeDocterDoc.js";




export const createDoctorProfile = async (req, res) => {
  try {

    const userId = req.user._id;
    const existingProfile =
      await DoctorProfile.findOne({
        user: userId
      });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Doctor profile already exists"
      });
    }

    const {
      specialization,
      qualifications,
      certifications,
      awards,
      languages,
      servicesOffered,
      totalExperience,
      experienceDetails,
      consultationFee,
      employmentType,
      hospital,
      bio,
      consultationMode,
      availableDays,
      availability,
      clinicLocation
    } = req.body;

    // if (!specialization)
    //   return res.status(400).json({
    //     success: false,
    //     message: "Specialization required"
    //   });

    // if (!totalExperience)
    //   return res.status(400).json({
    //     success: false,
    //     message: "Experience required"
    //   });

    // if (!consultationFee)
    //   return res.status(400).json({
    //     success: false,
    //     message: "Consultation fee required"
    //   });

    // if (!clinicLocation)
    //   return res.status(400).json({
    //     success: false,
    //     message: "Clinic location required"
    //   });


    const parsedQualifications =
      qualifications ? JSON.parse(qualifications) : [];

    const parsedCertifications =
      certifications ? JSON.parse(certifications) : [];

    const parsedAwards =
      awards ? JSON.parse(awards) : [];

    const parsedExperience =
      experienceDetails ? JSON.parse(experienceDetails) : [];

    const parsedLanguages =
      languages ? JSON.parse(languages) : [];

    const parsedServices =
      servicesOffered ? JSON.parse(servicesOffered) : [];

    const parsedDays =
      availableDays ? JSON.parse(availableDays) : [];

    const parsedAvailability =
      availability ? JSON.parse(availability) : {};

    const parsedLocation =
      clinicLocation ? JSON.parse(clinicLocation) : {};

    // Upload documents

    let uploadedDocuments = [];

    if (req.files && req.files.length > 0) {
      const documentLinks =
        await uploadDoctorDocumentsService(req.files);
      uploadedDocuments = documentLinks.map(doc => ({
        documentType: doc.documentType,
        documentUrl: doc.documentUrl
      }));
    }

    const profile = await DoctorProfile.create({
      user: userId,
      specialization,
      qualifications: parsedQualifications,
      certifications: parsedCertifications,
      awards: parsedAwards,
      languages: parsedLanguages,
      servicesOffered: parsedServices,
      totalExperience,
      experienceDetails: parsedExperience,
      consultationFee,
      employmentType,
      hospital,
      bio,
      consultationMode,
      availableDays: parsedDays,
      availability: parsedAvailability,
      clinicLocation: parsedLocation,
      documents: uploadedDocuments
    });

    return res.status(201).json({
      success: true,
      message: "Doctor profile created"
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: error.message
    });
  }
};

export const updateDoctorProfile = async (req, res) => {

  try {

    const userId = req.user._id;

    const profile =
      await DoctorProfile.findOne({
        user: userId
      });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    const {

      specialization,
      qualifications,
      certifications,
      awards,
      languages,
      servicesOffered,
      totalExperience,
      experienceDetails,
      consultationFee,
      employmentType,
      hospital,
      bio,
      consultationMode,
      availableDays,
      availability,
      clinicLocation

    } = req.body;

    // let verificationReset = false;

   

    const parseField = (field) => {
      return typeof field === "string"
        ? JSON.parse(field)
        : field;
    };

    if (
      specialization ||
      totalExperience ||
      qualifications ||
      experienceDetails ||
      hospital
    ) {
      verificationReset = true;
    }

    

    if (specialization)
      profile.specialization = specialization;

    if (qualifications)
      profile.qualifications =
        parseField(qualifications);

    if (certifications)
      profile.certifications =
        parseField(certifications);

    if (awards)
      profile.awards =
        parseField(awards);

    if (languages)
      profile.languages =
        parseField(languages);

    if (servicesOffered)
      profile.servicesOffered =
        parseField(servicesOffered);

    if (totalExperience)
      profile.totalExperience =
        totalExperience;

    if (experienceDetails)
      profile.experienceDetails =
        parseField(experienceDetails);

    if (consultationFee)
      profile.consultationFee =
        consultationFee;

    if (employmentType)
      profile.employmentType =
        employmentType;

    if (hospital)
      profile.hospital = hospital;

    if (bio)
      profile.bio = bio;

    if (consultationMode)
      profile.consultationMode =
        consultationMode;

    if (availableDays)
      profile.availableDays =
        parseField(availableDays);

    if (availability)
      profile.availability =
        parseField(availability);

    if (clinicLocation)
      profile.clinicLocation =
        parseField(clinicLocation);




    if (req.files) {
      const files =
        Object.values(req.files).flat();

      if (files.length > 0) {
        const uploadedDocs =
          await uploadDoctorDocumentsService(
            files,
            userId
          );
        profile.documents.push(
          ...uploadedDocs
        );
        verificationReset = true;
      }

    }


    if (verificationReset) {
      profile.verificationStatus = "verified";
      profile.verifiedBy = null;
      profile.verifiedAt = null;
    }

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Doctor profile updated",
      profile
    });

  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message
    });

  }

};


export const getDoctorProfile = async (req, res) => {

  try {

    const userId = req.user._id;

    const profile =
      await DoctorProfile.findOne({
        user: userId
      })

        .populate({
          path: "hospital",
          select: "hospitalName"
        })

        .select(`
        specialization
        qualifications
        certifications
        awards
        languages
        servicesOffered
        totalExperience
        experienceDetails
        consultationFee
        employmentType
        bio
        hospital
        clinicLocation
        consultationMode
        availableDays
        availability
        rating
        reviewCount
        isBookingEnabled
        verificationStatus
        documents
        verifiedAt
        createdAt
        updatedAt
        `)

        .lean();


    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"

      });

    }


    // Format documents

    const formattedDocuments =
      (profile.documents || []).map(doc => ({
        documentType: doc.documentType,
        documentUrl: doc.documentUrl,
        verificationStatus: doc.verificationStatus,
        uploadedAt: doc.uploadedAt

      }));


    return res.status(200).json({

      success: true,

      profile: {
        specialization: profile.specialization || null,
        qualifications: profile.qualifications || [],
        certifications:profile.certifications || [],
        awards: profile.awards || [],
        languages: profile.languages || [],
        servicesOffered: profile.servicesOffered || [],
        totalExperience: profile.totalExperience || 0,
        experienceDetails:profile.experienceDetails || [],
        consultationFee:profile.consultationFee || 0,
        employmentType:  profile.employmentType || "independent",
        bio:  profile.bio || "",

        // Hospital

        hospital: {
          id:
            profile.hospital?._id || null,
          name:
            profile.hospital?.hospitalName || null
        },


        // Location
        clinicLocation: {
          clinicName: profile.clinicLocation?.clinicName || null,
          addressLine: profile.clinicLocation?.addressLine || null,
          city: profile.clinicLocation?.city || null,
          state:profile.clinicLocation?.state || null,
          pincode: profile.clinicLocation?.pincode || null,
          latitude:  profile.clinicLocation?.latitude || null,
          longitude: profile.clinicLocation?.longitude || null
        },

        consultationMode: profile.consultationMode || "offline",
        availableDays:profile.availableDays || [],
        availability: profile.availability || {},

        rating: profile.rating || 0,
        reviewCount: profile.reviewCount || 0,
        isBookingEnabled:  profile.isBookingEnabled || false,
        verificationStatus: profile.verificationStatus || "pending",
        verifiedAt:  profile.verifiedAt || null,
        // Documents
        documents: formattedDocuments,
        // Metadata
        profileCreatedAt: profile.createdAt,
        lastUpdatedAt: profile.updatedAt
      }
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
     error: error.message
    });
  }

};

export const toggleDoctorBooking = async (req, res) => {

  try {

    const userId = req.user._id;

    const enable = req.body.isBookingEnabled;

    if (typeof enable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isBookingEnabled must be boolean"
      });
    }

    const profile =
      await DoctorProfile.findOne({
        user: userId
      });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    const user =
      await User.findById(userId);

    if (!user.isVerified || user.accountStatus !== "active") {
      return res.status(403).json({
        success: false,
        message: "Account must be verified and active"
      });
    }

    if (!user.profilePhoto) {
      return res.status(403).json({
        success: false,
        message: "Profile photo required"
      });
    }

    if (enable) {

      const missingFields = [];

      if (!profile.specialization)
        missingFields.push("specialization");

      if (!profile.totalExperience)
        missingFields.push("totalExperience");

      if (!profile.consultationFee)
        missingFields.push("consultationFee");

      if (!profile.availableDays?.length)
        missingFields.push("availableDays");

      if (!profile.availability?.startTime)
        missingFields.push("availability.startTime");

      if (!profile.availability?.endTime)
        missingFields.push("availability.endTime");

      if (!profile.availability?.slotDuration)
        missingFields.push("availability.slotDuration");

      if (
        !profile.clinicLocation?.clinicName ||
        !profile.clinicLocation?.addressLine ||
        !profile.clinicLocation?.city ||
        !profile.clinicLocation?.state ||
        !profile.clinicLocation?.pincode ||
        !profile.clinicLocation?.latitude ||
        !profile.clinicLocation?.longitude
      ) {
        missingFields.push("clinicLocation");
      }

      if (
        !profile.qualifications ||
        profile.qualifications.length === 0
      ) {
        missingFields.push("qualifications");
      }

      if (profile.verificationStatus !== "verified") {
        missingFields.push("doctor verification");
      }

      if (missingFields.length) {
        return res.status(400).json({
          success: false,
          message: "Profile incomplete",
          missingFields,
          bookingEnabled: false

        });
      }

    }

    profile.isBookingEnabled = enable;
    await profile.save();
    return res.status(200).json({
      success: true,
      bookingEnabled: profile.isBookingEnabled,
      message:
        enable
          ? "Booking enabled"
          : "Booking disabled"

    });

  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }

};


export const uploadProfileImage = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image"
      });
    }
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const imageUrl = await uploadProfileImageService(
      req.file,
      req.user
    );


    const user = await User.findByIdAndUpdate(

      req.user._id,
      {
        profilePhoto: imageUrl
      },
      {
        new: true
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        profilePhoto: imageUrl
      }
    });
  }

  catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed"
    });
  }

};