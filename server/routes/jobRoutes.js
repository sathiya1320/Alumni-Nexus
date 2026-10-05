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

const {
  protect,
} = require("../middleware/authMiddleware");

const uploadResumeMiddleware =
  require("../middleware/uploadResume");

// =====================================================
// GET ALL PUBLISHED JOBS
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
// JOB MANAGEMENT
//
// STAFF  -> ALL JOBS
// ALUMNI -> OWN JOBS
// =====================================================

router.get(
  "/staff/all",
  protect,
  getAllJobsForStaff
);

// =====================================================
// CREATE JOB
//
// STAFF + ALUMNI
// =====================================================

router.post(
  "/",
  protect,
  createJob
);

// =====================================================
// SINGLE APPLICATION
//
// STAFF + JOB OWNER ALUMNI
// =====================================================

router.get(
  "/applications/:applicationId",
  protect,
  getJobApplicationById
);

// =====================================================
// JOB APPLICATIONS
//
// STAFF + JOB OWNER ALUMNI
// =====================================================

router.get(
  "/:id/applications",
  protect,
  getJobApplications
);

// =====================================================
// APPLY JOB
//
// STUDENT + ALUMNI
// =====================================================

router.post(
  "/:id/apply",
  protect,
  applyForJob
);

// =====================================================
// UPDATE APPLICATION STATUS
//
// STAFF + JOB OWNER ALUMNI
// =====================================================

router.put(
  "/applications/:applicationId/status",
  protect,
  updateApplicationStatus
);

// =====================================================
// UPDATE JOB
//
// STAFF + JOB OWNER ALUMNI
// =====================================================

router.put(
  "/:id",
  protect,
  updateJob
);

// =====================================================
// DELETE JOB
//
// STAFF + JOB OWNER ALUMNI
// =====================================================

router.delete(
  "/:id",
  protect,
  deleteJob
);

// =====================================================
// GET SINGLE JOB
// =====================================================

router.get(
  "/:id",
  protect,
  getJobById
);

module.exports = router;