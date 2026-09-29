const Notification =
  require("../models/Notification");

// =====================================================
// GET USER NOTIFICATIONS
// =====================================================

const getNotifications =
  async (req, res) => {
    try {
      const notifications =
        await Notification.find({
          receiver: req.user._id,
        })
          .populate(
            "sender",
            "name role"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        notifications,
      });
    } catch (error) {
      console.error(
        "GET NOTIFICATION ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to fetch notifications",
      });
    }
  };

// =====================================================
// GET UNREAD COUNT
// =====================================================

const getUnreadCount =
  async (req, res) => {
    try {
      const count =
        await Notification.countDocuments({
          receiver: req.user._id,
          isRead: false,
        });

      return res.status(200).json({
        count,
      });
    } catch (error) {
      console.error(
        "GET UNREAD COUNT ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to fetch unread count",
      });
    }
  };

// =====================================================
// MARK ONE AS READ
// =====================================================

const markAsRead =
  async (req, res) => {
    try {
      const notification =
        await Notification.findOne({
          _id: req.params.id,
          receiver: req.user._id,
        });

      if (!notification) {
        return res.status(404).json({
          message:
            "Notification not found",
        });
      }

      notification.isRead =
        true;

      await notification.save();

      return res.status(200).json({
        message:
          "Notification marked as read",
      });
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to update notification",
      });
    }
  };

// =====================================================
// MARK ALL AS READ
// =====================================================

const markAllAsRead =
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          receiver:
            req.user._id,

          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        }
      );

      return res.status(200).json({
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      console.error(
        "MARK ALL NOTIFICATIONS READ ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to update notifications",
      });
    }
  };

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};