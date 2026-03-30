import mongoose from "mongoose";
import Appointment from "../../models/Appointment.js";
import DoctorProfile from "../../models/DoctorProfile.js";
import User from "../../models/User.js";



export const getUserAppointmentHistory = async (req, res) => {

  try {
    const userId = req.user._id;

    const last24Hours = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    const appointments = await Appointment.find({
      user: userId,
      $or: [
        { status: "completed" },
        {
          status: { $in: ["cancelled", "rejected"] },
          actions: {
            $elemMatch: {
              action: { $in: ["cancelled", "rejected"] },
              time: { $lt: last24Hours }
            }
          }
        }
      ]
    })
      .populate("doctor", "Name email location")
      .sort({ appointmentDate: -1 });

    const formatted = appointments.map(a => ({
      id: a._id,
      doctorName: a.doctor?.Name || "Unknown",
      doctorCity:
        a.doctor?.location?.city ||
        "Not Available",
      date: a.appointmentDate,
      time:
        `${a.startTime} - ${a.endTime}`,
      mode: a.mode,
      status:
        a.status.charAt(0).toUpperCase() +
        a.status.slice(1)
    }));

    res.status(200).json({
      count: formatted.length,
      appointments: formatted
    });

  }
  catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};



export const getUserAppointmentDetails = async (req, res) => {

  try {
    const userId = req.user._id;
    const { id } = req.params;

    const appointment = await Appointment
      .findById(id)
      .populate(
        "doctor",
        "Name email location profilePhoto"
      )
      .populate(
        "actions.performedBy",
        "Name email"
      );

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }


    if (appointment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized"
      });

    }


    const doctorProfile = await DoctorProfile.findOne({
      user: appointment.doctor._id
    })
      .select("clinicLocation")
      .lean();


    const clinicLocation = {
      clinicName:
        appointment.doctorLocation?.clinicName
        || doctorProfile?.clinicLocation?.clinicName,

      addressLine:
        appointment.doctorLocation?.addressLine
        || doctorProfile?.clinicLocation?.addressLine,

      city:
        appointment.doctorLocation?.city
        || doctorProfile?.clinicLocation?.city,

      state:
        appointment.doctorLocation?.state
        || doctorProfile?.clinicLocation?.state,

      pincode:
        appointment.doctorLocation?.pincode
        || doctorProfile?.clinicLocation?.pincode,

      latitude:
        appointment.doctorLocation?.latitude
        || doctorProfile?.clinicLocation?.latitude
        || null,

      longitude:
        appointment.doctorLocation?.longitude
        || doctorProfile?.clinicLocation?.longitude
        || null

    };



    const formatted = {
      id: appointment._id,
      doctor: {
        name: appointment.doctor?.Name,
        email: appointment.doctor?.email,
        image:
          appointment.doctor?.profilePhoto
          || "https://static.vecteezy.com/system/resources/previews/027/298/490/non_2x/doctor-posing-portrait-free-photo.jpg",
        city: appointment.doctor?.location?.city
      },

      appointmentDate: appointment.appointmentDate,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      mode: appointment.mode,
      status: appointment.status,
      reason: appointment.reason,
      cancelledBy: appointment.cancelledByRole,
      cancellationRemark: appointment.cancellationRemark,
      userLocation: appointment.userLocation,
      doctorLocation: clinicLocation,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      actions: appointment.actions
        .sort((a, b) => a.time - b.time)
        .map(act => ({
          action: act.action,
          role: act.role,
          performedBy: act.performedBy?.Name,
          remark: act.remark,
          time: act.time
        }))
    };

    res.status(200).json(formatted);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};



