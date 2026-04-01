import express from "express";
import { protect } from "../../middleware/authMiddleware.js";
import { requireHospital } from "../../middleware/roleMiddleware.js";
import {
  createBloodRequest,
  getHospitalRequests,
  getMatchedDonors,
  closeRequest,
  updateStatus,
  getCommunityFeed,
} from "../../controllers/blood/bloodRequestController.js";
import {
  sendInvite,
  cancelInvite,
} from "../../controllers/blood/inviteController.js";

const router = express.Router();

router.get("/community", protect, getCommunityFeed);

router.post("/request", protect, requireHospital, createBloodRequest);
router.get("/request", protect, requireHospital, getHospitalRequests);
router.get("/request/:id/donors", protect, requireHospital, getMatchedDonors);
router.patch("/request/:id/close", protect, requireHospital, closeRequest);
router.patch("/request/status", protect, requireHospital, updateStatus);

router.post("/invite", protect, requireHospital, sendInvite);
router.patch("/invite/cancel", protect, requireHospital, cancelInvite);

export default router;
