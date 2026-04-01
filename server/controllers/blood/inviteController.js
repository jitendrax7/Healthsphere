import HospitalProfile from "../../models/HospitalProfile.js";
import DonorProfile from "../../models/DonorProfile.js";
import * as inviteService from "../../services/blood/inviteService.js";
import * as notificationService from "../../services/blood/notificationService.js";
import { INVITE_TYPE } from "../../constants/inviteStatus.js";

const sendInvite = async (req, res) => {
  try {
    const hospital = await HospitalProfile.findOne({ user: req.user._id });
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital profile not found" });
    }

    const { requestId, donorId, message } = req.body;

    if (!requestId || !donorId) {
      return res.status(400).json({
        success: false,
        message: "requestId and donorId are required",
      });
    }

    const donor = await DonorProfile.findById(donorId);
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor profile not found" });
    }

    const invite = await inviteService.createInvite(
      requestId,
      donorId,
      hospital._id,
      INVITE_TYPE.DIRECT,
      message ?? ""
    );

    try {
      await notificationService.notifyDonorInvite(donor.user, invite, { _id: requestId });
    } catch {
    }

    return res.status(201).json({
      success: true,
      message: "Invite sent successfully",
      data: invite,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const cancelInvite = async (req, res) => {
  try {
    const hospital = await HospitalProfile.findOne({ user: req.user._id });
    if (!hospital) {
      return res.status(404).json({ success: false, message: "Hospital profile not found" });
    }

    const { inviteId } = req.body;

    if (!inviteId) {
      return res.status(400).json({ success: false, message: "inviteId is required" });
    }

    const invite = await inviteService.cancelInvite(inviteId, hospital._id);

    return res.status(200).json({
      success: true,
      message: "Invite cancelled",
      data: { inviteId: invite._id, status: invite.status },
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export { sendInvite, cancelInvite };
