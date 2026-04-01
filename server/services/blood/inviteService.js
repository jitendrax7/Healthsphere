import DonationInvite from "../../models/DonationInvite.js";
import BloodRequest from "../../models/BloodRequest.js";
import DonorProfile from "../../models/DonorProfile.js";
import DonationHistory from "../../models/DonationHistory.js";
import { INVITE_STATUS, INVITE_TYPE, TERMINAL_INVITE_STATUSES } from "../../constants/inviteStatus.js";
import { REQUEST_STATUS } from "../../constants/requestStatus.js";

const INVITE_EXPIRY_HOURS = 48;
const DAILY_INVITE_LIMIT = 100;

const getInviteExpiry = () => {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + INVITE_EXPIRY_HOURS);
  return expiry;
};

const checkDailyInviteLimit = async (hospitalId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const count = await DonationInvite.countDocuments({
    hospital: hospitalId,
    createdAt: { $gte: startOfDay },
  });

  if (count >= DAILY_INVITE_LIMIT) {
    throw new Error(
      `Hospital has reached the daily invite limit of ${DAILY_INVITE_LIMIT}`
    );
  }
};

const createInvite = async (
  requestId,
  donorId,
  hospitalId,
  type = INVITE_TYPE.DIRECT,
  message = ""
) => {
  await checkDailyInviteLimit(hospitalId);

  const existing = await DonationInvite.findOne({
    request: requestId,
    donor: donorId,
    status: INVITE_STATUS.PENDING,
  });

  if (existing) {
    throw new Error("Donor already has a pending invite for this request");
  }

  const invite = await DonationInvite.create({
    request: requestId,
    hospital: hospitalId,
    donor: donorId,
    message,
    inviteType: type,
    status: INVITE_STATUS.PENDING,
    expiresAt: getInviteExpiry(),
  });

  return invite;
};

const bulkInvite = async (requestId, donorIds, hospitalId) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todayCount = await DonationInvite.countDocuments({
    hospital: hospitalId,
    createdAt: { $gte: startOfDay },
  });

  const slotsRemaining = DAILY_INVITE_LIMIT - todayCount;

  if (slotsRemaining <= 0) {
    throw new Error(
      `Hospital has reached the daily invite limit of ${DAILY_INVITE_LIMIT}`
    );
  }

  const eligibleDonorIds = donorIds.slice(0, slotsRemaining);

  const existingInvites = await DonationInvite.find({
    request: requestId,
    donor: { $in: eligibleDonorIds },
    status: INVITE_STATUS.PENDING,
  }).distinct("donor");

  const existingSet = new Set(existingInvites.map((id) => id.toString()));

  const newDonorIds = eligibleDonorIds.filter(
    (id) => !existingSet.has(id.toString())
  );

  if (newDonorIds.length === 0) {
    return [];
  }

  const expiresAt = getInviteExpiry();

  const inviteDocs = newDonorIds.map((donorId) => ({
    request: requestId,
    hospital: hospitalId,
    donor: donorId,
    inviteType: INVITE_TYPE.AUTO,
    status: INVITE_STATUS.PENDING,
    expiresAt,
    message: "",
  }));

  const invites = await DonationInvite.insertMany(inviteDocs);

  await BloodRequest.findByIdAndUpdate(requestId, {
    $set: {
      matchedDonors: newDonorIds,
      matchedDonorsCount: newDonorIds.length,
      status: REQUEST_STATUS.MATCHING,
    },
  });

  return invites;
};

const expireInvite = async (inviteId) => {
  const invite = await DonationInvite.findOneAndUpdate(
    {
      _id: inviteId,
      status: INVITE_STATUS.PENDING,
    },
    {
      status: INVITE_STATUS.EXPIRED,
    },
    { new: true }
  );

  return invite;
};

const respondInvite = async (inviteId, donorProfileId, responseStatus) => {
  const validResponses = [INVITE_STATUS.ACCEPTED, INVITE_STATUS.DECLINED];

  if (!validResponses.includes(responseStatus)) {
    throw new Error("Invalid response status. Must be ACCEPTED or DECLINED");
  }

  const invite = await DonationInvite.findOne({
    _id: inviteId,
    donor: donorProfileId,
    status: INVITE_STATUS.PENDING,
  });

  if (!invite) {
    throw new Error("Invite not found, already responded, or not yours");
  }

  if (invite.expiresAt < new Date()) {
    await DonationInvite.findByIdAndUpdate(inviteId, {
      status: INVITE_STATUS.EXPIRED,
    });
    throw new Error("This invite has already expired");
  }

  invite.status = responseStatus;
  invite.respondedAt = new Date();
  await invite.save();

  if (responseStatus === INVITE_STATUS.ACCEPTED) {
    const request = await BloodRequest.findById(invite.request);

    if (request) {
      request.acceptedDonorsCount += 1;

      const donorsResponded = request.donorsResponded || [];
      donorsResponded.push({
        donor: donorProfileId,
        status: "interested",
      });
      request.donorsResponded = donorsResponded;

      if (request.acceptedDonorsCount >= request.unitsRequired) {
        request.status = REQUEST_STATUS.PARTIAL;
      }

      await request.save();
    }

    await DonationHistory.create({
      donor: donorProfileId,
      hospital: invite.hospital,
      request: invite.request,
      bloodGroup: (await BloodRequest.findById(invite.request).select("bloodGroup").lean())
        ?.bloodGroup,
      unitsDonated: 1,
      donationDate: new Date(),
      status: "SCHEDULED",
    });
  }

  return invite;
};

const cancelInvite = async (inviteId, hospitalId) => {
  const invite = await DonationInvite.findOneAndUpdate(
    {
      _id: inviteId,
      hospital: hospitalId,
      status: INVITE_STATUS.PENDING,
    },
    {
      status: INVITE_STATUS.CANCELLED,
    },
    { new: true }
  );

  if (!invite) {
    throw new Error("Invite not found or cannot be cancelled");
  }

  return invite;
};

const getInvitesForDonor = async (donorId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [invites, total] = await Promise.all([
    DonationInvite.find({ donor: donorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("request", "bloodGroup unitsRequired urgencyLevel status location.city requiredBeforeDate")
      .populate("hospital", "hospitalName location.city location.addressLine contactNumber")
      .lean(),
    DonationInvite.countDocuments({ donor: donorId }),
  ]);

  return {
    invites,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

const expireAllOverdueInvites = async () => {
  const result = await DonationInvite.updateMany(
    {
      status: INVITE_STATUS.PENDING,
      expiresAt: { $lt: new Date() },
    },
    {
      $set: { status: INVITE_STATUS.EXPIRED },
    }
  );

  return result.modifiedCount;
};

export {
  createInvite,
  bulkInvite,
  expireInvite,
  respondInvite,
  cancelInvite,
  getInvitesForDonor,
  expireAllOverdueInvites,
};
