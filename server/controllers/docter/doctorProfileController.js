import DoctorProfile from "../../models/DoctorProfile.js";
import User from "../../models/User.js";



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

    const user = await User.findById(userId);

    let profile = await DoctorProfile.findOne({ user: userId });

    if (!profile) {
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

    const isComplete =
      profile.specialization &&
      profile.experience &&
      profile.consultationFee &&
      profile.availableDays?.length > 0 &&
      profile.availableTime?.startTime &&
      profile.availableTime?.endTime;

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

    const profile = await DoctorProfile.findOne({
      user: userId
    })
      .select(
        "specialization qualifications experience consultationFee hospitalName bio clinicLocation availableDays availableTime isBookingEnabled"
      )
      .lean();

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }

    res.json({
      success: true,
      profile: {
        specialization: profile.specialization,
        qualifications: profile.qualifications || [],
        experience: profile.experience,
        consultationFee: profile.consultationFee,
        hospitalName: profile.hospitalName,
        bio: profile.bio,
        clinicLocation: {
          clinicName: profile.clinicLocation?.clinicName,
          addressLine: profile.clinicLocation?.addressLine,
          city: profile.clinicLocation?.city,
          state: profile.clinicLocation?.state,
          pincode: profile.clinicLocation?.pincode
        },
        availableDays: profile.availableDays || [],
        availableTime: profile.availableTime || {},
        isBookingEnabled: profile.isBookingEnabled
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};



export const toggleDoctorBooking = async (req, res) => {

  try {

    const userId = req.user._id;
    const enable  = req.body.isBookingEnabled;
    // console.log(enable);


    if (typeof enable !== "boolean") {
      return res.status(400).json({
        message: "Enable must be boolean"
      });
    }

    const profile = await DoctorProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        message: "Doctor profile not found"
      });
    }

    if (enable) {
      const missingFields = [];
      if (!profile.specialization)
        missingFields.push("specialization");
      if (!profile.experience)
        missingFields.push("experience");
      if (!profile.consultationFee)
        missingFields.push("consultationFee");
      if (!profile.availableDays?.length)
        missingFields.push("availableDays");
      if (!profile.availableTime?.startTime)
        missingFields.push("startTime");
      if (!profile.availableTime?.endTime)
        missingFields.push("endTime");

      if (missingFields.length) {
        return res.status(400).json({
          message: "Profile incomplete",
          missingFields,
          bookingEnabled: false
        });
      }
    }


    profile.isBookingEnabled = enable;

    await profile.save();

    res.json({
      success: true,
      bookingEnabled: profile.isBookingEnabled,
      message: enable? "Booking enabled": "Booking disabled"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};