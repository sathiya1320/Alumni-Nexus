const MentorshipRequest =
  require("../models/MentorshipRequest");

const User =
  require("../models/User");

const Notification =
  require("../models/Notification");

// ==========================================
// SEND MENTORSHIP REQUEST
// ==========================================

const sendMentorshipRequest =
  async (req, res) => {
    try {
      const {
        mentorId,
        message,
      } = req.body;

      // =====================================
      // ONLY STUDENT
      // =====================================

      if (req.user.role !== "student") {
        return res.status(403).json({
          message:
            "Only students can send mentorship requests",
        });
      }

      // =====================================
      // FIND ALUMNI
      // =====================================

      const mentor =
        await User.findById(mentorId);

      if (!mentor) {
        return res.status(404).json({
          message:
            "Alumni not found",
        });
      }

      if (mentor.role !== "alumni") {
        return res.status(400).json({
          message:
            "You can only request mentorship from alumni",
        });
      }

      // =====================================
      // CHECK EXISTING PENDING REQUEST
      // =====================================

      const existingRequest =
        await MentorshipRequest.findOne({
          student: req.user._id,
          mentor: mentorId,
          status: "pending",
        });

      if (existingRequest) {
        return res.status(400).json({
          message:
            "Mentorship request already sent",
        });
      }

      // =====================================
      // CREATE REQUEST
      // =====================================

      const request =
        await MentorshipRequest.create({
          student: req.user._id,
          mentor: mentorId,
          message: message || "",
          status: "pending",
          meetingLink: "",
        });

      const student =
        await User.findById(
          req.user._id
        );

      // =====================================
      // NOTIFICATION FOR ALUMNI
      // =====================================

      await Notification.create({
        receiver: mentorId,
        sender: req.user._id,

        title:
          "New Mentorship Request",

        message:
          `${student.name} sent you a mentorship request.`,

        type: "mentorship",

        relatedId: request._id,

        isRead: false,
      });

      res.status(201).json({
        message:
          "Mentorship request sent successfully 🎓",
        request,
      });
    } catch (error) {
      console.error(
        "SEND MENTORSHIP ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Unable to send mentorship request",
      });
    }
  };

// ==========================================
// GET MY REQUESTS - STUDENT
// ==========================================

const getMyMentorshipRequests =
  async (req, res) => {
    try {
      // ONLY STUDENT
      if (req.user.role !== "student") {
        return res.status(403).json({
          message:
            "Only students can view their mentorship requests",
        });
      }

      const requests =
        await MentorshipRequest.find({
          student: req.user._id,
        })
          .populate(
            "mentor",
            "name email department company designation"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        requests,
      });
    } catch (error) {
      console.error(
        "GET MY MENTORSHIP ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load requests",
      });
    }
  };

// ==========================================
// GET REQUESTS - ALUMNI
// ==========================================

const getAlumniRequests =
  async (req, res) => {
    try {
      // ONLY ALUMNI
      if (req.user.role !== "alumni") {
        return res.status(403).json({
          message:
            "Only alumni can view mentorship requests",
        });
      }

      const requests =
        await MentorshipRequest.find({
          mentor: req.user._id,
        })
          .populate(
            "student",
            "name email department passingYear skills"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        requests,
      });
    } catch (error) {
      console.error(
        "GET ALUMNI MENTORSHIP ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Unable to load mentorship requests",
      });
    }
  };

// ==========================================
// ACCEPT / REJECT
// ==========================================

const updateMentorshipStatus =
  async (req, res) => {
    try {
      const {
        status,
        meetingLink,
      } = req.body;

      // =====================================
      // ONLY ACCEPTED OR REJECTED
      // =====================================

      if (
        status !== "accepted" &&
        status !== "rejected"
      ) {
        return res.status(400).json({
          message:
            "Invalid status",
        });
      }

      // =====================================
      // FIND REQUEST
      // =====================================

      const request =
        await MentorshipRequest.findOne({
          _id: req.params.id,
          mentor: req.user._id,
        });

      if (!request) {
        return res.status(404).json({
          message:
            "Request not found",
        });
      }

      // =====================================
      // ACCEPTED
      // GOOGLE MEET LINK REQUIRED
      // =====================================

      if (status === "accepted") {
        if (!meetingLink || !meetingLink.trim()) {
          return res.status(400).json({
            message:
              "Google Meet link is required to accept mentorship",
          });
        }

        if (
          !meetingLink.includes(
            "meet.google.com"
          )
        ) {
          return res.status(400).json({
            message:
              "Please enter a valid Google Meet link",
          });
        }

        request.status = "accepted";
        request.meetingLink =
          meetingLink.trim();
      }

      // =====================================
      // REJECTED
      // =====================================

      if (status === "rejected") {
        request.status = "rejected";
        request.meetingLink = "";
      }

      await request.save();

      // =====================================
      // GET ALUMNI
      // =====================================

      const alumni =
        await User.findById(
          req.user._id
        );

      // =====================================
      // NOTIFY STUDENT
      // =====================================

      let notificationMessage;

      if (status === "accepted") {
        notificationMessage =
          `${alumni.name} accepted your mentorship request. Google Meet link: ${request.meetingLink}`;
      } else {
        notificationMessage =
          `${alumni.name} rejected your mentorship request.`;
      }

      await Notification.create({
        receiver: request.student,
        sender: req.user._id,

        title:
          status === "accepted"
            ? "Mentorship Request Accepted"
            : "Mentorship Request Rejected",

        message:
          notificationMessage,

        type: "mentorship",

        relatedId: request._id,

        isRead: false,
      });

      // =====================================
      // RESPONSE
      // =====================================

      res.status(200).json({
        message:
          status === "accepted"
            ? "Mentorship request accepted"
            : "Mentorship request rejected",

        request,
      });
    } catch (error) {
      console.error(
        "UPDATE MENTORSHIP ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Unable to update request",
      });
    }
  };

module.exports = {
  sendMentorshipRequest,
  getMyMentorshipRequests,
  getAlumniRequests,
  updateMentorshipStatus,
};