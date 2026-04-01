import mongoose from "mongoose";
import { BLOOD_GROUPS } from "../constants/bloodGroups.js";

const donorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: true,
    },

    age: {
      type: Number,
      required: true,
      min: 18,
      max: 65,
    },

    weight: {
      type: Number,
      required: true,
      min: 45,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isAnonymous: {
      type: Boolean,
      default: false,
    },

    maxDistance: {
      type: Number,
      default: 15,
    },

    emergencyAvailable: {
      type: Boolean,
      default: true,
    },

    lastDonationDate: {
      type: Date,
      default: null,
    },

    nextEligibleDate: {
      type: Date,
      default: null,
    },

    medicalInfo: {
      diseases: {
        type: [String],
        default: [],
      },
      medications: {
        type: [String],
        default: [],
      },
    },

    donationStats: {
      totalDonations: {
        type: Number,
        default: 0,
      },
      successfulDonations: {
        type: Number,
        default: 0,
      },
      cancelledDonations: {
        type: Number,
        default: 0,
      },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    status: {
      type: String,
      enum: ["ACTIVE", "PAUSED", "BLOCKED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

donorProfileSchema.index({ bloodGroup: 1 });
donorProfileSchema.index({ location: "2dsphere" });
donorProfileSchema.index({ isAvailable: 1 });
donorProfileSchema.index({ nextEligibleDate: 1 });

export default mongoose.model("DonorProfile", donorProfileSchema);
