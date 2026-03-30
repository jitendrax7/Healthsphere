import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

  
    mode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    userLocation: {
      city: String,
      latitude: Number,
      longitude: Number,
    },

  
    doctorLocation: {
      clinicName: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      latitude: Number,
      longitude: Number,
    },

    reason: String,

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "rejected"],
      default: "pending",
    },

    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    cancelledByRole: {
      type: String,
      enum: ["user", "doctor", "admin"],
      default: null
    },

    cancellationRemark: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null
    },

    actions: [
      {
        action: {
          type: String,
          enum: ["created", "confirmed", "cancelled", "completed", "rejected"],
          required: true
        },

        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        role: {
          type: String,
          enum: ["user", "doctor", "admin"],
          required: true
        },

        remark: {
          type: String,
          trim: true,
          maxlength: 300,
          default: null
        },

        time: {
          type: Date,
          default: Date.now,
          immutable: true
        }
      }
    ]

  },
  { timestamps: true }
);


const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;