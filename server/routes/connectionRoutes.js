const express = require("express");

const router = express.Router();

const {
  sendConnectionRequest,
  getReceivedRequests,
  getSentRequests,
  acceptConnection,
  rejectConnection,
} = require("../controllers/connectionController");

const {
  protect,
} = require("../middleware/authMiddleware");

// ======================================
// SEND CONNECTION
// ======================================

router.post(
  "/send/:userId",
  protect,
  sendConnectionRequest
);

// ======================================
// RECEIVED
// ======================================

router.get(
  "/received",
  protect,
  getReceivedRequests
);

// ======================================
// SENT
// ======================================

router.get(
  "/sent",
  protect,
  getSentRequests
);

// ======================================
// ACCEPT
// ======================================

router.put(
  "/accept/:connectionId",
  protect,
  acceptConnection
);

// ======================================
// REJECT
// ======================================

router.put(
  "/reject/:connectionId",
  protect,
  rejectConnection
);

module.exports = router;