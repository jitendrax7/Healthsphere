import mongoose from "mongoose";
import { BLOOD_GROUPS } from "../constants/bloodGroups.js";
import { REQUEST_STATUS } from "../constants/requestStatus.js";

const bloodRequestSchema = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalProfile",
      required: true,
    },

    patientName: String,

    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: true,
    },

    unitsRequired: {
      type: Number,
      required: true,
    },

    unitsFulfilled: {
      type: Number,
      default: 0,
    },

    urgencyLevel: {
      type: String,
      enum: ["NORMAL", "URGENT", "CRITICAL"],
      default: "NORMAL",
    },

    disease: String,

    patientAge: Number,

    contactPerson: String,

    contactNumber: String,

    requiredBeforeDate: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
    },

    location: {
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      geoLocation: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          default: undefined,
        },
      },
    },

    matchedDonorsCount: {
      type: Number,
      default: 0,
    },

    acceptedDonorsCount: {
      type: Number,
      default: 0,
    },

    matchedDonors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DonorProfile",
      },
    ],

    donorsResponded: [
      {
        donor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "DonorProfile",
        },
        status: {
          type: String,
          enum: ["interested", "donated", "not_available"],
        },
      },
    ],

    status: {
      type: String,
      enum: Object.values(REQUEST_STATUS),
      default: REQUEST_STATUS.OPEN,
    },

    notes: String,
  },
  { timestamps: true }
);

bloodRequestSchema.index({ hospital: 1 });
bloodRequestSchema.index({ status: 1 });
bloodRequestSchema.index({ bloodGroup: 1 });
bloodRequestSchema.index({ "location.geoLocation": "2dsphere" });
bloodRequestSchema.index({ expiresAt: 1 });

export default mongoose.model("BloodRequest", bloodRequestSchema);