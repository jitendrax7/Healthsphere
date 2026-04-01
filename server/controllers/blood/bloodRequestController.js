import BloodRequest from "../../models/BloodRequest.js";
import HospitalProfile from "../../models/HospitalProfile.js";
import DonorProfile from "../../models/DonorProfile.js";
import User from "../../models/User.js";
import * as matchingService from "../../services/blood/matchingService.js";
import * as inviteService from "../../services/blood/inviteService.js";
import * as notificationService from "../../services/blood/notificationService.js";
import { REQUEST_STATUS, TERMINAL_REQUEST_STATUSES } from "../../constants/requestStatus.js";

const ACTIVE_REQUEST_STATUSES = [
  REQUEST_STATUS.OPEN,
  REQUEST_STATUS.MATCHING,
  REQUEST_STATUS.PARTIAL,
];

const maskAnonymousDonor = (donor) => ({
  donorId: donor._id,
  bloodGroup: donor.bloodGroup,
  distance: donor.distance,
  nextEligibleDate: donor.nextEligibleDate,
  totalDonations: donor.donationStats?.totalDonations ?? 0,
  emergencyAvailable: donor.emergencyAvailable,
});

const createBloodRequest = async (req, res) => {
  try {
    const hospital = await HospitalProfile.findOne({ user: req.user._id });
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital profile not found" });
    }

    const hospitalGeo = hospital.location?.geo?.coordinates;
    if (!hospitalGeo || hospitalGeo.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Hospital geo location is not set. Please update your hospital profile with a valid location before creating a blood request.",
      });
    }

    const {
      patientName,
      bloodGroup,
      unitsRequired,
      urgencyLevel,
      disease,
      patientAge,
      contactPerson,
      contactNumber,
      requiredBeforeDate,
      notes,
    } = req.body;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const bloodRequest = await BloodRequest.create({
      hospital: hospital._id,
      patientName,
      bloodGroup,
      unitsRequired,
      urgencyLevel: urgencyLevel ?? "NORMAL",
      disease,
      patientAge,
      contactPerson,
      contactNumber,
      requiredBeforeDate: requiredBeforeDate ?? null,
      expiresAt,
      notes,
      location: {
        addressLine: hospital.location?.addressLine,
        city: hospital.location?.city,
        state: hospital.location?.state,
        pincode: hospital.location?.pincode,
        geoLocation: {
          type: "Point",
          coordinates: hospitalGeo,
        },
      },
      status: REQUEST_STATUS.OPEN,
    });

    let matchedCount = 0;

    try {
      const eligibleDonors = await matchingService.findEligibleDonors(bloodRequest._id);

      if (eligibleDonors.length > 0) {
        const donorIds = eligibleDonors.map((d) => d._id);
        const invites = await inviteService.bulkInvite(
          bloodRequest._id,
          donorIds,
          hospital._id
        );

        matchedCount = invites.length;

        const notifyPromises = eligibleDonors.slice(0, invites.length).map(async (donor, i) => {
          try {
            await notificationService.notifyDonorInvite(donor.user, invites[i], bloodRequest);
          } catch {
          }
        });

        await Promise.allSettled(notifyPromises);
      }
    } catch (matchError) {
      console.warn("Matching phase warning:", matchError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Blood request created successfully",
      data: {
        request: bloodRequest,
        matchedDonors: matchedCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getHospitalRequests = async (req, res) => {
  try {
    const hospital = await HospitalProfile.findOne({ user: req.user._id });
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital profile not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const statusFilter = req.query.status;
    const skip = (page - 1) * limit;

    const query = { hospital: hospital._id };
    if (statusFilter) {
      query.status = statusFilter;
    }

    const [requests, total] = await Promise.all([
      BloodRequest.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BloodRequest.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const getMatchedDonors = async (req, res) => {
  try {
    const hospital = await HospitalProfile.findOne({ user: req.user._id });
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital profile not found" });
    }

    const { id: requestId } = req.params;

    const request = await BloodRequest.findOne({
      _id: requestId,
      hospital: hospital._id,
    }).lean();

    if (!request) {
      return res.status(404).json({ success: false, message: "Blood request not found" });
    }

    if(
        request.status==="COMPLETED" ||
        request.status==="CANCELLED" ||
        request.status==="EXPIRED"
      ){
        return res.status(400).json({
        success:false,
        message:`Cannot match donors for ${request.status} request`

      });
    }

    const donors = await matchingService.findEligibleDonors(requestId);
    console.log("doners:", donors)
    const maskedDonors = await Promise.all(
      donors.map(async (donor) => {
        if (donor.isAnonymous) {
          return maskAnonymousDonor(donor);
        }

        const user = await User.findById(donor.user)
          .select("Name email phoneNumber")
          .lean();

        return {
          donorId: donor._id,
          bloodGroup: donor.bloodGroup,
          distance: donor.distance,
          nextEligibleDate: donor.nextEligibleDate,
          totalDonations: donor.donationStats?.totalDonations ?? 0,
          emergencyAvailable: donor.emergencyAvailable,
          name: user?.Name,
          email: user?.email,
          phone: user?.phoneNumber,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        requestId,
        totalMatched: maskedDonors.length,
        donors: maskedDonors,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const closeRequest = async (req,res)=>{
 try{
  const hospital = await HospitalProfile.findOne({
   user:req.user._id
  });


  if(!hospital){

   return res.status(404).json({
    success:false,
    message:"Hospital profile not found"
   });

  }

  const {id:requestId}=req.params;

  if(!requestId){

   return res.status(400).json({
    success:false,
    message:"Request id required"
   });

  }

  const request = await BloodRequest.findOne({

   _id:requestId,
   hospital:hospital._id

  });

  if(!request){

   return res.status(404).json({
    success:false,
    message:"Request not found"
   });

  }

  // prevent cancel if already terminal
  if(TERMINAL_REQUEST_STATUSES.includes(request.status)){

   return res.status(400).json({
    success:false,
    message:"Request already closed"
   });

  }

  if(request.unitsFulfilled >= request.unitsRequired){

   request.status=REQUEST_STATUS.COMPLETED;

   await request.save();

   return res.status(400).json({

    success:false,

    message:"Request already completed"

   });

  }

  request.status=REQUEST_STATUS.CANCELLED;

  await request.save();

  return res.status(200).json({

   success:true,

   message:"Blood request cancelled",

   data:{
    requestId:request._id,
    status:request.status
   }

  });

 }
 catch(error){

  return res.status(500).json({

   success:false,

   message:error.message

  });

 }

};

const STATUS_FLOW = {

  OPEN:["MATCHING","CANCELLED","EXPIRED"],

  MATCHING:["PARTIAL","CANCELLED","EXPIRED"],

  PARTIAL:["CANCELLED","EXPIRED"],

  COMPLETED:[],

  CANCELLED:[],

  EXPIRED:[]
  
};

const updateStatus = async (req,res)=>{

 try{

  const hospital = await HospitalProfile.findOne({
   user:req.user._id
  });

  if(!hospital){

   return res.status(404).json({
    success:false,
    message:"Hospital profile not found"
   });

  }

  const {requestId,status}=req.body;

  if(!requestId || !status){

   return res.status(400).json({
    success:false,
    message:"requestId and status required"
   });

  }

  if(!Object.values(REQUEST_STATUS).includes(status)){

   return res.status(400).json({
    success:false,
    message:"Invalid status"
   });

  }

  const request = await BloodRequest.findOne({

   _id:requestId,
   hospital:hospital._id

  });

  if(!request){

   return res.status(404).json({
    success:false,
    message:"Blood request not found"
   });

  }

  if(
   request.status==="COMPLETED" ||
   request.status==="CANCELLED" ||
   request.status==="EXPIRED"
  ){

   return res.status(400).json({
    success:false,
    message:"Request already finalized"
   });

  }

  // auto completion check
  if(request.unitsFulfilled >= request.unitsRequired){

   request.status="COMPLETED";

   await request.save();

   return res.status(200).json({

    success:true,

    message:"Request automatically completed",

    data:{
     requestId:request._id,
     status:request.status
    }

   });

  }

  const allowedTransitions = STATUS_FLOW[request.status];

  if(!allowedTransitions.includes(status)){

   return res.status(400).json({

    success:false,

    message:`Cannot change ${request.status} to ${status}`

   });

  }

  // partial auto check
  if(request.unitsFulfilled>0){

   request.status="PARTIAL";

  }
  else{

   request.status=status;

  }

  await request.save();

  return res.status(200).json({

   success:true,

   message:"Status updated",

   data:{
    requestId:request._id,
    status:request.status
   }

  });

 }
 catch(error){

  return res.status(500).json({

   success:false,

   message:error.message

  });

 }

};

const getCommunityFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("location").lean();

    const lat = parseFloat(req.query.lat) || user?.location?.latitude;
    const lng = parseFloat(req.query.lng) || user?.location?.longitude;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Location not available. Please update your profile location or pass ?lat=&lng= query params.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const maxDistanceKm = parseFloat(req.query.maxDistance) || 50;
    const maxDistanceMeters = maxDistanceKm * 1000;
    const bloodGroupFilter = req.query.bloodGroup;
    const urgencyFilter = req.query.urgencyLevel;
    const skip = (page - 1) * limit;

    const matchFilter = {
      status: { $in: ACTIVE_REQUEST_STATUSES },
    };

    if (bloodGroupFilter) {
      matchFilter.bloodGroup = bloodGroupFilter;
    }

    if (urgencyFilter) {
      matchFilter.urgencyLevel = urgencyFilter;
    }

    const pipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distanceFromUser",
          maxDistance: maxDistanceMeters,
          spherical: true,
          query: matchFilter,
          key: "location.geoLocation",
        },
      },
      {
        $lookup: {
          from: "hospitalprofiles",
          localField: "hospital",
          foreignField: "_id",
          as: "hospitalInfo",
          pipeline: [
            {
              $project: {
                hospitalName: 1,
                contactNumber: 1,
                emergencyNumber: 1,
                "location.city": 1,
                "location.addressLine": 1,
                "location.state": 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$hospitalInfo",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $project: {
          _id: 1,
          bloodGroup: 1,
          unitsRequired: 1,
          unitsFulfilled: 1,
          urgencyLevel: 1,
          status: 1,
          patientName: 1,
          disease: 1,
          requiredBeforeDate: 1,
          expiresAt: 1,
          matchedDonorsCount: 1,
          acceptedDonorsCount: 1,
          notes: 1,
          "location.city": 1,
          "location.addressLine": 1,
          "location.state": 1,
          distanceFromUser: 1,
          hospital: "$hospitalInfo",
          createdAt: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ];

    const countPipeline = [
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distanceFromUser",
          maxDistance: maxDistanceMeters,
          spherical: true,
          query: matchFilter,
          key: "location.geoLocation",
        },
      },
      { $count: "total" },
    ];

    const [requests, countResult] = await Promise.all([
      BloodRequest.aggregate(pipeline),
      BloodRequest.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total ?? 0;

    return res.status(200).json({
      success: true,
      data: {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        userLocation: { latitude: lat, longitude: lng },
        searchRadiusKm: maxDistanceKm,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createBloodRequest,
  getHospitalRequests,
  getMatchedDonors,
  closeRequest,
  updateStatus,
  getCommunityFeed,
};
