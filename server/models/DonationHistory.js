import mongoose from "mongoose";
import { BLOOD_GROUPS } from "../constants/bloodGroups.js";

const donationHistorySchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonorProfile",
      required: true,
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalProfile",
      required: true,
    },

    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: true,
    },

    unitsDonated: {
      type: Number,
      required: true,
      min: 1,
    },

    donationDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["SCHEDULED", "COMPLETED", "FAILED"],
      default: "SCHEDULED",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

donationHistorySchema.index({ donor: 1, donationDate: -1 });
donationHistorySchema.index({ hospital: 1 });
donationHistorySchema.index({ request: 1 });

export default mongoose.model("DonationHistory", donationHistorySchema);
