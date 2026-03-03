import mongoose from "mongoose";

const userHealthProfileSchema = new mongoose.Schema(
  {
    //  Reference to User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    //  Basic Personal Health Info
    age: {
      type: Number,
      min: 0,
      max: 120
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },

    height: {
      value: {
        type: Number,
        min: 30,  // cm
        max: 300
      },
      unit: {
        type: String,
        default: "cm"
      }
    },

    weight: {
      value: {
        type: Number,
        min: 1,
        max: 500
      },
      unit: {
        type: String,
        default: "kg"
      }
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
    },

    // Medical Background
    allergies: [
      {
        type: String
      }
    ],

    chronicDiseases: [
      {
        type: String
      }
    ],

    pastSurgeries: [
      {
        type: String
      }
    ],

    familyMedicalHistory: [
      {
        type: String
      }
    ],

    //  Lifestyle Information
    lifestyle: {
      smoking: {
        type: Boolean,
        default: false
      },

      alcohol: {
        type: Boolean,
        default: false
      },

      exerciseFrequency: {
        type: String,
        enum: ["none", "1-2 times/week", "3-5 times/week", "daily"]
      },

      sleepHoursPerDay: {
        type: Number,
        min: 0,
        max: 24
      }
    },

    //  Emergency Contact
    emergencyContact: {
      name: String,
      relation: String,
      phone: String
    },

    // Optional Calculated Fields
    bmi: {
      type: Number
    },

    lastUpdatedBy: {
      type: String,
      enum: ["user", "doctor", "system"],
      default: "user"
    }
  },
  { timestamps: true }
);

const UserHealthProfile = mongoose.model(
  "UserHealthProfile",
  userHealthProfileSchema
);

export default UserHealthProfile;