import mongoose from "mongoose";

const googleCalendarSchema = new mongoose.Schema({
  connected: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String
  },
  email: {
    type: String
  },
  accessToken: {
    type: String
  },
  refreshToken: {
    type: String
  },
  tokenExpiry: {
    type: Date
  }
}, { _id: false });


const notificationSchema = new mongoose.Schema({

  emailNotifications: {
    type: Boolean,
    default: true
  },

  phoneNotifications: {
    type: Boolean,
    default: false
  },

  pushNotifications: {
    type: Boolean,
    default: true
  },

  appointmentReminder: {
    type: Boolean,
    default: true
  }
}, { _id: false });


const appearanceSchema = new mongoose.Schema({

  theme: {
    type: String,
    enum: ["light", "dark", "system" , "health"],
    default: "system"
  },
  language: {
    type: String,
    default: "en"
  },
  timezone: {
    type: String,
    default: "Asia/Kolkata"
  }
}, { _id: false });

const accountSettingSchema = new mongoose.Schema({

  twoFactorAuth: {
    type: Boolean,
    default: false
  },

  loginAlerts: {
    type: Boolean,
    default: true
  },

  sessionTimeout: {
    type: Number,
    default: 60  
  }

}, { _id: false });



const userSettingSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  appearance: {
    type: appearanceSchema,
    default: {}      
  },

  notifications: {
    type: notificationSchema,
    default: {}      
  },

  googleCalendar: {
    type: googleCalendarSchema,
    default: {}     
  },

  account: {
    type: accountSettingSchema,
    default: {}      
  }

},
  {
    timestamps: true
  });


export default mongoose.model("UserSetting", userSettingSchema);