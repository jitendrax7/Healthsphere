import mongoose from "mongoose";
import Appointment from "../../models/Appointment.js";

export const getDoctorAnalytics = async (req, res) => {

  try {

    const doctorId = req.user.id;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      totalAppointments,
      todayConfirmed,
      confirmedCount,
      pendingCount,
      completedCount,
      cancelledCount,
      recentAppointments
    ] = await Promise.all([

      Appointment.countDocuments({
        doctor: doctorId,
        status: {
          $in: ["confirmed", "pending"]
        }
      }),

      Appointment.countDocuments({
        doctor: doctorId,
        status: "confirmed",
        appointmentDate: {
          $gte: todayStart,
          $lte: todayEnd
        }
      }),

      Appointment.countDocuments({
        doctor: doctorId,
        status: "confirmed"
      }),

      Appointment.countDocuments({
        doctor: doctorId,
        status: "pending"
      }),

      Appointment.countDocuments({
        doctor: doctorId,
        status: "completed"
      }),

      Appointment.countDocuments({
        doctor: doctorId,
        status: "cancelled"
      }),

      Appointment.find({
        doctor: doctorId
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "_id Name")
        .select(
          "user appointmentDate startTime endTime status cancelledByRole"
        )
        .lean()
    ]);

    // console.log(recentAppointments);

    res.json({
      totalAppointments,
      todayAppointments: todayConfirmed,
      confirmed: confirmedCount,
      pending: pendingCount,
      completed: completedCount,
      cancelled: cancelledCount,
      recentAppointments: recentAppointments.map(app => ({
        appointmentId: app._id,        // appointment id
        id: app.user?._id,             // user id
        name: app.user?.Name,          // user name
        date: app.appointmentDate,
        startTime: app.startTime,
        endTime: app.endTime,
        status: app.status,
        cancelledByRole: app.cancelledByRole
      }))
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch analytics"
    });
  }
};



export const getDoctorAppointments = async (req, res) => {

  try {
    const doctorId = req.user._id;
    let { status } = req.query;
    const filter = { doctor: doctorId };

    const allowedStatus = [
      "pending",
      "confirmed",
    ];

    if (status !== undefined && status.trim() !== "") {
      const statuses = status
        .split(",")
        .map(s => s.trim().toLowerCase());


      const invalidStatus = statuses.filter(
        s => !allowedStatus.includes(s)
      );


      if (invalidStatus.length) {
        return res.status(400).json({
          message: "Invalid status value",
          invalid: invalidStatus,
          allowed: allowedStatus
        });
      }
      filter.status = { $in: statuses };

    } else {
      filter.status = { $in: allowedStatus };
    }

    const appointments = await Appointment.find(filter)
      .select(
        "_id user appointmentDate startTime endTime status mode cancelledByRole"
      )
      .populate({
        path: "user",
        select: "Name"
      })
      .sort({
        appointmentDate: 1,
        startTime: 1
      })
      .lean();

  

    const formattedAppointments = appointments.map(app => ({
      appointmentId: app._id,
      name: app.user?.Name || "Unknown",
      date: app.appointmentDate,
      startTime: app.startTime,
      endTime: app.endTime,
      mode: app.mode,
      status: app.status,
      cancelledByRole: app.cancelledByRole
    }));

    res.status(200).json({
      count: formattedAppointments.length,
      appointments: formattedAppointments
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};



export const getDoctorAppointmentHistory = async (req, res) => {

  try {

    const doctorId = req.user._id;
    let { status } = req.query;


    const historyStatus = [
      "completed",
      "cancelled",
      "rejected"
    ];

    const filter = {
      doctor: doctorId,
      status: { $in: historyStatus }
    };


    if (status && status.trim() !== "") {
      const statuses = status
        .split(",")
        .map(s => s.trim().toLowerCase());

      const invalid = statuses.filter(
        s => !historyStatus.includes(s)
      );

      if (invalid.length) {
        return res.status(400).json({
          message: "Invalid history status",
          invalid,
          allowed: historyStatus
        });
      }
      filter.status = { $in: statuses };
    }


    const appointments = await Appointment.find(filter)
      .select(
        "_id user appointmentDate startTime endTime status mode cancelledByRole"
      )
      .populate({
        path: "user",
        select: "Name"
      })
      .sort({
        appointmentDate: -1,
        startTime: -1
      })
      .lean();

    const formatted = appointments.map(app => ({
      appointmentId: app._id,
      name: app.user?.Name || "Unknown",
      date: app.appointmentDate,
      startTime: app.startTime,
      endTime: app.endTime,
      mode: app.mode,
      status: app.status,
      cancelledByRole: app.cancelledByRole
    }));

    res.json({
      count: formatted.length,
      appointments: formatted
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};





export const getDoctorAppointmentDetails = async (req, res) => {

  try {
    const doctorId = req.user._id;
    const { appointmentId } = req.params;


    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        message: "Invalid appointment id"
      });
    }

  
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      doctor: doctorId
    })
      .populate({
        path: "user",
        select: "Name email phoneNumber location.city profilePhoto"
      })
      .select(
        "user appointmentDate startTime endTime mode reason status cancelledByRole cancellationRemark userLocation.city doctorLocation.clinicName doctorLocation.city doctorLocation.addressLine"
      )
      .lean();

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found"
      });
    }


    res.json({
      appointmentId: appointment._id,
      user: {
        name: appointment.user?.Name,
        email: appointment.user?.email,
        phone: appointment.user?.phoneNumber,
        profilePhoto: appointment.user?.profilePhoto,
        city: appointment.user?.location?.city   // only city now
      },
      appointmentDetails: {
        date: appointment.appointmentDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        mode: appointment.mode,
        reason: appointment.reason,
        status: appointment.status
      },
      locations: {
        userCity: appointment.userLocation?.city,
        clinicName: appointment.doctorLocation?.clinicName,
        clinicCity: appointment.doctorLocation?.city,
        address: appointment.doctorLocation?.addressLine
      },
      cancellation: {
        cancelledByRole: appointment.cancelledByRole,
        remark: appointment.cancellationRemark
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};






export const updateAppointmentStatus = async (req, res) => {

  try {

    const doctorId = req.user._id;
    const { appointmentId } = req.params;
    const { status, cancellationRemark } = req.body;


    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({
        message: "Invalid appointment id"
      });
    }

    const transitionMap = {
      pending: ["confirmed", "rejected"],
      confirmed: ["completed", "cancelled"],
      rejected: [],
      completed: [],
      cancelled: []
    };

    const allowedStatus = [
      "confirmed",
      "rejected",
      "completed",
      "cancelled"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status"
      });
    }
   
    if(status === "cancelled" && (!cancellationRemark || cancellationRemark.trim() === "")) {

      return res.status(400).json({
        success: false,
        message: "Cancellation remark required when cancelling"
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

    const currentStatus = appointment.status;
    const allowedNext = transitionMap[currentStatus];
    if (!allowedNext.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${currentStatus} to ${status}`,
        allowedTransitions: allowedNext
      });
    }

    appointment.status = status;
    if (status === "cancelled") {
      appointment.cancelledBy = doctorId;
      appointment.cancelledByRole = "doctor";
      appointment.cancellationRemark = cancellationRemark;
    }
    
    appointment.actions.push({
      action: status,
      performedBy: doctorId,
      role: "doctor",
      remark: req.body.remark || null
    });
    await appointment.save();

    res.json({
      message: "Appointment updated",
      status: appointment.status
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};