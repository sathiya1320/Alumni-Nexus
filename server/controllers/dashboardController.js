const User = require("../models/User");
const Event = require("../models/Event");
const Job = require("../models/Job");
const MentorshipRequest = require("../models/MentorshipRequest");

// ======================================================
// ALUMNI DASHBOARD
// ======================================================

const getAlumniDashboard = async (req, res) => {
  try {

    // -----------------------------------------------
    // ROLE CHECK
    // -----------------------------------------------

    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    if (req.user.role !== "alumni") {
      return res.status(403).json({
        message: "Access denied. Alumni only."
      });
    }

    // -----------------------------------------------
    // NETWORK MEMBERS
    // -----------------------------------------------

    const totalNetworkMembers =
      await User.countDocuments();

    // -----------------------------------------------
    // TOTAL ALUMNI
    // -----------------------------------------------

    const totalAlumni =
      await User.countDocuments({
        role: "alumni"
      });

    // -----------------------------------------------
    // TOTAL STUDENTS
    // -----------------------------------------------

    const totalStudents =
      await User.countDocuments({
        role: "student"
      });

    // -----------------------------------------------
    // PENDING MENTORSHIP REQUESTS
    // -----------------------------------------------

    const pendingMentorshipRequests =
      await MentorshipRequest.countDocuments({
        mentor: req.user._id,
        status: "pending"
      });

    // -----------------------------------------------
    // JOBS POSTED BY CURRENT ALUMNI
    // -----------------------------------------------

    const jobsPosted =
      await Job.countDocuments({
        postedBy: req.user._id
      });

    // -----------------------------------------------
    // UPCOMING EVENTS
    // -----------------------------------------------

    const upcomingEvents =
      await Event.countDocuments({
        date: {
          $gte: new Date()
        }
      });

    // -----------------------------------------------
    // RECENT USERS
    // -----------------------------------------------

    const recentUsers =
      await User.find()
        .select(
          "name email role department passingYear createdAt"
        )
        .sort({
          createdAt: -1
        })
        .limit(5)
        .lean();

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({

      totalNetworkMembers,

      totalAlumni,

      totalStudents,

      pendingMentorshipRequests,

      jobsPosted,

      upcomingEvents,

      recentUsers

    });

  } catch (error) {

    console.error(
      "ALUMNI DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to load dashboard",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined
    });
  }
};


// ======================================================
// STUDENT DASHBOARD
// ======================================================

const getStudentDashboard = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Access denied. Student only."
      });
    }

    // -----------------------------------------------
    // TOTAL ALUMNI
    // -----------------------------------------------

    const totalAlumni =
      await User.countDocuments({
        role: "alumni"
      });

    // -----------------------------------------------
    // UPCOMING EVENTS
    // -----------------------------------------------

    const upcomingEvents =
      await Event.countDocuments({
        date: {
          $gte: new Date()
        }
      });

    // -----------------------------------------------
    // AVAILABLE JOBS
    // -----------------------------------------------

    const availableJobs =
      await Job.countDocuments();

    // -----------------------------------------------
    // STUDENT MENTORSHIP REQUESTS
    // -----------------------------------------------

    const mentorshipRequests =
      await MentorshipRequest.countDocuments({
        student: req.user._id
      });

    // -----------------------------------------------
    // PENDING REQUESTS
    // -----------------------------------------------

    const pendingRequests =
      await MentorshipRequest.countDocuments({
        student: req.user._id,
        status: "pending"
      });

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({

      totalAlumni,

      upcomingEvents,

      availableJobs,

      mentorshipRequests,

      pendingRequests

    });

  } catch (error) {

    console.error(
      "STUDENT DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to load dashboard",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined
    });
  }
};


// ======================================================
// STAFF DASHBOARD
// ======================================================

const getStaffDashboard = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    if (
      req.user.role !== "staff" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Access denied. Staff only."
      });
    }

    // -----------------------------------------------
    // USERS
    // -----------------------------------------------

    const totalUsers =
      await User.countDocuments();

    const totalStudents =
      await User.countDocuments({
        role: "student"
      });

    const totalAlumni =
      await User.countDocuments({
        role: "alumni"
      });

    const totalStaff =
      await User.countDocuments({
        role: "staff"
      });

    // -----------------------------------------------
    // EVENTS
    // -----------------------------------------------

    const totalEvents =
      await Event.countDocuments();

    // -----------------------------------------------
    // JOBS
    // -----------------------------------------------

    const totalJobs =
      await Job.countDocuments();

    // -----------------------------------------------
    // MENTORSHIP
    // -----------------------------------------------

    const totalMentorshipRequests =
      await MentorshipRequest.countDocuments();

    const pendingMentorshipRequests =
      await MentorshipRequest.countDocuments({
        status: "pending"
      });

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.status(200).json({

      totalUsers,

      totalStudents,

      totalAlumni,

      totalStaff,

      totalEvents,

      totalJobs,

      totalMentorshipRequests,

      pendingMentorshipRequests

    });

  } catch (error) {

    console.error(
      "STAFF DASHBOARD ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to load dashboard",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

  getAlumniDashboard,

  getStudentDashboard,

  getStaffDashboard

};