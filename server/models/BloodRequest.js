import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema({

  hospital:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"HospitalProfile",
    required:true
  },

  patientName:String,

  bloodGroup:{
    type:String,
    enum:[
      "A+","A-",
      "B+","B-",
      "AB+","AB-",
      "O+","O-"
    ],
    required:true
  },

  unitsRequired:{
    type:Number,
    required:true
  },

  urgency:{
    type:String,
    enum:[
      "low",
      "medium",
      "high",
      "critical"
    ],
    default:"medium"
  },

  requiredBefore:Date,

  disease:String,

  patientAge:Number,

  contactPerson:String,

  contactNumber:String,

  location:{

    addressLine:String,

    city:String,

    state:String,

    pincode:String,

    latitude:Number,

    longitude:Number

  },

  matchedDonors:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],

  donorsResponded:[
    {
      donor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },

      status:{
        type:String,
        enum:[
          "interested",
          "donated",
          "not_available"
        ]
      }
    }
  ],

  status:{
    type:String,
    enum:[
      "active",
      "fulfilled",
      "cancelled",
      "expired"
    ],
    default:"active"
  },

  notes:String

},
{timestamps:true}
);

export default mongoose.model("BloodRequest",bloodRequestSchema);