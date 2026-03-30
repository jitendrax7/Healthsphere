import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  phoneNumber: {
    type: String
  },
  
  location: {
    city: String,
    latitude: Number,
    longitude: Number
  },


  role: {
    type: String,
    enum: ["user", "doctor","hospital"],
    default: "user"
  },

  profilePhoto:{
    type: String
  },

  accountStatus: {
    type: String,
    enum: ["active", "suspended", "banned", "deactivated"],
    default: "active"
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  otp: String,
  otpExpire: Date


}, { timestamps: true });

export default mongoose.model("User", userSchema);