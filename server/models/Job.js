const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["Full Time", "Part Time", "Internship", "Contract"],
      required: true,
    },

    workMode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      required: true,
    },

    requirements: {
      type: String,
      default: "",
    },

    responsibilities: {
      type: String,
      default: "",
    },

    deadline: {
      type: Date,
      required: true,
    },

    applicationLink: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Published", "Closed", "Draft"],
      default: "Published",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);