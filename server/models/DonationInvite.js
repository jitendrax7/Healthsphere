import mongoose from "mongoose";
import { INVITE_STATUS, INVITE_TYPE } from "../constants/inviteStatus.js";

const donationInviteSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalProfile",
      required: true,
    },

    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonorProfile",
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: Object.values(INVITE_STATUS),
      default: INVITE_STATUS.PENDING,
    },

    inviteType: {
      type: String,
      enum: Object.values(INVITE_TYPE),
      default: INVITE_TYPE.AUTO,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

donationInviteSchema.index({ donor: 1 });
donationInviteSchema.index({ request: 1 });
donationInviteSchema.index({ status: 1 });
donationInviteSchema.index({ expiresAt: 1 });

export default mongoose.model("DonationInvite", donationInviteSchema);
