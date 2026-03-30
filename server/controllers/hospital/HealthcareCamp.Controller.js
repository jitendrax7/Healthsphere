import HealthcareCamp from "../../models/HealthcareCamp.js";
import HospitalProfile from "../../models/HospitalProfile.js";
import { uploadCampPosterService } from "../../services/hospital/uploadCampPosterService.js";

export const createHealthcareCamp = async (req, res) => {
    try {

        const userId = req.user._id;

        const hospital = await HospitalProfile.findOne({
            user: userId
        });

        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital profile not found"
            });poster
        }

        // Only verified hospitals can create camps
        if (hospital.verificationStatus !== "approved") {
            return res.status(403).json({
                success: false,
                message: "Hospital must be verified to create camp"
            });
        }

        const {

            title,
            description,
            campType,
            departments,
            services,
            doctors,

            addressLine,
            city,
            state,
            pincode,
            latitude,
            longitude,

            startDate,
            endDate,
            startTime,
            endTime,

            registrationDeadline,
            maxParticipants,
            registrationRequired,

            contactNumber,
            isFree,
            campFee

        } = req.body;

        // Basic validation
        if (!title || !startDate || !startTime) {
            return res.status(400).json({
                success: false,
                message: "Title, start date and start time required"
            });
        }

        // Upload poster if provided
        let posterImage = null;

        if (req.file) {

            posterImage = await uploadCampPosterService(
                req.file,
                hospital._id
            );

        }

        // Format doctor data safely
        let doctorList = [];

        if (doctors) {

            const parsedDoctors =
                typeof doctors === "string"
                    ? JSON.parse(doctors)
                    : doctors;

            doctorList = parsedDoctors.map(doc => ({

                doctor: doc.doctorId || null,

                doctorName: doc.doctorName,

                specialization: doc.specialization

            }));

        }

        // Create camp
        const camp = await HealthcareCamp.create({

            hospital: hospital._id,

            title,
            description,
            campType,

            departments,
            services,

            doctors: doctorList,

            location: {

                addressLine,
                city,
                state,
                pincode,

                geo: {
                    type: "Point",
                    coordinates: [
                        Number(longitude),
                        Number(latitude)
                    ]
                }

            },

            startDate,
            endDate,

            startTime,
            endTime,

            registrationDeadline,

            maxParticipants,

            registrationRequired,

            contactNumber,

            posterImage,

            isFree,

            campFee,

            createdBy: userId,

            status: "draft"

        });

        return res.status(201).json({

            success: true,

            message: "Healthcare camp created",

            camp

        });

    }
    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Failed to create camp",

            error: error.message

        });

    }
};




