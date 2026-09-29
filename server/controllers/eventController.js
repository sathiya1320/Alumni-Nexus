const Event = require("../models/Event");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// =====================================================
// CREATE EVENT - STAFF ONLY
// =====================================================

const createEvent = async (req, res) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({
        message: "Only staff can create events",
      });
    }

    const {
      title,
      category,
      date,
      location,
      description,
    } = req.body || {};

    if (
      !title ||
      !category ||
      !date ||
      !location ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill all event fields",
      });
    }

    const event = await Event.create({
      title: title.trim(),
      category: category.trim(),
      date,
      location: location.trim(),
      description: description.trim(),
      createdBy: req.user._id,
      status: "approved",
    });

    const populatedEvent =
      await Event.findById(event._id)
        .populate(
          "createdBy",
          "name email role"
        );

    return res.status(201).json({
      message: "Event created successfully",
      event: populatedEvent,
    });

  } catch (error) {
    console.error(
      "CREATE EVENT ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to create event",
    });
  }
};

// =====================================================
// GET APPROVED EVENTS
// =====================================================

const getEvents = async (req, res) => {
  try {
    const events =
      await Event.find({
        status: "approved",
      })
        .populate(
          "createdBy",
          "name email role"
        )
        .sort({
          date: 1,
        })
        .lean();

    const currentUserId =
      req.user._id.toString();

    const result = events.map((event) => {
      const registrations =
        event.registrations || [];

      const myRegistration =
        registrations.find(
          (registration) =>
            registration.user &&
            registration.user.toString() ===
              currentUserId
        );

      return {
        _id: event._id,

        title: event.title,

        category: event.category,

        date: event.date,

        location: event.location,

        description:
          event.description,

        createdBy:
          event.createdBy,

        registrationCount:
          registrations.length,

        myRegistration:
          myRegistration
            ? {
                _id:
                  myRegistration._id,

                status:
                  myRegistration.status ||
                  "pending",

                participationInterest:
                  myRegistration.participationInterest ||
                  "Other",

                message:
                  myRegistration.message ||
                  "",

                registeredAt:
                  myRegistration.registeredAt,

                reviewedAt:
                  myRegistration.reviewedAt,
              }
            : null,
      };
    });

    return res.json(result);

  } catch (error) {
    console.error(
      "GET EVENTS ERROR:",
      error
    );

    return res.status(500).json({
      message: "Unable to load events",
    });
  }
};

// =====================================================
// GET ALL EVENTS - STAFF
// =====================================================

const getAllEventsForStaff = async (
  req,
  res
) => {
  try {
    if (req.user.role !== "staff") {
      return res.status(403).json({
        message:
          "Only staff can view all events",
      });
    }

    const events =
      await Event.find()
        .populate(
          "createdBy",
          "name email role"
        )
        .populate(
          "registrations.user",
          "name email role department passingYear"
        )
        .populate(
          "registrations.reviewedBy",
          "name email role"
        )
        .sort({
          date: 1,
        });

    return res.json(events);

  } catch (error) {
    console.error(
      "GET STAFF EVENTS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load staff events",
    });
  }
};

// =====================================================
// REGISTER EVENT - STUDENT / ALUMNI
// =====================================================

