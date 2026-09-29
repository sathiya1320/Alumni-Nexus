const Connection = require("../models/Connection");
const User = require("../models/User");
const Notification = require("../models/Notification");

// ==========================================
// SEND CONNECTION REQUEST
// ==========================================

const sendConnectionRequest = async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const senderId = req.user._id;

    // =====================================
    // CHECK RECEIVER
    // =====================================

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =====================================
    // CHECK SENDER
    // =====================================

    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(404).json({
        message: "Sender not found",
      });
    }

    // =====================================
    // SELF CONNECTION
    // =====================================

    if (
      senderId.toString() ===
      receiverId.toString()
    ) {
      return res.status(400).json({
        message:
          "You cannot connect with yourself",
      });
    }

    // =====================================
    // STUDENT CAN CONNECT TO ALUMNI
    // =====================================

    if (
      sender.role === "student" &&
      receiver.role !== "alumni"
    ) {
      return res.status(400).json({
        message:
          "Students can connect with alumni only",
      });
    }

    // =====================================
    // CHECK EXISTING CONNECTION
    // =====================================

    const existingConnection =
      await Connection.findOne({
        $or: [
          {
            sender: senderId,
            receiver: receiverId,
          },
          {
            sender: receiverId,
            receiver: senderId,
          },
        ],
      });

    if (existingConnection) {
      if (
        existingConnection.status ===
        "accepted"
      ) {
        return res.status(400).json({
          message: "You are already connected",
        });
      }

      if (
        existingConnection.status ===
        "pending"
      ) {
        return res.status(400).json({
          message:
            "Connection request is already pending",
        });
      }

      // If previous request was rejected,
      // allow a new request.
      existingConnection.sender = senderId;
      existingConnection.receiver =
        receiverId;
      existingConnection.status = "pending";
      existingConnection.requestType =
        "connection";

      await existingConnection.save();

      await Notification.create({
        receiver: receiverId,
        sender: senderId,
        title: "New Connection Request",
        message:
          `${sender.name} wants to connect with you.`,
        type: "connection",
        relatedId: existingConnection._id,
        isRead: false,
      });

      return res.status(201).json({
        message:
          "Connection request sent successfully 🤝",
        connection: existingConnection,
      });
    }

    // =====================================
    // CREATE CONNECTION
    // =====================================

    const connection =
      await Connection.create({
        sender: senderId,
        receiver: receiverId,
        requestType: "connection",
        status: "pending",
      });

    // =====================================
    // CREATE NOTIFICATION FOR ALUMNI
    // =====================================

    await Notification.create({
      receiver: receiverId,
      sender: senderId,
      title: "New Connection Request",
      message:
        `${sender.name} wants to connect with you.`,
      type: "connection",
      relatedId: connection._id,
      isRead: false,
    });

    res.status(201).json({
      message:
        "Connection request sent successfully 🤝",
      connection,
    });
  } catch (error) {
    console.error(
      "SEND CONNECTION ERROR:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Unable to send connection request",
    });
  }
};

// ==========================================
// GET RECEIVED REQUESTS
// ==========================================

const getReceivedRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await Connection.find({
        receiver: req.user._id,
      })
        .populate(
          "sender",
          "name email role company department designation skills passingYear location"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error(
      "GET RECEIVED REQUEST ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Unable to fetch received requests",
    });
  }
};

// ==========================================
// GET SENT REQUESTS
// ==========================================

const getSentRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await Connection.find({
        sender: req.user._id,
      })
        .populate(
          "receiver",
          "name email role company department designation"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      requests,
    });
  } catch (error) {
    console.error(
      "GET SENT REQUEST ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Unable to fetch sent requests",
    });
  }
};

// ==========================================
// ACCEPT CONNECTION
// ==========================================

const acceptConnection = async (
  req,
  res
) => {
  try {
    const connection =
      await Connection.findById(
        req.params.connectionId
      );

    if (!connection) {
      return res.status(404).json({
        message:
          "Connection request not found",
      });
    }

    // Only receiver
    if (
      connection.receiver.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized",
      });
    }

    connection.status = "accepted";

    await connection.save();

    const receiver = await User.findById(
      req.user._id
    );

    // =====================================
    // NOTIFY SENDER
    // =====================================

    await Notification.create({
      receiver: connection.sender,
      sender: req.user._id,
      title:
        "Connection Request Accepted",
      message:
        `${receiver.name} accepted your connection request.`,
      type: "connection",
      relatedId: connection._id,
      isRead: false,
    });

    res.status(200).json({
      message:
        "Connection request accepted successfully 🤝",
      connection,
    });
  } catch (error) {
    console.error(
      "ACCEPT CONNECTION ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Unable to accept request",
    });
  }
};

// ==========================================
// REJECT CONNECTION
// ==========================================

const rejectConnection = async (
  req,
  res
) => {
  try {
    const connection =
      await Connection.findById(
        req.params.connectionId
      );

    if (!connection) {
      return res.status(404).json({
        message:
          "Connection request not found",
      });
    }

    // Only receiver
    if (
      connection.receiver.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized",
      });
    }

    connection.status = "rejected";

    await connection.save();

    const receiver = await User.findById(
      req.user._id
    );

    // =====================================
    // NOTIFY SENDER
    // =====================================

    await Notification.create({
      receiver: connection.sender,
      sender: req.user._id,
      title: "Connection Request Rejected",
      message:
        `${receiver.name} rejected your connection request.`,
      type: "connection",
      relatedId: connection._id,
      isRead: false,
    });

    res.status(200).json({
      message:
        "Connection request rejected successfully",
    });
  } catch (error) {
    console.error(
      "REJECT CONNECTION ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Unable to reject request",
    });
  }
};

module.exports = {
  sendConnectionRequest,
  getReceivedRequests,
  getSentRequests,
  acceptConnection,
  rejectConnection,
};