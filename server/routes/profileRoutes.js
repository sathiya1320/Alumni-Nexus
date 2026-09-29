const express = require("express");

const router = express.Router();


// ==========================================
// CONTROLLER
// ==========================================

const {
  getMyProfile,
  updateMyProfile
} = require("../controllers/profileController");


// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const {
  protect
} = require("../middleware/authMiddleware");


// ==========================================
// GET MY PROFILE
// ==========================================

router.get(
  "/me",
  protect,
  getMyProfile
);


// ==========================================
// UPDATE MY PROFILE
// ==========================================

router.put(
  "/me",
  protect,
  updateMyProfile
);


// ==========================================
// EXPORT
// ==========================================

module.exports = router;