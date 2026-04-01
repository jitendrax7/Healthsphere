import cron from "node-cron";
import DonationInvite from "../models/DonationInvite.js";
import BloodRequest from "../models/BloodRequest.js";
import DonorProfile from "../models/DonorProfile.js";
import { INVITE_STATUS } from "../constants/inviteStatus.js";
import { REQUEST_STATUS, TERMINAL_REQUEST_STATUSES } from "../constants/requestStatus.js";

const expireOverdueInvites = async () => {
  try {
    const result = await DonationInvite.updateMany(
      {
        status: INVITE_STATUS.PENDING,
        expiresAt: { $lt: new Date() },
      },
      { $set: { status: INVITE_STATUS.EXPIRED } }
    );

    if (result.modifiedCount > 0) {
      console.log(`[BloodJobs] Expired ${result.modifiedCount} overdue invites`);
    }
  } catch (error) {
    console.error("[BloodJobs] Error expiring invites:", error.message);
  }
};

const expireOverdueRequests = async () => {
  try {
    const result = await BloodRequest.updateMany(
      {
        status: { $nin: TERMINAL_REQUEST_STATUSES },
        expiresAt: { $lt: new Date() },
      },
      { $set: { status: REQUEST_STATUS.EXPIRED } }
    );

    if (result.modifiedCount > 0) {
      console.log(`[BloodJobs] Expired ${result.modifiedCount} overdue blood requests`);
    }
  } catch (error) {
    console.error("[BloodJobs] Error expiring blood requests:", error.message);
  }
};

const updateDonorEligibility = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await DonorProfile.updateMany(
      {
        nextEligibleDate: { $lte: today },
        isAvailable: false,
        status: "PAUSED",
        lastDonationDate: { $ne: null },
      },
      { $set: { isAvailable: true, status: "ACTIVE" } }
    );

    if (result.modifiedCount > 0) {
      console.log(`[BloodJobs] Restored availability for ${result.modifiedCount} donors`);
    }
  } catch (error) {
    console.error("[BloodJobs] Error updating donor eligibility:", error.message);
  }
};

const initBloodJobs = () => {
  cron.schedule("0 * * * *", async () => {
    await expireOverdueInvites();
  });

  cron.schedule("30 0 * * *", async () => {
    await expireOverdueRequests();
  });

  cron.schedule("0 1 * * *", async () => {
    await updateDonorEligibility();
  });

  console.log("[BloodJobs] Background jobs initialized");
};

export { initBloodJobs, expireOverdueInvites, expireOverdueRequests, updateDonorEligibility };
