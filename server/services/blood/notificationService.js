import Notification from "../../models/Notification.js";

const createNotification = async (userId, type, title, message, data = {}) => {
  const notification = await Notification.create({
    user: userId,
    type,
    title,
    message,
    data: {
      requestId: data.requestId ?? null,
      inviteId: data.inviteId ?? null,
    },
  });

  return notification;
};

const notifyDonorInvite = async (donorUserId, invite, request) => {
  const bloodGroup = request?.bloodGroup ?? "Unknown";
  const city = request?.location?.city ?? "your area";
  const urgency = request?.urgencyLevel ?? "NORMAL";

  return createNotification(
    donorUserId,
    "INVITE_RECEIVED",
    "Blood Donation Invite",
    `You have been invited to donate ${bloodGroup} blood for a ${urgency} request in ${city}.`,
    {
      requestId: invite.request,
      inviteId: invite._id,
    }
  );
};

const notifyHospitalAcceptance = async (hospitalUserId, invite, donorInfo) => {
  const displayName = donorInfo.isAnonymous ? "An anonymous donor" : "A donor";

  return createNotification(
    hospitalUserId,
    "INVITE_ACCEPTED",
    "Donor Accepted Your Invite",
    `${displayName} has accepted your blood donation invite.`,
    {
      requestId: invite.request,
      inviteId: invite._id,
    }
  );
};

const notifyHospitalDecline = async (hospitalUserId, invite) => {
  return createNotification(
    hospitalUserId,
    "INVITE_DECLINED",
    "Donor Declined Invite",
    "A donor has declined your blood donation invite.",
    {
      requestId: invite.request,
      inviteId: invite._id,
    }
  );
};

const notifyRequestExpired = async (hospitalUserId, request) => {
  return createNotification(
    hospitalUserId,
    "REQUEST_EXPIRED",
    "Blood Request Expired",
    `Your blood request for ${request.bloodGroup} blood has expired without being fully fulfilled.`,
    {
      requestId: request._id,
      inviteId: null,
    }
  );
};

const notifyEligibilityRestored = async (donorUserId, donor) => {
  return createNotification(
    donorUserId,
    "ELIGIBILITY_RESTORED",
    "You Are Eligible to Donate Again",
    `You are now eligible to donate ${donor.bloodGroup} blood. Turn on availability to help save lives.`,
    {
      requestId: null,
      inviteId: null,
    }
  );
};

const markRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

const markAllRead = async (userId) => {
  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );

  return result.modifiedCount;
};

const getNotifications = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ user: userId }),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);

  return {
    notifications,
    total,
    unreadCount,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export {
  createNotification,
  notifyDonorInvite,
  notifyHospitalAcceptance,
  notifyHospitalDecline,
  notifyRequestExpired,
  notifyEligibilityRestored,
  markRead,
  markAllRead,
  getNotifications,
};
