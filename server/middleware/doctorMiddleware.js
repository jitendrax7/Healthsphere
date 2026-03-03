export const doctorOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    if (req.user.role !== "doctor") {
      return res.status(403).json({
        message: "Access denied. Doctor only route."
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};