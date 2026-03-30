import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    specialization: {
      type: String,
    },

    qualifications: [
      {
        degree: String,
        institute: String,
        year: Number,
      },
    ],

    certifications: [
      {
        title: String,
        issuedBy: String,
        year: Number
      }
    ],

    awards: [
      {
        title: String,
        year: Number
      }
    ],
    languages: [
      {
        type: String
      }
    ],

    servicesOffered: [
      {
        type: String
      }
    ],
    totalExperience: {
      type: Number
    },
    experienceDetails: [
      {
        hospital: String,
        role: String,
        years: Number
      }
    ],

    consultationFee: {
      type: Number,
    },

    documents: [
      {

        documentType: {
          type: String,
          enum: [
            "medical_license",
            "degree_certificate",
            "id_proof",
            "experience_certificate",
            "other"
          ]
        },

        documentUrl: String,

        verificationStatus: {
          type: String,
          enum: [
            "pending",
            "approved",
            "rejected"
          ],
          default: "pending"
        },

        uploadedAt: {
          type: Date,
          default: Date.now
        }

      }
    ],

    employmentType: {
      type: String,
      enum: [
        "independent",
        "hospital_fulltime",
        "hospital_visiting",
        "consultant"
      ],
      default: "independent"
    },

    bio: String,

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HospitalProfile",
      default: null
    },

    clinicLocation: {
      clinicName: {
        type: String,
      },
      addressLine: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pincode: {
        type: String,
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },
    consultationMode: {
      type: String,
      enum: [
        "online",
        "offline",
        "both"
      ],
      default: "offline"
    },

    availableDays: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],

    availability: {
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
      slotDuration: {
        type: Number,
        default: 30
      }
    },

    rating: {
      type: Number,
      default: 0
    },

    reviewCount: {
      type: Number,
      default: 0
    },

    isBookingEnabled: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    verifiedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("DoctorProfile", doctorProfileSchema);