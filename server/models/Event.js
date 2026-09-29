const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    // ==========================================
    // EVENT TITLE
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // EVENT CATEGORY
    // ==========================================

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // EVENT DATE
    // ==========================================

    date: {
      type: Date,
      required: true,
    },

    // ==========================================
    // EVENT LOCATION
    // ==========================================

    location: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // EVENT DESCRIPTION
    // ==========================================

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // CREATED BY STAFF
    // ==========================================

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // EVENT STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    // ==========================================
    // EVENT REGISTRATIONS
    // ==========================================

    registrations: [
      {
        // --------------------------------------
        // USER
        // --------------------------------------

        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        // --------------------------------------
        // PARTICIPATION INTEREST
        // --------------------------------------
        // false/default is important because
        // old registrations may not have this field

        participationInterest: {
          type: String,
          required: false,
          default: "Other",
          trim: true,
        },

        // --------------------------------------
        // OPTIONAL MESSAGE
        // --------------------------------------

        message: {
          type: String,
          default: "",
          trim: true,
        },

        // --------------------------------------
        // REGISTRATION STATUS
        // --------------------------------------

        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },

        // --------------------------------------
        // REGISTERED DATE
        // --------------------------------------

        registeredAt: {
          type: Date,
          default: Date.now,
        },

        // --------------------------------------
        // REVIEWED DATE
        // --------------------------------------

        reviewedAt: {
          type: Date,
          default: null,
        },

        // --------------------------------------
        // REVIEWED BY STAFF
        // --------------------------------------

        reviewedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);