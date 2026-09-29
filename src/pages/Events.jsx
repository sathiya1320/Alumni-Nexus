import React, {
  useEffect,
  useState,
} from "react";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserTie,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

import "./Events.css";

function Events() {
  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const navigate =
    useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // ==========================================
  // FETCH EVENTS
  // ==========================================

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response =
        await API.get("/events");

      setEvents(
        response.data || []
      );
    } catch (error) {
      console.error(
        "EVENT FETCH ERROR:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ==========================================
  // OPEN REGISTRATION PAGE
  // ==========================================

  const handleRegister = (
    eventId
  ) => {
    navigate(
      `/event-registration/${eventId}`
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Date not available";
    }

    return new Date(date)
      .toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="events-page">
        <div className="events-header">
          <div>
            <h1>Events</h1>

            <p>
              Discover upcoming alumni events
              and activities.
            </p>
          </div>
        </div>

        <div className="events-message">
          <div className="event-spinner"></div>

          <p>
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="events-page">

      {/* HEADER */}

      <div className="events-header">

        <div>
          <h1>
            Events
          </h1>

          <p>
            Discover upcoming alumni events
            and activities.
          </p>
        </div>

        {user?.role === "staff" && (
          <button
            className="create-event-btn"
            onClick={() =>
              navigate("/staff-events")
            }
          >
            + Create Event
          </button>
        )}

      </div>

      {/* ERROR */}

      {error && (
        <div className="events-error">

          <h3>
            Unable to Load Events
          </h3>

          <p>
            {error}
          </p>

          <button
            onClick={fetchEvents}
          >
            Try Again
          </button>

        </div>
      )}

      {/* NO EVENTS */}

      {!error &&
        events.length === 0 && (
          <div className="no-events">

            <div className="no-events-icon">
              <FaCalendarAlt />
            </div>

            <h2>
              No Events Available
            </h2>

            <p>
              No events have been created yet.
              Please check again later.
            </p>

          </div>
        )}

      {/* EVENT GRID */}

      {!error &&
        events.length > 0 && (

          <div className="events-grid">

            {events.map(
              (event) => {

                const registration =
                  event.myRegistration;

                const status =
                  registration?.status;

                return (
                  <div
                    className="event-card"
                    key={event._id}
                  >

                    {/* CATEGORY */}

                    <div className="event-top">
                      <span>
                        {event.category ||
                          "General Event"}
                      </span>
                    </div>

                    {/* TITLE */}

                    <h2>
                      {event.title}
                    </h2>

                    {/* DATE */}

                    <p className="event-info">

                      <FaCalendarAlt />

                      <span>
                        {formatDate(
                          event.date
                        )}
                      </span>

                    </p>

                    {/* LOCATION */}

                    <p className="event-info">

                      <FaMapMarkerAlt />

                      <span>
                        {event.location ||
                          "Location not available"}
                      </span>

                    </p>

                    {/* DESCRIPTION */}

                    <p className="event-description">
                      {event.description ||
                        "No description available."}
                    </p>

                    {/* CREATED BY */}

                    <div className="event-created">

                      <FaUserTie />

                      <span>
                        Organized by{" "}

                        <strong>
                          {event.createdBy?.name ||
                            "Staff"}
                        </strong>
                      </span>

                    </div>

                    {/* STUDENT / ALUMNI */}

                    {(user?.role === "student" ||
                      user?.role === "alumni") && (

                      <button
                        className={
                          status === "approved"
                            ? "registered-btn"
                            : status === "pending"
                            ? "pending-btn"
                            : status === "rejected"
                            ? "register-btn"
                            : "register-btn"
                        }
                        disabled={
                          status === "approved" ||
                          status === "pending"
                        }
                        onClick={() =>
                          handleRegister(
                            event._id
                          )
                        }
                      >

                        {status === "approved"
                          ? "✓ Registered"
                          : status === "pending"
                          ? "⏳ Pending Approval"
                          : status === "rejected"
                          ? "Register Again"
                          : "Register Now"}

                      </button>
                    )}

                    {/* STAFF */}

                    {user?.role === "staff" && (

                      <div className="staff-event-info">

                        <span>
                          Registrations
                        </span>

                        <strong>
                          {event.registrationCount ||
                            0}
                        </strong>

                      </div>

                    )}

                  </div>
                );
              }
            )}

          </div>
        )}

    </div>
  );
}

export default Events;