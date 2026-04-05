import multer from "multer";
import fs from "fs";

// ensure upload folder exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },

    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() + "-" +
            file.originalname.replace(/\s/g,"_");

        cb(null, uniqueName);

    }

});

const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "application/pdf",

        "image/jpeg",

        "image/png",

        "image/jpg"

    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    }
    else {

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

        fileSize: 10 * 1024 * 1024   // 10MB safer for docs

    },

    fileFilter

});

export default uploadDoctorDocuments;