const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} = require(
  "../controllers/notificationController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// =====================================================
// GET ALL NOTIFICATIONS
// =====================================================

router.get(
  "/",
  protect,
  getNotifications
);

// =====================================================
// GET UNREAD COUNT
// =====================================================

router.get(
  "/unread-count",
  protect,
  getUnreadCount
);

// =====================================================
// MARK ONE AS READ
// =====================================================

router.put(
  "/read/:id",
  protect,
  markAsRead
);

// =====================================================
// MARK ALL AS READ
// =====================================================

router.put(
  "/read-all",
  protect,
  markAllAsRead
);

module.exports = router;