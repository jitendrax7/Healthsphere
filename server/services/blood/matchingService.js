import DonorProfile from "../../models/DonorProfile.js";
import BloodRequest from "../../models/BloodRequest.js";

const DONATION_LIMIT = 50;

const findEligibleDonors = async (requestId) => {
  const request = await BloodRequest.findById(requestId).lean();

  if (!request) {
    throw new Error("Blood request not found");
  }

  const geoCoords = request.location?.geoLocation?.coordinates;

  if (!geoCoords || geoCoords.length !== 2) {
    throw new Error("Blood request does not have valid geo coordinates");
  }

  const [lng, lat] = geoCoords;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const donors = await DonorProfile.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng, lat],
        },
        distanceField: "distance",
        spherical: true,
        query: {
          bloodGroup: request.bloodGroup,
          isAvailable: true,
          status: "ACTIVE",
          $or: [
            { nextEligibleDate: null },
            { nextEligibleDate: { $lte: today } },
          ],
        },
      },
    },
    {
      $match: {
        $expr: {
          $lte: [
            "$distance",
            { $multiply: ["$maxDistance", 1000] },
          ],
        },
      },
    },
    {
      $sort: {
        distance: 1,
        emergencyAvailable: -1,
        "donationStats.totalDonations": -1,
      },
    },
    {
      $limit: DONATION_LIMIT,
    },
    {
      $project: {
        _id: 1,
        user: 1,
        bloodGroup: 1,
        isAnonymous: 1,
        emergencyAvailable: 1,
        maxDistance: 1,
        distance: 1,
        nextEligibleDate: 1,
        donationStats: 1,
        location: 1,
      },
    },
  ]);

  return donors;
};

export { findEligibleDonors };
