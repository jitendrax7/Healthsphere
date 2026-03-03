import UserHealthProfile from "../models/UserHealthProfile.js";

/* ======================================================
   CREATE OR UPDATE PROFILE
====================================================== */

export const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      age,
      gender,
      height,
      weight,
      bloodGroup,
      allergies,
      chronicDiseases,
      pastSurgeries,
      familyMedicalHistory,
      lifestyle,
      emergencyContact
    } = req.body;

    // Check if profile already exists
    let profile = await UserHealthProfile.findOne({ user: userId });

    // Calculate BMI if height and weight provided
    let calculatedBMI = undefined;

    if (height?.value && weight?.value) {
      const heightInMeters = height.value / 100;
      calculatedBMI = (
        weight.value / (heightInMeters * heightInMeters)
      ).toFixed(2);
    }

    if (!profile) {
      // CREATE
      profile = await UserHealthProfile.create({
        user: userId,
        age,
        gender,
        height,
        weight,
        bloodGroup,
        allergies,
        chronicDiseases,
        pastSurgeries,
        familyMedicalHistory,
        lifestyle,
        emergencyContact,
        bmi: calculatedBMI
      });

      return res.status(201).json({
        message: "Profile created successfully",
        profile
      });
    }

    // UPDATE
    profile.age = age ?? profile.age;
    profile.gender = gender ?? profile.gender;
    profile.height = height ?? profile.height;
    profile.weight = weight ?? profile.weight;
    profile.bloodGroup = bloodGroup ?? profile.bloodGroup;
    profile.allergies = allergies ?? profile.allergies;
    profile.chronicDiseases = chronicDiseases ?? profile.chronicDiseases;
    profile.pastSurgeries = pastSurgeries ?? profile.pastSurgeries;
    profile.familyMedicalHistory =
      familyMedicalHistory ?? profile.familyMedicalHistory;
    profile.lifestyle = lifestyle ?? profile.lifestyle;
    profile.emergencyContact =
      emergencyContact ?? profile.emergencyContact;

    if (calculatedBMI) {
      profile.bmi = calculatedBMI;
    }

    await profile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await UserHealthProfile.findOne({ user: userId })
      .populate("user", "fullName email role createdAt");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found. Please create your profile first."
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      profile
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};