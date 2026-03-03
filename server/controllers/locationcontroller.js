import User from "../models/User.js";

/* ======================================================
   UPDATE CURRENT LOCATION (USER & DOCTOR)
====================================================== */

export const updateCurrentLocation = async (req, res) => {
  try {
    const userId = req.user._id;

    const { city, latitude, longitude } = req.body;

    // ✅ Basic validation
    if (!city || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "City, latitude and longitude are required",
      });
    }

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res.status(400).json({
        message: "Latitude and longitude must be numbers",
      });
    }

    // Optional range validation
    if (
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return res.status(400).json({
        message: "Invalid latitude or longitude range",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          city,
          latitude,
          longitude,
        },
      },
      { new: true, select: "-password -otp -otpExpire" }
    );

    res.status(200).json({
      message: "Location updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

