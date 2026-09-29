const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// PROTECT ROUTES
// ==========================================

const protect = async (req, res, next) => {
  try {

    // ======================================
    // GET AUTHORIZATION HEADER
    // ======================================

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Expected:
    // Authorization: Bearer TOKEN

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token missing",
      });
    }

    // ======================================
    // VERIFY TOKEN
    // ======================================

    let decoded;

    try {

      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    } catch (jwtError) {

      if (jwtError.name === "TokenExpiredError") {

        console.log("AUTH ERROR: jwt expired");

        return res.status(401).json({
          message: "Session expired. Please login again.",
          code: "TOKEN_EXPIRED",
        });

      }

      console.log(
        "AUTH ERROR:",
        jwtError.message
      );

      return res.status(401).json({
        message: "Invalid authentication token",
        code: "INVALID_TOKEN",
      });
    }

    // ======================================
    // CHECK USER ID
    // ======================================

    if (!decoded || !decoded.id) {

      return res.status(401).json({
        message: "Invalid token data",
      });

    }

    // ======================================
    // FIND USER
    // ======================================

    const user = await User.findById(
      decoded.id
    ).select("-password");

    if (!user) {

      return res.status(401).json({
        message: "User account not found",
      });

    }

    // ======================================
    // ATTACH USER TO REQUEST
    // ======================================

    req.user = user;

    next();

  } catch (error) {

    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error
    );

    return res.status(500).json({
      message: "Authentication failed",
    });

  }
};


// ==========================================
// ROLE CHECK MIDDLEWARE
// ==========================================

const authorizeRoles = (...roles) => {

  return (req, res, next) => {

    if (!req.user) {

      return res.status(401).json({
        message: "User not authenticated",
      });

    }

    if (!roles.includes(req.user.role)) {

      return res.status(403).json({
        message: "Access denied",
      });

    }

    next();

  };

};


module.exports = {
  protect,
  authorizeRoles,
};