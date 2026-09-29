const express = require("express");

const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  getAllJobsForStaff,
  updateJob,
  deleteJob,
  uploadResume,
  updateLinkedIn,
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getJobApplicationById,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

const uploadResumeMiddleware =
  require("../middleware/uploadResume");

// =====================================================
// GET PUBLISHED JOBS
// =====================================================

router.get(
  "/",
  protect,
  getJobs
);

// =====================================================
// UPLOAD RESUME
// =====================================================

router.post(
  "/profile/resume",
  protect,
  uploadResumeMiddleware.single("resume"),
  uploadResume
);

// =====================================================
// UPDATE LINKEDIN
// =====================================================

router.put(
  "/profile/linkedin",
  protect,
  updateLinkedIn
);

// =====================================================
// MY APPLICATIONS
// =====================================================

router.get(
  "/applications/my",
  protect,
  getMyApplications
);

// =====================================================
// STAFF - ALL JOBS
// =====================================================

router.get(
  "/staff/all",
  protect,
  getAllJobsForStaff
);

// =====================================================
// STAFF - CREATE JOB
// =====================================================

router.post(
  "/",
  protect,
  createJob
);

// =====================================================
// STAFF - SINGLE APPLICATION
// IMPORTANT: BEFORE /:id
// =====================================================

router.get(
  "/applications/:applicationId",
  protect,
  getJobApplicationById
);

// =====================================================
// STAFF - APPLICATIONS FOR A JOB
// =====================================================

router.get(
  "/:id/applications",
  protect,
  getJobApplications
);

// =====================================================
// STUDENT / ALUMNI - APPLY
// =====================================================

router.post(
  "/:id/apply",
  protect,
  applyForJob
);

// =====================================================
// STAFF - UPDATE APPLICATION STATUS
// =====================================================

router.put(
  "/applications/:applicationId/status",
  protect,
  updateApplicationStatus
);

// =====================================================
// STAFF - UPDATE JOB
// =====================================================

router.put(
  "/:id",
  protect,
  updateJob
);

// =====================================================
// STAFF - DELETE JOB
// =====================================================

router.delete(
  "/:id",
  protect,
  deleteJob
);

// =====================================================
// GET SINGLE JOB
// KEEP LAST
// =====================================================

router.get(
  "/:id",
  protect,
  getJobById
);

module.exports = router;