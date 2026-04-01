import DonorProfile from "../../models/DonorProfile.js";
import DonationInvite from "../../models/DonationInvite.js";
import DonationHistory from "../../models/DonationHistory.js";
import { INVITE_STATUS, TERMINAL_INVITE_STATUSES } from "../../constants/inviteStatus.js";
import { REQUEST_STATUS } from "../../constants/requestStatus.js";
import BloodRequest from "../../models/BloodRequest.js";

const ELIGIBILITY_DAYS = 90;
const INVITE_EXPIRY_HOURS = 48;

const calculateNextEligibleDate = (lastDonationDate) => {
  if (!lastDonationDate) return null;
  const next = new Date(lastDonationDate);
  next.setDate(next.getDate() + ELIGIBILITY_DAYS);
  return next;
};

const registerDonor = async (userId, data) => {
  const existing = await DonorProfile.findOne({ user: userId });
  if (existing) {
    throw new Error("Donor profile already exists for this user");
  }

  if (!data.latitude || !data.longitude) {
    throw new Error("Donor location coordinates are required");
  }

  const nextEligibleDate = data.lastDonationDate
    ? calculateNextEligibleDate(new Date(data.lastDonationDate))
    : null;

  const donor = await DonorProfile.create({
    user: userId,
    bloodGroup: data.bloodGroup,
    age: data.age,
    weight: data.weight,
    gender: data.gender,
    isAvailable: data.isAvailable ?? true,
    isAnonymous: data.isAnonymous ?? false,
    maxDistance: data.maxDistance ?? 15,
    emergencyAvailable: data.emergencyAvailable ?? true,
    lastDonationDate: data.lastDonationDate ?? null,
    nextEligibleDate,
    medicalInfo: {
      diseases: data.diseases ?? [],
      medications: data.medications ?? [],
    },
    location: {
      type: "Point",
      coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
    },
  });

  return donor;
};

const updateAvailability = async (donorId, isAvailable) => {
  const donor = await DonorProfile.findByIdAndUpdate(
    donorId,
    { isAvailable },
    { new: true, select: "-medicalInfo" }
  );

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  return donor;
};

const pauseDonor = async (donorId) => {
  const donor = await DonorProfile.findByIdAndUpdate(
    donorId,
    { status: "PAUSED", isAvailable: false },
    { new: true, select: "-medicalInfo" }
  );

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  return donor;
};

const toggleAnonymous = async (donorId, isAnonymous) => {
  const donor = await DonorProfile.findByIdAndUpdate(
    donorId,
    { isAnonymous },
    { new: true, select: "-medicalInfo" }
  );

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  return donor;
};

const calculateEligibility = (lastDonationDate) => {
  return calculateNextEligibleDate(lastDonationDate);
};

const getDonationHistory = async (donorId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [records, total] = await Promise.all([
    DonationHistory.find({ donor: donorId })
      .sort({ donationDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate("hospital", "hospitalName location.city location.addressLine")
      .populate("request", "bloodGroup unitsRequired urgencyLevel")
      .lean(),
    DonationHistory.countDocuments({ donor: donorId }),
  ]);

  return {
    records,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

const getDonorByUserId = async (userId) => {
  const donor = await DonorProfile.findOne({ user: userId })
    .select("-medicalInfo")
    .lean();

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  return donor;
};

const recalculateAllEligibility = async () => {
  const donors = await DonorProfile.find({
    lastDonationDate: { $ne: null },
  }).select("_id lastDonationDate nextEligibleDate");

  const bulkOps = donors.map((d) => {
    const computed = calculateNextEligibleDate(d.lastDonationDate);
    return {
      updateOne: {
        filter: { _id: d._id },
        update: { $set: { nextEligibleDate: computed } },
      },
    };
  });

  if (bulkOps.length > 0) {
    await DonorProfile.bulkWrite(bulkOps);
  }

  return bulkOps.length;
};

export {
  registerDonor,
  updateAvailability,
  pauseDonor,
  toggleAnonymous,
  calculateEligibility,
  getDonationHistory,
  getDonorByUserId,
  recalculateAllEligibility,
};