const registerEvent = async (
  req,
  res
) => {
  try {

    // -----------------------------------------------
    // ROLE CHECK
    // -----------------------------------------------

    if (
      req.user.role !== "student" &&
      req.user.role !== "alumni"
    ) {
      return res.status(403).json({
        message:
          "Only students and alumni can register for events",
      });
    }

    // -----------------------------------------------
    // REQUEST BODY
    // -----------------------------------------------

    const {
      participationInterest,
      message = "",
    } = req.body || {};

    // -----------------------------------------------
    // VALIDATE INTEREST
    // -----------------------------------------------

    if (
      !participationInterest ||
      !participationInterest.trim()
    ) {
      return res.status(400).json({
        message:
          "Please select what type of event you are interested in",
      });
    }

    // -----------------------------------------------
    // VALIDATE EVENT ID
    // -----------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        message: "Invalid event ID",
      });
    }

    // -----------------------------------------------
    // FIND EVENT
    // -----------------------------------------------

    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // -----------------------------------------------
    // EVENT STATUS
    // -----------------------------------------------

    if (event.status !== "approved") {
      return res.status(400).json({
        message:
          "This event is not available for registration",
      });
    }

    // -----------------------------------------------
    // CHECK EXISTING REGISTRATION
    // -----------------------------------------------

    let existingRegistration =
      event.registrations.find(
        (registration) =>
          registration.user &&
          registration.user.toString() ===
            req.user._id.toString()
      );

    // -----------------------------------------------
    // EXISTING REGISTRATION
    // -----------------------------------------------

    if (existingRegistration) {

      // -------------------------------------------
      // PENDING
      // -------------------------------------------

      if (
        existingRegistration.status ===
        "pending"
      ) {
        return res.status(400).json({
          message:
            "Your registration is already waiting for staff approval",
        });
      }

      // -------------------------------------------
      // APPROVED
      // -------------------------------------------

      if (
        existingRegistration.status ===
        "approved"
      ) {
        return res.status(400).json({
          message:
            "You are already registered for this event",
        });
      }

      // -------------------------------------------
      // REJECTED → REGISTER AGAIN
      // -------------------------------------------

      if (
        existingRegistration.status ===
        "rejected"
      ) {
        existingRegistration.status =
          "pending";

        existingRegistration.participationInterest =
          participationInterest.trim();

        existingRegistration.message =
          message.trim();

        existingRegistration.registeredAt =
          new Date();

        existingRegistration.reviewedAt =
          null;

        existingRegistration.reviewedBy =
          null;

        await event.save();

        return res.status(200).json({
          message:
            "Registration submitted again. Waiting for staff approval.",
        });
      }
    }

    // -----------------------------------------------
    // NEW REGISTRATION
    // -----------------------------------------------

    event.registrations.push({
      user: req.user._id,

      participationInterest:
        participationInterest.trim(),

      message:
        message.trim(),

      status: "pending",

      registeredAt: new Date(),

      reviewedAt: null,

      reviewedBy: null,
    });

    await event.save();

    return res.status(201).json({
      message:
        "Registration submitted. Waiting for staff approval.",
    });

  } catch (error) {
    console.error(
      "REGISTER EVENT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to register for event",
    });
  }
};

// =====================================================
// APPROVE REGISTRATION - STAFF
// =====================================================

const approveRegistration = async (
  req,
  res
) => {
  try {

    // -----------------------------------------------
    // STAFF CHECK
    // -----------------------------------------------

    if (req.user.role !== "staff") {
      return res.status(403).json({
        message:
          "Only staff can approve registrations",
      });
    }

    // -----------------------------------------------
    // FIND EVENT
    // -----------------------------------------------

    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // -----------------------------------------------
    // FIND REGISTRATION
    // -----------------------------------------------

    const registration =
      event.registrations.id(
        req.params.registrationId
      );

    if (!registration) {
      return res.status(404).json({
        message:
          "Registration not found",
      });
    }

    // -----------------------------------------------
    // OLD REGISTRATION SAFETY
    // -----------------------------------------------

    if (
      !registration.participationInterest
    ) {
      registration.participationInterest =
        "Other";
    }

    if (!registration.message) {
      registration.message = "";
    }

    // -----------------------------------------------
    // ALREADY APPROVED
    // -----------------------------------------------

    if (
      registration.status ===
      "approved"
    ) {
      return res.status(400).json({
        message:
          "Registration is already approved",
      });
    }

    // -----------------------------------------------
    // UPDATE STATUS
    // -----------------------------------------------

    registration.status =
      "approved";

    registration.reviewedAt =
      new Date();

    registration.reviewedBy =
      req.user._id;

    // -----------------------------------------------
    // SAVE EVENT
    // -----------------------------------------------

    await event.save();

    // =================================================
    // CREATE APPROVAL NOTIFICATION
    // =================================================

    try {

      await Notification.create({
        receiver:
          registration.user,

        sender:
          req.user._id,

        title:
          "Event Registration Approved",

        message:
          `Your registration for "${event.title}" has been approved by the event coordinator.`,

        type:
          "event",

        isRead:
          false,
      });

    } catch (notificationError) {

      console.error(
        "APPROVAL NOTIFICATION ERROR:",
        notificationError
      );

    }

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.json({
      message:
        "Registration approved successfully",

      registration,
    });

  } catch (error) {

    console.error(
      "APPROVE REGISTRATION ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to approve registration",
    });
  }
};

// =====================================================
// REJECT REGISTRATION - STAFF
// =====================================================

