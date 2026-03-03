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

    // ✅ Mode
    mode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    // ✅ Snapshot of User Location
    userLocation: {
      city: String,
      latitude: Number,
      longitude: Number,
    },

    // ✅ Snapshot of Doctor Location
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
  },
  { timestamps: true }
);


const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;