import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg"
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only PDF, JPG, JPEG, PNG files allowed"
            ),
            false
        );

    }

};

const uploadDoctorDocuments = multer({

    storage,

    limits: {
        fileSize: 10 * 1024 * 1024   // 10MB
    },

    fileFilter

});

export default uploadDoctorDocuments;