import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";

import { setupUserAccount } from "../../services/user/setupAccountService.js";
import { sendUserEmail } from "../../services/email/userEmailService.js";



const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


export const registerUser = async (req, res) => {
  try {
    const { Name, email, password, role, phoneNumber } = req.body;

    if (!Name || !email || !password || !role || !phoneNumber) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // verify role
    const validRoles = ["user", "doctor", "hospital"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();

    console.log("Generated OTP for", email, ":", otp); // For testing purposes, log the OTP
    const user = await User.create({
      Name,
      email,
      password: hashedPassword,
      role: role,
      phoneNumber,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
      isVerified: false
    });

    // Send OTP Email
    // await sendEmail(
    //   email,
    //   "HealthSphere Email Verification",
    //   `Your verification OTP is: ${otp}`
    // );

      await sendUserEmail(
      "OTP",
      {
        email: user.email,
        name: user.Name,
        otp
      }
    );
    res.status(201).json({
      "otp_sent": true,
      message: "Registered successfully. Please verify your email.",
      email: user.email
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;


    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    if (typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (typeof otp !== "string" && typeof otp !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format"
      });
    }

    const user = await User.findOne({ email }).select("+otp +otpExpire");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(409).json({
        success: false,
        message: "Email already verified"
      });
    }


    if (!user.otp || !user.otpExpire) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request again."
      });
    }

    if (Date.now() > user.otpExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    if (user.otp.toString() !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (user.role === "user") {
      await setupUserAccount(user._id);
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    // future doctor setup
    // if(user.role === "doctor"){
    //    await setupDoctorAccount(user._id);
    // }



    const token = generateToken(user);

    res.status(200).json({
      success: true,
      otp_sent: false,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.Name,
        email: user.email,
        role: user.role
      }
    });

    await sendUserEmail(

      "WELCOME",
      {
        email: user.email,
        name: user.Name
      }
    );

  } catch (error) {

    console.error("Verify Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    // If email not verified → resend OTP
    if (!user.isVerified) {
      const otp = generateOTP();

      user.otp = otp;
      user.otpExpire = Date.now() + 10 * 60 * 1000;

      await user.save();

      await sendUserEmail(
        "OTP",
        {
          email: user.email,
          name: user.Name,
          otp
        }
      );

      return res.status(403).json({
        "otp_sent": true,
        message: "Email not verified. OTP sent again."
      });
    }

    res.status(200).json({
      "otp_sent": false,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        Name: user.Name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};



export const getUserStatus = async (req, res) => {
  try {

    res.status(200).json({
      isLoggedIn: true,
      user: {
        id: req.user._id,
        role: req.user.role,
        Name: req.user.Name,
        email: req.user.email,
        profilePhoto: req.user.profilePhoto
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};