import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";



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
      role: role === "doctor" ? "doctor" : "user",
      phoneNumber,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000, // 10 minutes
      isVerified: false
    });

    // Send OTP Email
    await sendEmail(
      email,
      "HealthSphere Email Verification",
      `Your verification OTP is: ${otp}`
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
        message: "Email and OTP are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified"
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
      "otp_sent": false,
      message: "Email verified successfully",
      token: generateToken(user),
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

      await sendEmail(
        user.email,
        "HealthSphere Email Verification",
        `Your verification OTP is: ${otp}`
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
        profilePhoto: "https://tse1.explicit.bing.net/th/id/OIP.eOwuD0szBt89gR5aPcjL5wHaHa?w=1920&h=1920&rs=1&pid=ImgDetMain&o=7&rm=3"  // for now 
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
}; 