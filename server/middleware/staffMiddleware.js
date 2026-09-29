const staffOnly = (req, res, next) => {
  try {
    // ------------------------------------------
    // CHECK LOGIN
    // ------------------------------------------

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // ------------------------------------------
    // CHECK STAFF ROLE
    // ------------------------------------------

    if (req.user.role !== "staff") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Staff permission required.",
      });
    }

    // ------------------------------------------
    // STAFF ALLOWED
    // ------------------------------------------

    next();

  } catch (error) {
    console.error(
      "STAFF MIDDLEWARE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Authorization error",
    });
  }
};

module.exports = {
  staffOnly,
};