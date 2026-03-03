import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";
import User from "../models/User.js";



export const getUserAppointmentHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const appointments = await Appointment.find({
      user: userId,
      status: { $in: ["rejected", "completed"] },
    })
      .populate("doctor", "Name email location")
      .sort({ appointmentDate: -1 });

    const formatted = appointments.map((a) => ({
      id: a._id,
      doctorName: a.doctor?.Name || "Unknown",
      doctorCity: a.doctor?.location?.city || "Not Available",
      appointmentDate: a.appointmentDate,
      startTime: a.startTime,
      endTime: a.endTime,
      mode: a.mode,
      status:
        a.status.charAt(0).toUpperCase() + a.status.slice(1),
      reason: a.reason,
    }));

    res.status(200).json({
      count: formatted.length,
      appointments: formatted,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


export const getAllDoctors = async (req, res) => {
  try {
    const { specialization } = req.query;

    // ✅ Build filter
    const filter = {
      isBookingEnabled: true,
    };

    if (specialization) {
      filter.specialization = {
        $regex: new RegExp(`^${specialization}$`, "i"),
      };
    }

    // ✅ Get doctor profiles directly
    const doctorProfiles = await DoctorProfile.find(filter)
      .populate({
        path: "user",
        match: { role: "doctor" },
        select: "Name email phoneNumber location",
      })
      .select(
        "specialization experience consultationFee clinicLocation"
      );

    // Remove null users (safety check)
    const filteredDoctors = doctorProfiles.filter(doc => doc.user);

    // ✅ Format response cleanly
    const doctors = filteredDoctors.map(doc => ({
      doctorId: doc.user._id,
      name: doc.user.Name,
      email: doc.user.email,
      phoneNumber: doc.user.phoneNumber,

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

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const selectedDate = new Date(date);

    // ❌ Prevent past booking
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

    const { startTime, endTime } = doctor.availableTime;

    // Convert HH:mm → minutes
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

    // ✅ FIXED QUERY (Date Range)
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


/* ======================================================
   CREATE APPOINTMENT (USER)
====================================================== */
// import Appointment from "../models/Appointment.js";
// import DoctorProfile from "../models/DoctorProfile.js";
// import User from "../models/User.js";



export const createAppointment = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      doctorId,
      appointmentDate,
      startTime,
      endTime,
      mode,
      reason,
    } = req.body;

    if (!doctorId || !appointmentDate || !startTime || !endTime || !mode) {
      return res.status(400).json({
        message: "Doctor, date, time and mode are required",
      });
    }

    if (!["online", "offline"].includes(mode)) {
      return res.status(400).json({
        message: "Mode must be online or offline",
      });
    }

    // ✅ Check doctor exists
    const doctorUser = await User.findById(doctorId);

    if (!doctorUser || doctorUser.role !== "doctor") {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    // ✅ Get doctor profile
    const doctorProfile = await DoctorProfile.findOne({ user: doctorId });

    if (!doctorProfile) {
      return res.status(404).json({
        message: "Doctor profile not found",
      });
    }

    const selectedDate = new Date(appointmentDate);

    const dayName = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
    });

    // ❌ Doctor not working that day
    if (!doctorProfile.availableDays.includes(dayName)) {
      return res.status(400).json({
        message: "Doctor is not available on this day",
      });
    }

    // 🔢 Convert time to minutes
    const toMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const doctorStart = toMinutes(doctorProfile.availableTime.startTime);
    const doctorEnd = toMinutes(doctorProfile.availableTime.endTime);

    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    // ❌ Check inside availability
    if (newStart < doctorStart || newEnd > doctorEnd || newStart >= newEnd) {
      return res.status(400).json({
        message: "Selected time is outside doctor's availability",
      });
    }

    // 🔥 Prevent overlapping
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

    // ✅ Get user location snapshot
    const user = await User.findById(userId);

    const userLocation = user?.location || null;

    // ✅ Doctor location snapshot
    let doctorLocation = null;

    if (mode === "offline") {
      if (!doctorProfile.clinicLocation) {
        return res.status(400).json({
          message: "Doctor clinic location not available",
        });
      }

      doctorLocation = doctorProfile.clinicLocation;
    } else {
      // Online → basic location only
      doctorLocation = doctorUser?.location || null;
    }

    // ✅ Create appointment
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

export const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { status } = req.query;

    const filter = { doctor: doctorId };

    if (status) {
      const statuses = status
        .split(",")
        .map((s) => s.trim().toLowerCase());

      filter.status = { $in: statuses };
    }

    const appointments = await Appointment.find(filter)
      .populate("user", "Name email location")
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      count: appointments.length,
      appointments,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};




export const updateAppointmentStatus = async (req, res) => {
  try {
    const doctorId = req.user._id;
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!["confirmed", "rejected", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }

    if (appointment.doctor.toString() !== doctorId.toString()) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: "Appointment updated",
      appointment
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


/* ======================================================
   GET USER APPOINTMENTS
====================================================== */

export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user._id;

    const appointments = await Appointment.find({
      user: userId,
      status: { $nin: ["completed", "rejected"] }, // ❌ exclude these
    })
      .populate("doctor", "Name email")
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      count: appointments.length,
      appointments,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};