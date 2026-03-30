import mongoose from "mongoose";

const healthcareCampSchema = new mongoose.Schema({

  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HospitalProfile",
    required: true
  },

  title: {
    type: String,
    required: true
  },
  registrationDeadline:Date,

  description: String,

  campType: {
    type: String,
  },

  departments: [
    {
      type: String
    }
  ],

  services: [
    {
      type: String
    }
  ],

  doctors: [
    {

      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorProfile",
        default: null
      },

      doctorName: String,

      specialization: String

    }
  ],

  location: {

    addressLine: String,

    city: String,

    state: String,

    pincode: String,

    geo: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },

      coordinates: {
        type: [Number] // [longitude, latitude]
      }

    }

  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date
  },

  startTime: String,

  endTime: String,

  maxParticipants: Number,

  registrationRequired: {
    type: Boolean,
    default: true
  },

  registeredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  totalRegistrations:{
    type:Number,
    default:0
  },

  contactNumber: String,

  posterImage: String,

  status: {
    type: String,
    enum: [
      "draft",
      "published",
      "completed",
      "cancelled"
    ],
    default: "draft"
  },

  isFree: {
    type: Boolean,
    default: true
  },

  campFee: {
    type: Number,
    default: 0
  }

},
  { timestamps: true }
);


healthcareCampSchema.index({
  "location.geo":"2dsphere"
});

export default mongoose.model("HealthcareCamp", healthcareCampSchema);