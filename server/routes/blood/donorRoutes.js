import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { requireDonor, requireDonorProfile } from "../../middleware/roleMiddleware.js";
import {
  registerDonor,
  getProfile,
  updateAvailability,
  toggleAnonymous,
  getInvites,
  respondInvite,
  getDonationHistory,
  getNotifications,
  markNotificationRead,
} from "../../controllers/blood/donorController.js";

const router = express.Router();

router.post("/register", protect, requireDonor, registerDonor);
router.get("/profile", protect, requireDonorProfile, getProfile);
router.patch("/availability", protect, requireDonorProfile, updateAvailability);
router.patch("/privacy", protect, requireDonorProfile, toggleAnonymous);
router.get("/invites", protect, requireDonorProfile, getInvites);
router.post("/respond", protect, requireDonorProfile, respondInvite);
router.get("/history", protect, requireDonorProfile, getDonationHistory);
router.get("/notifications", protect, getNotifications);
router.patch("/notifications/read", protect, markNotificationRead);

export default router;