export const getUserAppointments = async (req, res) => {

  try {
    const userId = req.user._id;
    const last24Hours = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    );

    const appointments = await Appointment.find({
      user: userId,
      $or: [
        {
          status: {
            $nin: [
              "completed",
              "cancelled",
              "rejected"
            ]
          }
        },
        {
          status: {
            $in: [
              "cancelled",
              "rejected"
            ]
          },
          actions: {
            $elemMatch: {
              action: {
                $in: [
                  "cancelled",
                  "rejected"
                ]
              },
              time: { $gte: last24Hours }
            }
          }
        }
      ]
    })
      .populate("doctor", "Name email")
      .sort({ appointmentDate: -1 });

    const formatted = appointments.map(a => {
      const lastAction = a.actions
        .filter(act =>
          act.action === "cancelled" ||
          act.action === "rejected"
        )
        .sort((a, b) => b.time - a.time)[0];

      return {
        id: a._id,
        doctorName:
          a.doctor?.Name ||
          "Unknown",
        date: a.appointmentDate,
        time:
          `${a.startTime} - ${a.endTime}`,
        mode: a.mode,
        status:
          a.status.charAt(0).toUpperCase() +
          a.status.slice(1),

        cancellationSummary:
          (
            a.status === "cancelled" ||
            a.status === "rejected"
          )
            ?
            {
              by:
                a.cancelledByRole ||
                lastAction?.role,
              remark:
                a.cancellationRemark ||
                lastAction?.remark ||
                "No reason provided",
              time: lastAction?.time
            }
            :
            null
      };
    });


    res.status(200).json({
      count: formatted.length,
      appointments: formatted
    });

  }
  catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};



