import DonorProfile from "../../models/DonorProfile.js";
import * as donorService from "../../services/blood/donorService.js";
import * as inviteService from "../../services/blood/inviteService.js";
import * as notificationService from "../../services/blood/notificationService.js";
import { INVITE_STATUS } from "../../constants/inviteStatus.js";
import User from "../../models/User.js";

const VALID_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const VALID_GENDERS = ["male", "female", "other"];

const registerDonor = async (req, res) => {
  try {
    const {
      bloodGroup,
      age,
      weight,
      gender,
      isAvailable,
      isAnonymous,
      emergencyAvailable,
      maxDistance,
      lastDonationDate,
      diseases,
      medications,
    } = req.body;

    const errors = [];

    if (!bloodGroup) {
      errors.push("bloodGroup is required");
    } else if (!VALID_BLOOD_GROUPS.includes(bloodGroup)) {
      errors.push(`bloodGroup must be one of: ${VALID_BLOOD_GROUPS.join(", ")}`);
    }

    if (age === undefined || age === null || age === "") {
      errors.push("age is required");
    } else {
      const parsedAge = Number(age);
      if (isNaN(parsedAge) || !Number.isInteger(parsedAge)) {
        errors.push("age must be a whole number");
      } else if (parsedAge < 18 || parsedAge > 65) {
        errors.push("age must be between 18 and 65");
      }
    }

    if (weight === undefined || weight === null || weight === "") {
      errors.push("weight is required");
    } else {
      const parsedWeight = Number(weight);
      if (isNaN(parsedWeight) || parsedWeight <= 0) {
        errors.push("weight must be a positive number");
      } else if (parsedWeight < 45) {
        errors.push("weight must be at least 45 kg to be eligible for donation");
      }
    }

    if (!gender) {
      errors.push("gender is required");
    } else if (!VALID_GENDERS.includes(gender)) {
      errors.push(`gender must be one of: ${VALID_GENDERS.join(", ")}`);
    }

    if (isAvailable !== undefined && typeof isAvailable !== "boolean") {
      errors.push("isAvailable must be a boolean");
    }

    if (isAnonymous !== undefined && typeof isAnonymous !== "boolean") {
      errors.push("isAnonymous must be a boolean");
    }

    if (emergencyAvailable !== undefined && typeof emergencyAvailable !== "boolean") {
      errors.push("emergencyAvailable must be a boolean");
    }

    if (maxDistance !== undefined) {
      const parsedMax = Number(maxDistance);
      if (isNaN(parsedMax) || parsedMax <= 0) {
        errors.push("maxDistance must be a positive number (km)");
      }
    }

    if (lastDonationDate !== undefined && lastDonationDate !== null && lastDonationDate !== "") {
      const parsed = new Date(lastDonationDate);
      if (isNaN(parsed.getTime())) {
        errors.push("lastDonationDate must be a valid date (e.g. 2024-10-01)");
      } else if (parsed > new Date()) {
        errors.push("lastDonationDate cannot be in the future");
      }
    }

    if (diseases !== undefined && !Array.isArray(diseases)) {
      errors.push("diseases must be an array of strings");
    }

    if (medications !== undefined && !Array.isArray(medications)) {
      errors.push("medications must be an array of strings");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const userId = req.user._id;

    const userRecord = await User.findById(userId).select("location").lean();
    const latitude = userRecord?.location?.latitude;
    const longitude = userRecord?.location?.longitude;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Location not set. Please update your profile location before registering as a donor.",
      });
    }

    const donor = await donorService.registerDonor(userId, {
      ...req.body,
      latitude,
      longitude,
    });

    return res.status(201).json({
      success: true,
      message: "Donor profile created successfully",
      data: donor,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const donor = await donorService.getDonorByUserId(req.user._id);

    return res.status(200).json({
      success: true,
      data: donor,
    });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAvailable must be a boolean",
      });
    }

    const donor = await DonorProfile.findOne({ user: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor profile not found" });
    }

    const updated = await donorService.updateAvailability(donor._id, isAvailable);

    return res.status(200).json({
      success: true,
      message: `Availability set to ${isAvailable}`,
      data: { isAvailable: updated.isAvailable },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const toggleAnonymous = async (req, res) => {
  try {
    const { isAnonymous } = req.body;

    if (typeof isAnonymous !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAnonymous must be a boolean",
      });
    }

    const donor = await DonorProfile.findOne({ user: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor profile not found" });
    }

    const updated = await donorService.toggleAnonymous(donor._id, isAnonymous);

    return res.status(200).json({
      success: true,
      message: `Privacy mode ${isAnonymous ? "enabled" : "disabled"}`,
      data: { isAnonymous: updated.isAnonymous },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getInvites = async (req, res) => {
  try {
    const donor = await DonorProfile.findOne({ user: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor profile not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await inviteService.getInvitesForDonor(donor._id, page, limit);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const respondInvite = async (req, res) => {
  try {
    const { inviteId, status } = req.body;

    if (!inviteId || !status) {
      return res.status(400).json({
        success: false,
        message: "inviteId and status are required",
      });
    }

    const donor = await DonorProfile.findOne({ user: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor profile not found" });
    }

    const invite = await inviteService.respondInvite(inviteId, donor._id, status);

    if (status === INVITE_STATUS.ACCEPTED) {
      const hospitalUser = await User.findOne({ _id: req.user._id });

      await notificationService.notifyHospitalAcceptance(
        invite.hospital,
        invite,
        { isAnonymous: donor.isAnonymous }
      );
    } else if (status === INVITE_STATUS.DECLINED) {
      await notificationService.notifyHospitalDecline(invite.hospital, invite);
    }

    const responseData = { inviteId: invite._id, status: invite.status };

    if (status === INVITE_STATUS.ACCEPTED && !donor.isAnonymous) {
      const user = await User.findById(req.user._id).select("Name email phoneNumber");
      responseData.donorContact = {
        name: user.Name,
        email: user.email,
        phone: user.phoneNumber,
      };
    }

    return res.status(200).json({
      success: true,
      message: `Invite ${status.toLowerCase()} successfully`,
      data: responseData,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getDonationHistory = async (req, res) => {
  try {
    const donor = await DonorProfile.findOne({ user: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor profile not found" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await donorService.getDonationHistory(donor._id, page, limit);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await notificationService.getNotifications(req.user._id, page, limit);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.status(400).json({ success: false, message: "notificationId is required" });
    }

    await notificationService.markRead(notificationId, req.user._id);

    return res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export {
  registerDonor,
  getProfile,
  updateAvailability,
  toggleAnonymous,
  getInvites,
  respondInvite,
  getDonationHistory,
  getNotifications,
  markNotificationRead,
};
