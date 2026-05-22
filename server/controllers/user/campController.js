import HealthcareCamp from "../../models/HealthcareCamp.js";

export const getPublicCamps = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    const hasLocation = lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));
    const radiusMeters = parseFloat(radius) || 100000; // default 100 km

    let query = { status: "published" };

    if (hasLocation) {
      query["location.geo"] = {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: radiusMeters,
        },
      };
    }

    const camps = await HealthcareCamp.find(query)
      .select(
        "title campType startDate endDate startTime endTime location.city location.state location.geo posterImage totalRegistrations maxParticipants isFree campFee"
      )
      .populate({ path: "hospital", select: "hospitalName" })
      .sort(hasLocation ? undefined : { startDate: 1 }); // $nearSphere already sorts by distance

    return res.status(200).json({
      success: true,
      total: camps.length,
      locationFiltered: hasLocation,
      camps,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch camps",
      error: error.message,
    });
  }
};



export const getCampDetails = async (req,res)=>{
  try{

    const { campId } = req.params;

    const camp = await HealthcareCamp.findOne({
      _id:campId,
      status:"published"
    })
    .populate({
      path:"hospital",
      select:"hospitalName contactNumber"
    })
    .populate({
      path:"doctors.doctor",
      select:"specialization user"
    });

    if(!camp){
      return res.status(404).json({
        success:false,
        message:"Camp not found"
      });
    }

    // Tell the frontend if the current logged-in user is already registered
    const userId = req.user?.id;
    const alreadyRegistered = userId
      ? camp.registeredUsers.some((uid) => uid.toString() === userId.toString())
      : false;

    return res.status(200).json({
      success:true,

      camp:{
        id:camp._id,
        title:camp.title,
        description:camp.description,
        campType:camp.campType,
        departments:camp.departments,
        services:camp.services,
        doctors:camp.doctors,

        hospital:{
          name:camp.hospital?.hospitalName,
          contactNumber:camp.hospital?.contactNumber
        },

        location:{
          addressLine:camp.location?.addressLine,
          city:camp.location?.city,
          state:camp.location?.state,
          pincode:camp.location?.pincode,

          longitude:camp.location?.geo?.coordinates?.[0],
          latitude:camp.location?.geo?.coordinates?.[1]
        },
        startDate:camp.startDate,
        endDate:camp.endDate,
        startTime:camp.startTime,
        endTime:camp.endTime,
        registrationDeadline:camp.registrationDeadline,
        maxParticipants:camp.maxParticipants,
        totalRegistrations:camp.totalRegistrations,
        registrationRequired:camp.registrationRequired,
        isRegistered:alreadyRegistered,
        contactNumber:camp.contactNumber,
        posterImage:camp.posterImage,
        status:camp.status,
        isFree:camp.isFree,
        campFee:camp.campFee,
        createdAt:camp.createdAt

      }

    });

  }
  catch(error){

    return res.status(500).json({
      success:false,
      message:"Failed to fetch camp details",
      error:error.message

    });

  }
};


export const registerForCamp = async (req, res) => {
  try {
    const { campId } = req.params;
    const userId = req.user.id;

    const camp = await HealthcareCamp.findOne({ _id: campId, status: "published" });

    // ── 1. Camp must exist & be published ──────────────────────────────────
    if (!camp) {
      return res.json({
        success: false,
        message: "Camp not found or is no longer available.",
      });
    }

    // ── 2. Prevent duplicate registration ──────────────────────────────────
    const alreadyRegistered = camp.registeredUsers.some(
      (uid) => uid.toString() === userId.toString()
    );
    if (alreadyRegistered) {
      return res.status(409).json({
        success: false,
        message: "You are already registered for this camp.",
      });
    }

    // ── 3. Check seat capacity ─────────────────────────────────────────────
    if (camp.maxParticipants && camp.totalRegistrations >= camp.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "This camp is fully booked. No seats remaining.",
      });
    }

    // ── 4. Check registration deadline ────────────────────────────────────
    if (camp.registrationDeadline && new Date() > new Date(camp.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: "Registration deadline has passed for this camp.",
      });
    }

    // ── 5. Register: push userId + increment counter (atomic) ─────────────
    await HealthcareCamp.findByIdAndUpdate(
      campId,
      {
        $addToSet: { registeredUsers: userId },
        $inc:      { totalRegistrations: 1 },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "You have successfully registered for this camp!",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: error.message,
    });
  }
};