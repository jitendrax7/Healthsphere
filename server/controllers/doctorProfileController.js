import DoctorProfile from "../models/DoctorProfile.js";

/* ======================================================
   CREATE OR UPDATE DOCTOR PROFILE
====================================================== */

// import DoctorProfile from "../models/DoctorProfile.js";
import User from "../models/User.js";

/* ======================================================
   CREATE OR UPDATE DOCTOR PROFILE
====================================================== */

export const createOrUpdateDoctorProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      specialization,
      qualifications,
      experience,
      consultationFee,
      hospitalName,
      bio,
      availableDays,
      availableTime,
      clinicLocation
    } = req.body;

    // Get user (for location reference if needed)
    const user = await User.findById(userId);

    let profile = await DoctorProfile.findOne({ user: userId });

    if (!profile) {
      // CREATE
      profile = new DoctorProfile({
        user: userId,
        specialization,
        qualifications,
        experience,
        consultationFee,
        hospitalName,
        bio,
        availableDays,
        availableTime,
        clinicLocation
      });
    } else {
      // UPDATE
      profile.specialization = specialization ?? profile.specialization;
      profile.qualifications = qualifications ?? profile.qualifications;
      profile.experience = experience ?? profile.experience;
      profile.consultationFee = consultationFee ?? profile.consultationFee;
      profile.hospitalName = hospitalName ?? profile.hospitalName;
      profile.bio = bio ?? profile.bio;
      profile.availableDays = availableDays ?? profile.availableDays;
      profile.availableTime = availableTime ?? profile.availableTime;
      profile.clinicLocation = clinicLocation ?? profile.clinicLocation;
    }

    /* ===============================
       AUTO ENABLE BOOKING CHECK
    =============================== */

    const isComplete =
      profile.specialization &&
      profile.experience &&
      profile.consultationFee &&
      profile.availableDays?.length > 0 &&
      profile.availableTime?.startTime &&
      profile.availableTime?.endTime;

    profile.isBookingEnabled = !!isComplete;

    await profile.save();

    res.status(200).json({
      message: profile.isNew
        ? "Doctor profile created successfully"
        : "Doctor profile updated successfully",
      profile,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


export const getDoctorProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await DoctorProfile.findOne({ user: userId })
      .populate("user", "Name email role location");

    if (!profile) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    res.status(200).json({
      message: "Doctor profile fetched successfully",
      profile: {
        doctorId: profile.user._id,
        name: profile.user.Name,
        email: profile.user.email,
        role: profile.user.role,
        specialization: profile.specialization,
        experience: profile.experience,
        consultationFee: profile.consultationFee,
        hospitalName: profile.hospitalName,
        bio: profile.bio,
        clinicLocation: profile.clinicLocation,
        availableDays: profile.availableDays,
        availableTime: profile.availableTime,
        isBookingEnabled: profile.isBookingEnabled,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};