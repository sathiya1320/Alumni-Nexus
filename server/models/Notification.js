const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "connection",
        "mentorship",
        "job",
        "event",
        "system",
      ],
      default: "system",
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Job notification details
    jobTitle: {
      type: String,
      default: "",
      trim: true,
    },

    companyName: {
      type: String,
      default: "",
      trim: true,
    },

    applicationStatus: {
      type: String,
      default: "",
      trim: true,
    },

    // Event notification details
    eventTitle: {
      type: String,
      default: "",
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);