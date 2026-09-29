const mongoose = require("mongoose");

const alumniProfileHistorySchema = new mongoose.Schema(
  {
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    updatedByRole: {
      type: String,
      enum: ["alumni", "staff"],
      required: true
    },

    changes: [
      {
        field: {
          type: String,
          required: true
        },

        oldValue: {
          type: String,
          default: ""
        },

        newValue: {
          type: String,
          default: ""
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "AlumniProfileHistory",
  alumniProfileHistorySchema
);