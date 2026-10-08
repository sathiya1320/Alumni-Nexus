const mongoose = require("mongoose");

const mentorshipRequestSchema = new mongoose.Schema(
  {
    // ===================================
    // STUDENT
    // ===================================

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ===================================
    // ALUMNI / MENTOR
    // ===================================

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ===================================
    // MESSAGE
    // ===================================

    message: {
      type: String,
      default: "",
      trim: true,
    },

    // ===================================
    // STATUS
    // ===================================

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },

    // ===================================
    // GOOGLE MEET LINK
    // ===================================

    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MentorshipRequest",
  mentorshipRequestSchema
);