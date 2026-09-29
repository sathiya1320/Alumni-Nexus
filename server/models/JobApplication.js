const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Resume snapshot at application time
    resumeUrl: {
      type: String,
      required: true,
    },

    resumeName: {
      type: String,
      required: true,
    },

    // LinkedIn snapshot at application time
    linkedinUrl: {
      type: String,
      required: true,
    },

    // Applicant cover message
    coverMessage: {
      type: String,
      default: "",
    },

    // Application status
    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Selected",
        "Rejected",
      ],
      default: "Applied",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Same user cannot apply twice for same job
jobApplicationSchema.index(
  {
    job: 1,
    applicant: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);