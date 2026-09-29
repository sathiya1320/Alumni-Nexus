const express = require("express");

const router = express.Router();

const {
  getAlumniDashboard,
  getStudentDashboard,
  getStaffDashboard
} = require("../controllers/dashboardController");

const {
  protect
} = require("../middleware/authMiddleware");

// =====================================
// ALUMNI DASHBOARD
// =====================================

router.get(
  "/alumni",
  protect,
  getAlumniDashboard
);

// =====================================
// STUDENT DASHBOARD
// =====================================

router.get(
  "/student",
  protect,
  getStudentDashboard
);

// =====================================
// STAFF DASHBOARD
// =====================================

router.get(
  "/staff",
  protect,
  getStaffDashboard
);

module.exports = router;