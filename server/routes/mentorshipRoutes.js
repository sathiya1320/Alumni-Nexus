const express = require("express");

const router = express.Router();

const {
  sendMentorshipRequest,
  getMyMentorshipRequests,
  getAlumniRequests,
  updateMentorshipStatus,
} = require("../controllers/mentorshipController");

const {
  protect,
} = require("../middleware/authMiddleware");

// ======================================
// STUDENT SEND
// ======================================

router.post(
  "/request",
  protect,
  sendMentorshipRequest
);

// ======================================
// STUDENT OWN REQUESTS
// ======================================

router.get(
  "/my-requests",
  protect,
  getMyMentorshipRequests
);

// ======================================
// ALUMNI RECEIVED
// ======================================

router.get(
  "/alumni-requests",
  protect,
  getAlumniRequests
);

// ======================================
// ACCEPT / REJECT
// ======================================

router.put(
  "/:id/status",
  protect,
  updateMentorshipStatus
);

module.exports = router;