export const getAllDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;

    const filter = {
      isBookingEnabled: true,
    };

    if (specialization) {
      filter.specialization = {
        $regex: new RegExp(`^${specialization}$`, "i"),
      };
    }

    const doctorProfiles = await DoctorProfile.find(filter)
      .populate({
        path: "user",
        match: { role: "doctor" },
        select: "Name profilePhoto  location",
      })
      .select(
        "specialization experience consultationFee clinicLocation"
      );

    const filteredDoctors = doctorProfiles.filter(doc => doc.user);

    const doctors = filteredDoctors.map(doc => ({
      doctorId: doc.user._id,
      name: doc.user.Name,
      image: doc.user.profilePhoto || "",
      specialization: doc.specialization,
      experience: doc.experience,
      consultationFee: doc.consultationFee,
      clinic: {
        clinicName: doc.clinicLocation?.clinicName || null,
        city: doc.clinicLocation?.city || null,
      }
    }));

    res.status(200).json({
      count: doctors.length,
      doctors,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


export const getDoctorDetails = async (req, res) => {

  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor id"
      });
    }


    const [doctor, profile] = await Promise.all([
      User.findById(id)
        .select(`Name profilePhoto location role `)
        .lean(),
      DoctorProfile.findOne({ user: id })
        .populate({
          path: "hospital",
          select: "hospitalName"
        })
        .select(`specialization qualifications totalExperience consultationFee hospital bio clinicLocation availableDays availability consultationMode languages servicesOffered rating reviewCount isBookingEnabled`)
        .lean()
    ]);


    if (!doctor || doctor.role !== "doctor") {

      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }


    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found"
      });
    }


    return res.status(200).json({
      success: true,
      doctor: {
        id: doctor._id,
        name: doctor.Name,
        profilePhoto: doctor.profilePhoto || null,
        city: doctor.location?.city || null,
        rating: profile.rating || 0,
        reviewCount: profile.reviewCount || 0
      },
      // Professional info
      professional: {
        specialization:
          profile.specialization || null,

        experience:
          profile.totalExperience || 0,

        consultationFee:
          profile.consultationFee || 0,

        consultationMode:
          profile.consultationMode || "offline",

        hospital:
          profile.hospital?.hospitalName || null,

        bio:
          profile.bio || ""

      },


      // Education

      qualifications:
        profile.qualifications || [],
      // Languages
      languages:
        profile.languages || [],

      // Services
      services:
        profile.servicesOffered || [],
      // Clinic info
      clinic: {
        clinicName:
          profile.clinicLocation?.clinicName || null,
        address:
          profile.clinicLocation?.addressLine || null,
        city:
          profile.clinicLocation?.city || null,
        state:
          profile.clinicLocation?.state || null,
        pincode:
          profile.clinicLocation?.pincode || null,
        latitude:
          profile.clinicLocation?.latitude || null,
        longitude:
          profile.clinicLocation?.longitude || null
      },

      // Availability
      availability: {
        availableDays:
          profile.availableDays || [],
        startTime:
          profile.availability?.startTime || null,
        endTime:
          profile.availability?.endTime || null,
        slotDuration:
          profile.availability?.slotDuration || 30,
        bookingEnabled:
          profile.isBookingEnabled || false
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





export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const selectedDate = new Date(date);


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    if (startOfDay < today) {
      return res.status(400).json({ message: "Cannot book past dates" });
    }

    const dayName = startOfDay.toLocaleDateString("en-US", {
      weekday: "long",
    });

    const doctor = await DoctorProfile.findOne({ user: doctorId });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctor.availableDays.includes(dayName)) {
      return res.json({ availableSlots: [] });
    }

    const { startTime, endTime } = doctor.availability;

    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const fromMinutes = (minutes) => {
      const h = Math.floor(minutes / 60)
        .toString()
        .padStart(2, "0");
      const m = (minutes % 60).toString().padStart(2, "0");
      return `${h}:${m}`;
    };

    const doctorStart = toMinutes(startTime);
    const doctorEnd = toMinutes(endTime);


    const appointments = await Appointment.find({
      doctor: doctorId,
      appointmentDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      status: { $in: ["pending", "confirmed"] },
    });

    const booked = appointments
      .map((a) => ({
        start: toMinutes(a.startTime),
        end: toMinutes(a.endTime),
      }))
      .sort((a, b) => a.start - b.start);

    let availableSlots = [];
    let currentStart = doctorStart;

    for (let slot of booked) {
      if (slot.start > currentStart) {
        availableSlots.push({
          startTime: fromMinutes(currentStart),
          endTime: fromMinutes(slot.start),
        });
      }
      currentStart = Math.max(currentStart, slot.end);
    }

    if (currentStart < doctorEnd) {
      availableSlots.push({
        startTime: fromMinutes(currentStart),
        endTime: fromMinutes(doctorEnd),
      });
    }

    return res.json({ availableSlots });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};




export const createAppointment = async (req, res) => {
  try {
    const userId = req.user._id;

    // const {
    //   doctorId,
    //   appointmentDate,
    //   startTime,
    //   endTime,
    //   mode,
    //   reason,
    // } = req.body;
    const {
      doctorId,
      date,
      startTime,
      endTime,
      mode,
      reason,
    } = req.body;

    if (!doctorId || !date || !startTime || !endTime || !mode) {
      return res.status(400).json({
        message: "Doctor, date, time and mode are required",
      });
    }

    if (!["online", "offline"].includes(mode)) {
      return res.status(400).json({
        message: "Mode must be online or offline",
      });
    }

    const doctorUser = await User.findById(doctorId);

    if (!doctorUser || doctorUser.role !== "doctor") {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const doctorProfile = await DoctorProfile.findOne({ user: doctorId });

    if (!doctorProfile) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    const selectedDate = new Date(date);

    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (!doctorProfile.availableDays.includes(dayName)) {
      return res.status(400).json({
        message: "Doctor is not available on this day",
      });
    }

    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const doctorStart = toMinutes(doctorProfile.availability.startTime);
    const doctorEnd = toMinutes(doctorProfile.availability.endTime);

    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    if (newStart < doctorStart || newEnd > doctorEnd || newStart >= newEnd) {
      return res.status(400).json({
        message: "Selected time is outside doctor's availability",
      });
    }

    const existing = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: selectedDate,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This time range is already booked",
      });
    }

    const user = await User.findById(userId);

    const userLocation = user?.location || null;

    let doctorLocation = null;

    if (mode === "offline") {
      if (!doctorProfile.clinicLocation) {
        return res.status(400).json({
          message: "Doctor clinic location not available",
        });
      }

      doctorLocation = doctorProfile.clinicLocation;
    } else {
      doctorLocation = doctorUser?.location || null;
    }

    const appointment = await Appointment.create({
      user: userId,
      doctor: doctorId,
      appointmentDate: selectedDate,
      startTime,
      endTime,
      mode,
      reason,
      userLocation,
      doctorLocation,
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};






export const cancelAppointmentByUser = async (req, res) => {

  try {

    const userId = req.user._id;

    const { appointmentId, remark } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    if (
      appointment.status === "completed" ||
      appointment.status === "cancelled" ||
      appointment.status === "rejected"
    ) {
      return res.status(400).json({
        message: `Cannot cancel appointment with status ${appointment.status}`
      });
    }

    const now = new Date();

    if (appointment.appointmentDate < now) {
      return res.status(400).json({
        message: "Cannot cancel past appointment"
      });
    }

    appointment.status = "cancelled";

    appointment.cancelledBy = userId;

    appointment.cancelledByRole = "user";

    appointment.cancellationRemark = remark || "Cancelled by user";

    appointment.actions.push({
      action: "cancelled",
      performedBy: userId,
      role: "user",
      remark: remark || "Cancelled by user"
    });

    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully"
    });

  }
  catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};