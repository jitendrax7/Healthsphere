import DonorProfile from "../models/DonorProfile.js";
import HospitalProfile from "../models/HospitalProfile.js";

const DONOR_ROLES = ["user", "doctor"];

const requireDonor = async (req, res, next) => {
  try {
    if (!DONOR_ROLES.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only users and doctors can perform donor actions",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const requireDonorProfile = async (req, res, next) => {
  try {
    if (!DONOR_ROLES.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only users and doctors can perform donor actions",
      });
    }

    const donor = await DonorProfile.findOne({ user: req.user._id });
    if (!donor) {
      return res.status(403).json({
        success: false,
        message: "Donor profile not found. Please register as a donor first",
      });
    }

    if (donor.status === "BLOCKED") {
      return res.status(403).json({
        success: false,
        message: "Your donor account has been blocked",
      });
    }

    req.donorProfile = donor;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const requireHospital = async (req, res, next) => {
  try {
    if (req.user.role !== "hospital") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only hospitals can perform this action",
      });
    }

    const hospital = await HospitalProfile.findOne({ user: req.user._id });
    if (!hospital) {
      return res.status(403).json({
        success: false,
        message: "Hospital profile not found",
      });
    }

    if (!hospital.adminVerified) {
      return res.status(403).json({
        success: false,
        message: "Hospital account is not verified by admin yet",
      });
    }

    req.hospitalProfile = hospital;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { requireDonor, requireDonorProfile, requireHospital };
