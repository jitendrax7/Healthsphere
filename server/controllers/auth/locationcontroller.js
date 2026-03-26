import User from "../../models/User.js";

/* ======================================================
   UPDATE CURRENT LOCATION (USER & DOCTOR)
====================================================== */

import axios from "axios";

export const updateCurrentLocation = async (req, res) => {

  try {

    const userId = req.user._id;

    const { latitude, longitude } = req.body;
    // const latitude = parseFloat(29.40459618157416);
    // const longitude = parseFloat(76.66103379872634);
    if (
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        message: "Latitude and longitude required"
      });
    }

    // range validation
    if (
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return res.status(400).json({
        message: "Invalid coordinates"
      });
    }

    // ⭐ Reverse geocoding API
    const geoResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      {
        headers: {
          "User-Agent": "HealthSphere/1.0 (jitendra project)",
          "Accept-Language": "en"
        }
      }
    );
    console.log(geoResponse.data);

    const address = geoResponse.data.address;
    console.log(address);
    const city =
      address.city ||
      address.town ||
      address.village ||
      address.city_district ||
      "Unknown";

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          city,
          latitude,
          longitude
        }
      },
      {
        new: true,
        select: "location" // 👈 only fetch location
      }
    );


    res.status(200).json({

      message: "Location updated",

      user: updatedUser

    });

  }
  catch (error) {
    console.error("Location update error:", error);
    res.status(500).json({

      message: "Server error",

      error: error.message

    });

  }

};