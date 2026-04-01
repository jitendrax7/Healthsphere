import User from "../../models/User.js";
import DoctorProfile from "../../models/DoctorProfile.js";
export const getDoctorContext = async (req, res) => {

    try {

        const userId = req.user._id;

        const [user, profile] = await Promise.all([
            User.findById(userId)
                .select("location")
                .lean(),

            DoctorProfile.findOne({
                user: userId
            })
                .select(`
specialization
totalExperience
consultationFee
availableDays
availability
qualifications
clinicLocation
isBookingEnabled
verificationStatus
documents
`)
                .lean()

        ]);


        let newUser = !profile;

        let missingFields = [];

        if (profile) {

            if (!profile.specialization)
                missingFields.push("specialization");

            if (!profile.totalExperience)
                missingFields.push("totalExperience");

            if (profile.consultationFee === undefined)
                missingFields.push("consultationFee");

            if (!profile.availableDays?.length)
                missingFields.push("availableDays");

            if (!profile.availability?.startTime)
                missingFields.push("startTime");

            if (!profile.availability?.endTime)
                missingFields.push("endTime");

            if (!profile.qualifications?.length)
                missingFields.push("qualifications");

            if (!profile.clinicLocation?.clinicName)
                missingFields.push("clinicName");

            if (!profile.clinicLocation?.city)
                missingFields.push("clinicCity");


            // Document checks (new)

            const hasLicense =
                profile.documents?.some(
                    doc => doc.documentType === "medical_license"
                );

            const hasIdProof =
                profile.documents?.some(
                    doc => doc.documentType === "id_proof"
                );

            if (!hasLicense)
                missingFields.push("medical_license");

            if (!hasIdProof)
                missingFields.push("id_proof");

        }


        // Profile completion logic

        const doctorProfileComplete = (

            !newUser &&
            missingFields.length === 0

        );


        let completionPercentage = 0;

        if (profile) {

            const totalFields = 10;

            const completed =
                totalFields - missingFields.length;

            completionPercentage =
                Math.max(
                    0,
                    Math.round(
                        (completed / totalFields) * 100
                    )
                );

        }



        return res.status(200).json({

            _id: userId,

            location: {

                city:
                    user?.location?.city || null,

                latitude:
                    user?.location?.latitude || null,

                longitude:
                    user?.location?.longitude || null

            },

            newUser,

            doctorProfileComplete,

            profileCompletion:
                completionPercentage,

            missingFields,

            bookingEnabled:
                profile?.isBookingEnabled || false,

            verificationStatus:
                profile?.verificationStatus || "pending",

            theme: "dark",

            language: "en",

            timezone: "Asia/Kolkata"

        });


    }
    catch (error) {

        return res.status(500).json({

            success: false,

            message: "Failed to fetch context",

            error: error.message

        });

    }

};