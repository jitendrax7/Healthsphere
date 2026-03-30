import mongoose from "mongoose";

const hospitalProfileSchema = new mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        hospitalName: {
            type: String,
            required: true
        },

        registrationNumber: {
            type: String,
            required: true
        },

        hospitalType: {
            type: String,
            enum: [
                "government",
                "private",
                "ngo",
                "trust",
                "clinic"
            ]
        },

        establishedYear: Number,

        description: String,

        contactNumber: String,

        emergencyNumber: String,

        email: String,

        website: String,

        location:{
            addressLine:String,
            city:String,
            state:String,
            pincode:String,
            geo:{
                type:{
                type:String,
                enum:["Point"],
                default:"Point"
                },
                coordinates:{
                    type:[Number] // [longitude, latitude]
                }
            }
        },

        departments: [
            {
                type: String
            }
        ],

        facilities: [
            {
                type: String
            }
        ],

        services: [
            {
                type: String
            }
        ],

        totalBeds: Number,

        icuBeds: Number,

        ventilators: Number,

        operationTheatres: Number,

        ambulanceAvailable: {
            type: Boolean,
            default: false
        },

        bloodBankAvailable: {
            type: Boolean,
            default: false
        },

        pharmacyAvailable: {
            type: Boolean,
            default: false
        },

        labAvailable: {
            type: Boolean,
            default: false
        },

        hospitalImages: [
            {
                type: String
            }
        ],

        Images: [{
            type: String
        }],

        documents: [
            {

                documentType: {
                    type: String,
                    enum: [
                        "registration_certificate",
                        "government_license",
                        "pan",
                        "gst",
                        "fire_safety",
                        "pollution_certificate",
                        "nabh_certificate",
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

        verificationStatus: {
            type: String,
            enum: [
                "draft",
                "pending",
                "approved",
                "rejected"
            ],
            default: "pending"
        },
        
        adminVerified:{
            type: Boolean,
            default: false
        },

        adminRemarks: String,


        verifiedAt: Date,

        doctors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "DoctorProfile"
            }
        ],

        rating: {
            type: Number,
            default: 0
        },

        reviewCount: {
            type: Number,
            default: 0
        },

        isActive: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true }
);

hospitalProfileSchema.index({
 "location.geo":"2dsphere"
});

export default mongoose.model("HospitalProfile", hospitalProfileSchema);