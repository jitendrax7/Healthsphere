import multer from "multer";

const errorHandler = (err, req, res, next) => {

  console.error(err); // optional (for debugging)

  // ✅ Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large (max 5MB)"
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // ✅ File type error
  if (err.message === "Only PDF, JPG, JPEG, PNG files allowed") {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // ✅ Default error
  return res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

export default errorHandler;