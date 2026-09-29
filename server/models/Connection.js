const mongoose = require("mongoose");


const connectionSchema = new mongoose.Schema(

  {

    // ===============================
    // REQUEST SENDER
    // ===============================

    sender: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true

    },


    // ===============================
    // REQUEST RECEIVER
    // ===============================

    receiver: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true

    },


    // ===============================
    // REQUEST TYPE
    // ===============================

    requestType: {

      type: String,

      enum: [

        "connection",

        "mentorship"

      ],

      default: "connection"

    },


    // ===============================
    // STATUS
    // ===============================

    status: {

      type: String,

      enum: [

        "pending",

        "accepted",

        "rejected"

      ],

      default: "pending"

    },


    // ===============================
    // MENTORSHIP TOPIC
    // ===============================

    mentorshipTopic: {

      type: String,

      default: ""

    },


    // ===============================
    // STUDENT QUESTION
    // ===============================

    questions: {

      type: String,

      default: ""

    },


    // ===============================
    // PREFERRED DATE
    // ===============================

    preferredDate: {

      type: String,

      default: ""

    },


    // ===============================
    // MEETING MODE
    // ===============================

    preferredMode: {

      type: String,

      enum: [

        "",

        "Google Meet",

        "Zoom",

        "Phone Call",

        "In Person"

      ],

      default: ""

    },


    // ===============================
    // MEETING LINK
    // ===============================

    meetingLink: {

      type: String,

      default: ""

    }

  },


  {

    timestamps: true

  }

);


module.exports = mongoose.model(

  "Connection",

  connectionSchema

);