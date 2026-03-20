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
    enum: ["user", "doctor"],
    default: "user"
  },

  profilePhoto:{
    type: String,
    default: "https://tse1.explicit.bing.net/th/id/OIP.eOwuD0szBt89gR5aPcjL5wHaHa?w=1920&h=1920&rs=1&pid=ImgDetMain&o=7&rm=3"
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