const rejectRegistration = async (
  req,
  res
) => {
  try {

    // -----------------------------------------------
    // STAFF CHECK
    // -----------------------------------------------

    if (req.user.role !== "staff") {
      return res.status(403).json({
        message:
          "Only staff can reject registrations",
      });
    }

    // -----------------------------------------------
    // FIND EVENT
    // -----------------------------------------------

    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // -----------------------------------------------
    // FIND REGISTRATION
    // -----------------------------------------------

    const registration =
      event.registrations.id(
        req.params.registrationId
      );

    if (!registration) {
      return res.status(404).json({
        message:
          "Registration not found",
      });
    }

    // -----------------------------------------------
    // OLD REGISTRATION SAFETY
    // -----------------------------------------------

    if (
      !registration.participationInterest
    ) {
      registration.participationInterest =
        "Other";
    }

    if (!registration.message) {
      registration.message = "";
    }

    // -----------------------------------------------
    // ALREADY REJECTED
    // -----------------------------------------------

    if (
      registration.status ===
      "rejected"
    ) {
      return res.status(400).json({
        message:
          "Registration is already rejected",
      });
    }

    // -----------------------------------------------
    // UPDATE STATUS
    // -----------------------------------------------

    registration.status =
      "rejected";

    registration.reviewedAt =
      new Date();

    registration.reviewedBy =
      req.user._id;

    // -----------------------------------------------
    // SAVE EVENT
    // -----------------------------------------------

    await event.save();

    // =================================================
    // CREATE REJECTION NOTIFICATION
    // =================================================

    try {

      await Notification.create({
        receiver:
          registration.user,

        sender:
          req.user._id,

        title:
          "Event Registration Rejected",

        message:
          `Your registration for "${event.title}" has been rejected by the event coordinator.`,

        type:
          "event",

        isRead:
          false,
      });

    } catch (notificationError) {

      console.error(
        "REJECTION NOTIFICATION ERROR:",
        notificationError
      );

    }

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.json({
      message:
        "Registration rejected and notification sent",

      registration,
    });

  } catch (error) {

    console.error(
      "REJECT REGISTRATION ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to reject registration",
    });
  }
};

// =====================================================
// GET EVENT REGISTRATIONS - STAFF
// =====================================================

const getEventRegistrations = async (
  req,
  res
) => {
  try {

    if (req.user.role !== "staff") {
      return res.status(403).json({
        message:
          "Only staff can view registrations",
      });
    }

    const event =
      await Event.findById(
        req.params.id
      )
        .populate(
          "registrations.user",
          "name email role department passingYear"
        )
        .populate(
          "registrations.reviewedBy",
          "name email role"
        );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.json({
      event: event.title,

      registrations:
        event.registrations,
    });

  } catch (error) {

    console.error(
      "GET REGISTRATIONS ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load registrations",
    });
  }
};

// =====================================================
// UPDATE EVENT - STAFF
// =====================================================

const updateEvent = async (
  req,
  res
) => {
  try {

    if (req.user.role !== "staff") {
      return res.status(403).json({
        message:
          "Only staff can update events",
      });
    }

    const {
      title,
      category,
      date,
      location,
      description,
      status,
    } = req.body || {};

    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (title !== undefined)
      event.title =
        title.trim();

    if (category !== undefined)
      event.category =
        category.trim();

    if (date !== undefined)
      event.date = date;

    if (location !== undefined)
      event.location =
        location.trim();

    if (description !== undefined)
      event.description =
        description.trim();

    if (status !== undefined)
      event.status = status;

    await event.save();

    return res.json({
      message:
        "Event updated successfully",

      event,
    });

  } catch (error) {

    console.error(
      "UPDATE EVENT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to update event",
    });
  }
};

// =====================================================
// DELETE EVENT - STAFF
// =====================================================

const deleteEvent = async (
  req,
  res
) => {
  try {

    if (req.user.role !== "staff") {
      return res.status(403).json({
        message:
          "Only staff can delete events",
      });
    }

    const event =
      await Event.findById(
        req.params.id
      );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    await Event.findByIdAndDelete(
      req.params.id
    );

    return res.json({
      message:
        "Event deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE EVENT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to delete event",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createEvent,
  getEvents,
  getAllEventsForStaff,
  registerEvent,
  approveRegistration,
  rejectRegistration,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
};