import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "INVITE_RECEIVED",
        "INVITE_ACCEPTED",
        "INVITE_DECLINED",
        "INVITE_EXPIRED",
        "REQUEST_MATCHED",
        "REQUEST_FULFILLED",
        "REQUEST_EXPIRED",
        "ELIGIBILITY_RESTORED",
        "GENERAL",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    data: {
      requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BloodRequest",
        default: null,
      },
      inviteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DonationInvite",
        default: null,
      },
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
