import HealthcareCamp from "../../models/HealthcareCamp.js";

export const getPublicCamps = async (req,res)=>{
  try{

    const camps = await HealthcareCamp.find({
      status:"published"
    })
    .select(
      "title campType startDate endDate startTime endTime location.city location.state posterImage totalRegistrations maxParticipants isFree campFee"
    )
    .populate({
      path:"hospital",
      select:"hospitalName"
    })
    .sort({ startDate:1 });

    return res.status(200).json({
      success:true,
      total:camps.length,
      camps
    });

  }
  catch(error){

    return res.status(500).json({
      success:false,
      message:"Failed to fetch camps",
      error:error.message
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