export const getHospitalCamps = async (req,res)=>{
  try{

    const userId = req.user._id;

    const hospital = await HospitalProfile.findOne({
      user:userId
    }).select("_id hospitalName");

    if(!hospital){
      return res.status(404).json({
        success:false,
        message:"Hospital profile not found"
      });
    }

    const camps = await HealthcareCamp.find({
      hospital:hospital._id
    })
    .select(
      "title campType startDate endDate startTime endTime status totalRegistrations maxParticipants posterImage createdAt"
    )
    .sort({createdAt:-1});

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



export const getHospitalCampDetails = async (req,res)=>{
  try{

    const userId = req.user._id;
    const { campId } = req.params;

    const hospital = await HospitalProfile.findOne({
      user:userId
    }).select("_id hospitalName");

    if(!hospital){
      return res.status(404).json({
        success:false,
        message:"Hospital profile not found"
      });
    }

    const camp = await HealthcareCamp.findOne({
      _id:campId,
      hospital:hospital._id
    })
    .populate("doctors.doctor","user specialization")
    .populate("registeredUsers","name email");

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
        location:camp.location,
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
        registeredUsersCount:
          camp.registeredUsers?.length || 0,
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



export const updateHealthcareCamp = async (req,res)=>{
  try{

    const userId = req.user._id;
    const { campId } = req.params;

    const hospital = await HospitalProfile.findOne({
      user:userId
    }).select("_id verificationStatus");

    if(!hospital){
      return res.status(404).json({
        success:false,
        message:"Hospital profile not found"
      });
    }

    const camp = await HealthcareCamp.findOne({
      _id:campId,
      hospital:hospital._id
    });

    if(!camp){
      return res.status(404).json({
        success:false,
        message:"Camp not found"
      });
    }

    // Prevent editing if camp already completed
    if(camp.status === "completed"){
      return res.status(400).json({
        success:false,
        message:"Completed camp cannot be edited"
      });
    }

    const {

      title,
      description,
      campType,
      departments,
      services,
      doctors,

      addressLine,
      city,
      state,
      pincode,
      latitude,
      longitude,

      startDate,
      endDate,
      startTime,
      endTime,

      registrationDeadline,
      maxParticipants,
      registrationRequired,

      contactNumber,
      isFree,
      campFee

    } = req.body;

    // Update basic fields
    if(title) camp.title = title;
    if(description) camp.description = description;
    if(campType) camp.campType = campType;

    if(departments) camp.departments = departments;
    if(services) camp.services = services;

    // Doctors update
    if(doctors){

      const parsedDoctors =
        typeof doctors === "string"
        ? JSON.parse(doctors)
        : doctors;

      camp.doctors = parsedDoctors.map(doc=>({

        doctor:doc.doctorId || null,

        doctorName:doc.doctorName,

        specialization:doc.specialization

      }));

    }

    // Location update
    if(addressLine || city || state || pincode || latitude || longitude){

      camp.location = {

        addressLine: addressLine || camp.location.addressLine,

        city: city || camp.location.city,

        state: state || camp.location.state,

        pincode: pincode || camp.location.pincode,

        geo:{
          type:"Point",
          coordinates:[
            Number(longitude || camp.location.geo.coordinates[0]),
            Number(latitude || camp.location.geo.coordinates[1])
          ]
        }

      };

    }

    if(startDate) camp.startDate = startDate;
    if(endDate) camp.endDate = endDate;

    if(startTime) camp.startTime = startTime;
    if(endTime) camp.endTime = endTime;

    if(registrationDeadline) camp.registrationDeadline = registrationDeadline;

    if(maxParticipants) camp.maxParticipants = maxParticipants;

    if(registrationRequired !== undefined)
      camp.registrationRequired = registrationRequired;

    if(contactNumber) camp.contactNumber = contactNumber;

    if(isFree !== undefined) camp.isFree = isFree;

    if(campFee !== undefined) camp.campFee = campFee;

    // Poster update
    if(req.file){

      const posterImage =
        await uploadCampPosterService(
          req.file,
          hospital._id
        );

      camp.posterImage = posterImage;

    }

    await camp.save();

    return res.status(200).json({

      success:true,

      message:"Camp updated successfully",

      camp

    });

  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"Failed to update camp",
      error:error.message

    });

  }
};




export const updateCampStatus = async (req,res)=>{
  try{

    const userId = req.user._id;
    const { campId } = req.params;
    const { status } = req.body; // published | completed | cancelled

    const hospital = await HospitalProfile.findOne({
      user:userId
    }).select("_id verificationStatus");

    if(!hospital){
      return res.status(404).json({
        success:false,
        message:"Hospital profile not found"
      });
    }

    const camp = await HealthcareCamp.findOne({
      _id:campId,
      hospital:hospital._id
    });

    if(!camp){
      return res.status(404).json({
        success:false,
        message:"Camp not found"
      });
    }

    // Allowed transitions
    const allowedStatuses = [
      "published",
      "completed",
      "cancelled"
    ];

    if(!allowedStatuses.includes(status)){
      return res.status(400).json({
        success:false,
        message:"Invalid status"
      });
    }

    // Publish validation
    if(status === "published"){

      if(camp.status !== "draft"){
        return res.status(400).json({
          success:false,
          message:"Only draft camps can be published"
        });
      }

      if(!camp.title || !camp.startDate || !camp.startTime){
        return res.status(400).json({
          success:false,
          message:"Complete camp details before publishing"
        });
      }

      if(!camp.location?.geo?.coordinates){
        return res.status(400).json({
          success:false,
          message:"Camp location required"
        });
      }

      camp.status = "published";
    }

    // Complete validation
    if(status === "completed"){

      if(
        camp.status !== "published" &&
        camp.status !== "ongoing"
      ){
        return res.status(400).json({
          success:false,
          message:"Only active camps can be completed"
        });
      }

      camp.status = "completed";
    }

    // Cancel validation
    if(status === "cancelled"){

      if(camp.status === "completed"){
        return res.status(400).json({
          success:false,
          message:"Completed camp cannot be cancelled"
        });
      }

      camp.status = "cancelled";
    }

    await camp.save();

    return res.status(200).json({

      success:true,

      message:`Camp ${status} successfully`,

      status:camp.status

    });

  }
  catch(error){

    return res.status(500).json({

      success:false,

      message:"Failed to update camp status",

      error:error.message

    });

  }
};