const express = require("express");

const router = express.Router();

const {
  createEvent,
  getEvents,
  getAllEventsForStaff,
  registerEvent,
  approveRegistration,
  rejectRegistration,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
} = require("../controllers/eventController");

const {
  protect,
} = require("../middleware/authMiddleware");

// =====================================================
// GET APPROVED EVENTS
// =====================================================

router.get(
  "/",
  protect,
  getEvents
);

// =====================================================
// STAFF - GET ALL EVENTS
// IMPORTANT: keep before /:id routes
// =====================================================

router.get(
  "/staff/all",
  protect,
  getAllEventsForStaff
);

// =====================================================
// STAFF - CREATE EVENT
// =====================================================

router.post(
  "/",
  protect,
  createEvent
);

// =====================================================
// STUDENT / ALUMNI - REGISTER
// =====================================================

router.post(
  "/:id/register",
  protect,
  registerEvent
);

// =====================================================
// STAFF - GET REGISTRATIONS
// =====================================================

router.get(
  "/:id/registrations",
  protect,
  getEventRegistrations
);

// =====================================================
// STAFF - APPROVE REGISTRATION
// =====================================================

router.put(
  "/:id/registrations/:registrationId/approve",
  protect,
  approveRegistration
);

// =====================================================
// STAFF - REJECT REGISTRATION
// =====================================================

router.put(
  "/:id/registrations/:registrationId/reject",
  protect,
  rejectRegistration
);

// =====================================================
// STAFF - UPDATE EVENT
// =====================================================

router.put(
  "/:id",
  protect,
  updateEvent
);

// =====================================================
// STAFF - DELETE EVENT
// =====================================================

router.delete(
  "/:id",
  protect,
  deleteEvent
);

module.exports = router;